import { Box, Button, Card, Flex, Grid, Heading, Select, Spinner, Stack, Text } from '@sanity/ui'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useClient } from 'sanity'

import {
  METHOD_LABELS,
  PAID_STATUS_VALUES,
  PERIOD_LABELS,
  buildLedgerRows,
  buildSummaryRows,
  localDate,
  money,
  rangeFor,
  summarise,
  toCsv,
  type OfflineRow,
  type OnlineRow,
  type Period,
} from '@/lib/reconcile'

/**
 * Reconciliation summary for the records workspace.
 *
 * Deliberately not a chart: every figure here is a single magnitude the
 * treasurer needs to read exactly and tie back to a bank statement, so stat
 * tiles and a table are the right form. A trend line would add decoration and
 * no information.
 *
 * The arithmetic lives in `@/lib/reconcile` so it can be unit tested — this
 * file is only presentation.
 */

const QUERY = `{
  "online": *[_type == "donation" && isTest != true && lower(status) in $paid
              && defined(paidAt) && paidAt >= $fromIso && paidAt < $toIso]
    | order(paidAt desc){
      reference, amount, currency, donorName, donorEmail, phone,
      method, tierLabel, status, paidAt, paynowReference
    },
  "offline": *[_type == "offlineDonation" && receivedAt >= $fromDate && receivedAt < $toDate]
    | order(receivedAt desc){
      receivedAt, amount, method, donorName, donorContact,
      bankReference, inKindDescription, notes, recordedBy, thanked
    }
}`

function download(filename: string, csv: string): void {
  // The BOM makes Excel read it as UTF-8 rather than the system codepage,
  // which otherwise mangles names with accents.
  const blob = new Blob([`﻿${csv}`], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

function StatTile({ label, value, note }: { label: string; value: string; note?: string }) {
  return (
    <Card padding={4} radius={2} tone="transparent" border>
      <Stack space={3}>
        <Text size={1} muted>
          {label}
        </Text>
        <Text size={4} weight="semibold">
          {value}
        </Text>
        {note && (
          <Text size={1} muted>
            {note}
          </Text>
        )}
      </Stack>
    </Card>
  )
}

export function ReconciliationPanel() {
  const client = useClient({ apiVersion: '2024-10-01' })
  const [period, setPeriod] = useState<Period>('thisMonth')
  const [online, setOnline] = useState<OnlineRow[]>([])
  const [offline, setOffline] = useState<OfflineRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    const { from, to } = rangeFor(period)

    setLoading(true)
    setError(null)

    client
      .fetch<{ online: OnlineRow[]; offline: OfflineRow[] }>(QUERY, {
        paid: PAID_STATUS_VALUES,
        fromIso: from.toISOString(),
        toIso: to.toISOString(),
        fromDate: localDate(from),
        toDate: localDate(to),
      })
      .then((result) => {
        if (cancelled) return
        setOnline(result?.online ?? [])
        setOffline(result?.offline ?? [])
        setLoading(false)
      })
      .catch((err: unknown) => {
        if (cancelled) return
        setError(err instanceof Error ? err.message : 'Could not load donations.')
        setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [client, period])

  const totals = useMemo(() => summarise(online, offline), [online, offline])

  const exportLedger = useCallback(() => {
    download(
      `motherscomfort-donations-${period}-${localDate(new Date())}.csv`,
      toCsv(buildLedgerRows(online, offline, totals)),
    )
  }, [online, offline, period, totals])

  const exportSummary = useCallback(() => {
    download(
      `motherscomfort-summary-${period}-${localDate(new Date())}.csv`,
      toCsv(buildSummaryRows(online, offline, totals, period)),
    )
  }, [online, offline, period, totals])

  return (
    <Box padding={4}>
      <Stack space={5}>
        <Flex align="center" gap={3} wrap="wrap">
          <Box flex={1}>
            <Heading size={1}>Donations summary</Heading>
          </Box>
          <Select
            value={period}
            onChange={(event) => setPeriod(event.currentTarget.value as Period)}
            fontSize={1}
            padding={3}
          >
            {(Object.keys(PERIOD_LABELS) as Period[]).map((key) => (
              <option key={key} value={key}>
                {PERIOD_LABELS[key]}
              </option>
            ))}
          </Select>
        </Flex>

        {error && (
          <Card padding={4} radius={2} tone="critical">
            <Text size={1}>Could not load donations: {error}</Text>
          </Card>
        )}

        {loading ? (
          <Flex align="center" justify="center" padding={5}>
            <Spinner muted />
          </Flex>
        ) : (
          <>
            <Card padding={4} radius={2} tone="primary" border>
              <Stack space={3}>
                <Text size={1} muted>
                  Total received — {PERIOD_LABELS[period].toLowerCase()}
                </Text>
                <Text size={5} weight="semibold">
                  {money(totals.total)}
                </Text>
                <Text size={1} muted>
                  {totals.count} {totals.count === 1 ? 'gift' : 'gifts'}
                  {totals.inKindCount > 0 &&
                    ` · ${totals.inKindCount} gift${
                      totals.inKindCount === 1 ? '' : 's'
                    } of goods not valued`}
                </Text>
              </Stack>
            </Card>

            <Grid columns={[1, 1, 3]} gap={3}>
              <StatTile
                label="Online (Paynow)"
                value={money(totals.onlineTotal)}
                note={`${online.length} ${online.length === 1 ? 'donation' : 'donations'}`}
              />
              <StatTile
                label="Offline (bank, cash, mobile)"
                value={money(totals.offlineTotal)}
                note={`${offline.length} ${offline.length === 1 ? 'record' : 'records'}`}
              />
              <StatTile
                label="Gifts of goods"
                value={String(totals.inKindCount)}
                note="Counted, never valued"
              />
            </Grid>

            <Stack space={3}>
              <Text size={1} weight="semibold">
                By method
              </Text>
              <Card radius={2} border overflow="auto">
                {totals.byMethod.length === 0 ? (
                  <Box padding={4}>
                    <Text size={1} muted>
                      Nothing received in this period.
                    </Text>
                  </Box>
                ) : (
                  totals.byMethod.map(([method, entry], index) => (
                    <Flex
                      key={method}
                      padding={3}
                      align="center"
                      gap={3}
                      style={
                        index > 0 ? { borderTop: '1px solid var(--card-border-color)' } : undefined
                      }
                    >
                      <Box flex={1}>
                        <Text size={1}>{METHOD_LABELS[method] ?? method}</Text>
                      </Box>
                      <Text size={1} muted style={{ fontVariantNumeric: 'tabular-nums' }}>
                        {entry.count}
                      </Text>
                      <Box style={{ minWidth: '6rem', textAlign: 'right' }}>
                        <Text size={1} style={{ fontVariantNumeric: 'tabular-nums' }}>
                          {money(entry.total)}
                        </Text>
                      </Box>
                    </Flex>
                  ))
                )}
              </Card>
            </Stack>

            <Flex gap={3} wrap="wrap">
              <Button
                text="Download full ledger (CSV)"
                tone="primary"
                fontSize={1}
                padding={3}
                onClick={exportLedger}
                disabled={totals.count === 0}
              />
              <Button
                text="Download summary (CSV)"
                mode="ghost"
                fontSize={1}
                padding={3}
                onClick={exportSummary}
                disabled={totals.count === 0}
              />
            </Flex>

            <Text size={1} muted>
              Figures exclude test transactions and anything a donor started but never paid.
              Gifts of goods are counted but carry no cash value, so they never affect the total.
            </Text>
          </>
        )}
      </Stack>
    </Box>
  )
}

export default ReconciliationPanel
