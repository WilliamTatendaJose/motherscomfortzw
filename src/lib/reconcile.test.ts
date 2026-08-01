import { describe, expect, it } from 'vitest'

import {
  buildLedgerRows,
  buildSummaryRows,
  localDate,
  rangeFor,
  summarise,
  toCsv,
  type OfflineRow,
  type OnlineRow,
} from './reconcile'

describe('summarise', () => {
  it('adds online and offline gifts into one total', () => {
    const online: OnlineRow[] = [{ amount: 10, method: 'ecocash' }, { amount: 100, method: 'web' }]
    const offline: OfflineRow[] = [{ amount: 250.5, method: 'bank' }]

    const totals = summarise(online, offline)

    expect(totals.onlineTotal).toBe(110)
    expect(totals.offlineTotal).toBe(250.5)
    expect(totals.total).toBe(360.5)
    expect(totals.count).toBe(3)
  })

  it('does not accumulate floating point error across many gifts', () => {
    // 0.1 + 0.2 !== 0.3 in binary floating point; a total that is a fraction of
    // a cent out will not tie to a bank statement.
    const online: OnlineRow[] = [{ amount: 0.1 }, { amount: 0.2 }]
    expect(summarise(online, []).total).toBe(0.3)

    const many: OnlineRow[] = Array.from({ length: 1000 }, () => ({ amount: 0.07 }))
    expect(summarise(many, []).total).toBe(70)
  })

  it('counts gifts of goods but never values them', () => {
    const offline: OfflineRow[] = [
      { method: 'inKind', inKindDescription: '12 packs of nappies' },
      { method: 'bank', amount: 50 },
    ]

    const totals = summarise([], offline)

    expect(totals.inKindCount).toBe(1)
    expect(totals.offlineTotal).toBe(50)
    expect(totals.count).toBe(2)
  })

  it('ignores a missing or non-finite amount rather than producing NaN', () => {
    const totals = summarise([{ amount: undefined }, { amount: Number.NaN }, { amount: 5 }], [])
    expect(totals.total).toBe(5)
  })

  it('groups by method, largest first', () => {
    const online: OnlineRow[] = [
      { amount: 10, method: 'ecocash' },
      { amount: 5, method: 'ecocash' },
      { amount: 100, method: 'web' },
    ]
    const offline: OfflineRow[] = [{ amount: 40, method: 'bank' }]

    const byMethod = Object.fromEntries(summarise(online, offline).byMethod)

    expect(byMethod.ecocash).toEqual({ count: 2, total: 15 })
    expect(byMethod.web).toEqual({ count: 1, total: 100 })
    expect(byMethod.bank).toEqual({ count: 1, total: 40 })
    expect(summarise(online, offline).byMethod[0][0]).toBe('web')
  })

  it('returns zeroes for an empty period rather than throwing', () => {
    const totals = summarise([], [])
    expect(totals).toMatchObject({ total: 0, count: 0, inKindCount: 0 })
    expect(totals.byMethod).toEqual([])
  })
})

describe('rangeFor', () => {
  const now = new Date(2026, 7, 15) // 15 August 2026, local

  it('bounds this month half-open so a gift never lands in two periods', () => {
    const { from, to } = rangeFor('thisMonth', now)
    expect(localDate(from)).toBe('2026-08-01')
    expect(localDate(to)).toBe('2026-09-01')
  })

  it('rolls back across a year boundary for last month', () => {
    const { from, to } = rangeFor('lastMonth', new Date(2026, 0, 10))
    expect(localDate(from)).toBe('2025-12-01')
    expect(localDate(to)).toBe('2026-01-01')
  })

  it('covers whole calendar years', () => {
    expect(localDate(rangeFor('thisYear', now).from)).toBe('2026-01-01')
    expect(localDate(rangeFor('lastYear', now).from)).toBe('2025-01-01')
    expect(localDate(rangeFor('lastYear', now).to)).toBe('2026-01-01')
  })

  it('spans everything for all time', () => {
    const { from, to } = rangeFor('all', now)
    expect(from.getFullYear()).toBe(1970)
    expect(to.getFullYear()).toBeGreaterThan(now.getFullYear())
  })
})

describe('toCsv', () => {
  it('quotes every field and escapes internal quotes', () => {
    expect(toCsv([['a', 'b']])).toBe('"a","b"')
    expect(toCsv([['say "hi"']])).toBe('"say ""hi"""')
  })

  it('keeps a comma inside a field from splitting the column', () => {
    const csv = toCsv([['Moyo, Grace', '10.00']])
    expect(csv).toBe('"Moyo, Grace","10.00"')
  })

  it('survives a newline inside a note', () => {
    expect(toCsv([['line one\nline two']])).toBe('"line one\nline two"')
  })

  it('renders null and undefined as empty, not as the words', () => {
    expect(toCsv([[null, undefined, 0]])).toBe('"","","0"')
  })
})

describe('buildLedgerRows', () => {
  const online: OnlineRow[] = [
    {
      reference: 'MC-ABC-1',
      amount: 100,
      method: 'ecocash',
      status: 'Paid',
      paidAt: '2026-08-01T21:29:02.933Z',
      donorName: 'Tendai',
      donorEmail: 'tendai@example.com',
      paynowReference: 'PN-1',
    },
  ]
  const offline: OfflineRow[] = [
    {
      receivedAt: '2026-08-03',
      amount: 250.5,
      method: 'bank',
      donorName: 'Anonymous donor',
      bankReference: 'FT2608',
    },
  ]

  it('interleaves both sources under one header', () => {
    const rows = buildLedgerRows(online, offline, summarise(online, offline))

    expect(rows[0][0]).toBe('Date')
    expect(rows[1]).toContain('Paynow')
    expect(rows[2]).toContain('Offline')
  })

  it('reduces a payment instant to the calendar date', () => {
    const rows = buildLedgerRows(online, [], summarise(online, []))
    expect(rows[1][0]).toBe('2026-08-01')
  })

  it('writes amounts to two decimal places for the accounts package', () => {
    const rows = buildLedgerRows(online, offline, summarise(online, offline))
    expect(rows[1][3]).toBe('100.00')
    expect(rows[2][3]).toBe('250.50')
  })

  it('leaves the amount blank for goods instead of writing zero', () => {
    const goods: OfflineRow[] = [{ receivedAt: '2026-08-04', method: 'inKind' }]
    const rows = buildLedgerRows([], goods, summarise([], goods))
    expect(rows[1][3]).toBe('')
  })

  it('ends with a total that matches the summary', () => {
    const totals = summarise(online, offline)
    const rows = buildLedgerRows(online, offline, totals)
    const totalRow = rows.find((row) => row[2] === 'Total received')

    expect(totalRow?.[3]).toBe('350.50')
    expect(totalRow?.[3]).toBe(totals.total.toFixed(2))
  })
})

describe('buildSummaryRows', () => {
  it('reports online, offline and combined totals that agree', () => {
    const online: OnlineRow[] = [{ amount: 110, method: 'web' }]
    const offline: OfflineRow[] = [{ amount: 250.5, method: 'bank' }]
    const totals = summarise(online, offline)

    const rows = buildSummaryRows(online, offline, totals, 'thisMonth', new Date(0))
    const find = (label: string) => rows.find((row) => row[0] === label)

    expect(find('Online (Paynow)')?.[2]).toBe('110.00')
    expect(find('Offline')?.[2]).toBe('250.50')
    expect(find('Total received')?.[2]).toBe('360.50')
    expect(find('Total received')?.[1]).toBe(2)
  })
})
