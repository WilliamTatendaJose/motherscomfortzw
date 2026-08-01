/**
 * Reconciliation maths and CSV generation.
 *
 * Kept out of the Studio component and free of React so the money can be unit
 * tested — a wrong total here is a wrong figure in the charity's accounts, and
 * that is not something to verify by looking at it.
 *
 * Runs in the browser (the Sanity Studio), so nothing here may import
 * `server-only` or touch the filesystem.
 */

export const PAID_STATUS_VALUES = ['paid', 'awaiting delivery', 'delivered']

export type OnlineRow = {
  reference?: string
  amount?: number
  currency?: string
  donorName?: string
  donorEmail?: string
  phone?: string
  method?: string
  tierLabel?: string
  status?: string
  paidAt?: string
  paynowReference?: string
}

export type OfflineRow = {
  receivedAt?: string
  amount?: number
  method?: string
  donorName?: string
  donorContact?: string
  bankReference?: string
  inKindDescription?: string
  notes?: string
  recordedBy?: string
  thanked?: boolean
}

export type Period = 'thisMonth' | 'lastMonth' | 'thisYear' | 'lastYear' | 'all'

export const PERIOD_LABELS: Record<Period, string> = {
  thisMonth: 'This month',
  lastMonth: 'Last month',
  thisYear: 'This year',
  lastYear: 'Last year',
  all: 'All time',
}

export const METHOD_LABELS: Record<string, string> = {
  web: 'Paynow (card / web)',
  ecocash: 'EcoCash',
  onemoney: 'OneMoney',
  innbucks: 'InnBucks',
  bank: 'Bank transfer',
  cash: 'Cash',
  mobile: 'EcoCash / OneMoney (direct)',
  inKind: 'Goods (in-kind)',
  other: 'Other',
}

const methodLabel = (method: string | undefined): string =>
  METHOD_LABELS[method ?? ''] ?? method ?? ''

/** Local calendar date as YYYY-MM-DD. `receivedAt` is a date, not an instant. */
export function localDate(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${date.getFullYear()}-${month}-${day}`
}

/**
 * Boundaries are the *local* midnights a treasurer means by "this month" —
 * half-open, so a gift at 23:59 on the last day belongs to the month it was
 * given and never appears in two periods at once.
 */
export function rangeFor(period: Period, now: Date = new Date()): { from: Date; to: Date } {
  const year = now.getFullYear()
  const month = now.getMonth()

  switch (period) {
    case 'thisMonth':
      return { from: new Date(year, month, 1), to: new Date(year, month + 1, 1) }
    case 'lastMonth':
      return { from: new Date(year, month - 1, 1), to: new Date(year, month, 1) }
    case 'thisYear':
      return { from: new Date(year, 0, 1), to: new Date(year + 1, 0, 1) }
    case 'lastYear':
      return { from: new Date(year - 1, 0, 1), to: new Date(year, 0, 1) }
    case 'all':
    default:
      return { from: new Date(1970, 0, 1), to: new Date(year + 100, 0, 1) }
  }
}

export const money = (value: number): string =>
  `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

export type Totals = {
  onlineTotal: number
  offlineTotal: number
  total: number
  count: number
  inKindCount: number
  byMethod: [string, { count: number; total: number }][]
}

/**
 * Adds up a period.
 *
 * Amounts are summed in cents and divided once at the end: adding floats
 * directly makes 0.1 + 0.2 into 0.30000000000000004, and a total that fails to
 * match the bank statement by a fraction of a cent is worse than useless.
 *
 * Gifts of goods carry no agreed cash value, so they are counted and never
 * valued — inventing a number for them would overstate income.
 */
export function summarise(online: OnlineRow[], offline: OfflineRow[]): Totals {
  const cents = (value: number | undefined): number =>
    typeof value === 'number' && Number.isFinite(value) ? Math.round(value * 100) : 0

  const onlineCents = online.reduce((sum, row) => sum + cents(row.amount), 0)
  const offlineCents = offline.reduce((sum, row) => sum + cents(row.amount), 0)

  const byMethod = new Map<string, { count: number; total: number }>()
  const add = (key: string, amount: number | undefined) => {
    const entry = byMethod.get(key) ?? { count: 0, total: 0 }
    byMethod.set(key, { count: entry.count + 1, total: entry.total + cents(amount) })
  }
  for (const row of online) add(row.method ?? 'web', row.amount)
  for (const row of offline) add(row.method ?? 'other', row.amount)

  return {
    onlineTotal: onlineCents / 100,
    offlineTotal: offlineCents / 100,
    total: (onlineCents + offlineCents) / 100,
    count: online.length + offline.length,
    inKindCount: offline.filter((row) => typeof row.amount !== 'number').length,
    byMethod: [...byMethod.entries()]
      .map(([key, entry]) => [key, { count: entry.count, total: entry.total / 100 }] as const)
      .sort((a, b) => b[1].total - a[1].total)
      .map(([key, entry]) => [key, entry] as [string, { count: number; total: number }]),
  }
}

export type CsvCell = string | number | null | undefined

/** RFC 4180: quote every field, double any internal quote. */
export function toCsv(rows: CsvCell[][]): string {
  return rows
    .map((row) => row.map((cell) => `"${String(cell ?? '').replace(/"/g, '""')}"`).join(','))
    .join('\r\n')
}

/** One row per gift, both sources interleaved — what a treasurer ticks off. */
export function buildLedgerRows(
  online: OnlineRow[],
  offline: OfflineRow[],
  totals: Totals,
): CsvCell[][] {
  const rows: CsvCell[][] = [
    [
      'Date',
      'Source',
      'Method',
      'Amount (USD)',
      'Donor',
      'Contact',
      'Reference',
      'Paynow reference',
      'Status',
      'Notes',
    ],
  ]

  for (const row of online) {
    rows.push([
      row.paidAt ? row.paidAt.slice(0, 10) : '',
      'Paynow',
      methodLabel(row.method),
      typeof row.amount === 'number' ? row.amount.toFixed(2) : '',
      row.donorName ?? '',
      row.donorEmail || row.phone || '',
      row.reference ?? '',
      row.paynowReference ?? '',
      row.status ?? '',
      row.tierLabel ?? '',
    ])
  }

  for (const row of offline) {
    rows.push([
      row.receivedAt ?? '',
      'Offline',
      methodLabel(row.method),
      typeof row.amount === 'number' ? row.amount.toFixed(2) : '',
      row.donorName ?? '',
      row.donorContact ?? '',
      row.bankReference ?? '',
      '',
      row.thanked ? 'Thanked' : '',
      [row.inKindDescription, row.notes, row.recordedBy ? `Recorded by ${row.recordedBy}` : '']
        .filter(Boolean)
        .join(' — '),
    ])
  }

  rows.push([])
  rows.push(['', '', 'Total received', totals.total.toFixed(2)])
  if (totals.inKindCount > 0) {
    rows.push(['', '', 'Gifts of goods (not valued)', totals.inKindCount])
  }

  return rows
}

export function buildSummaryRows(
  online: OnlineRow[],
  offline: OfflineRow[],
  totals: Totals,
  period: Period,
  generatedAt: Date = new Date(),
): CsvCell[][] {
  return [
    ['Period', PERIOD_LABELS[period]],
    ['Generated', generatedAt.toISOString()],
    [],
    ['Method', 'Gifts', 'Total (USD)'],
    ...totals.byMethod.map(([method, entry]) => [
      methodLabel(method),
      entry.count,
      entry.total.toFixed(2),
    ]),
    [],
    ['Online (Paynow)', online.length, totals.onlineTotal.toFixed(2)],
    ['Offline', offline.length, totals.offlineTotal.toFixed(2)],
    ['Total received', totals.count, totals.total.toFixed(2)],
  ]
}
