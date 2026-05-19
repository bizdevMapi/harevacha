import { useMemo, useState } from 'react'
import type { ServiceListColumn, ServiceListItem } from '../../data/servicesListTypes'
import {
  formatServiceCost,
  SERVICE_LIST_COLUMNS,
  splitCommaList,
} from '../../data/servicesListTypes'

const TABLE_MIN_WIDTH = SERVICE_LIST_COLUMNS.reduce((sum, col) => sum + col.width, 0)

function IconSort() {
  return (
    <svg className="size-4 shrink-0 text-[#8695a7]" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d="M5 6.5 8 3.5 11 6.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M5 9.5 8 12.5 11 9.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  )
}

function TableHeaderCell({ column }: { column: ServiceListColumn }) {
  return (
    <th
      scope="col"
      style={{ width: column.width, minWidth: column.width, maxWidth: column.width }}
      className="h-9 border-b border-l border-[#e0e5eb] bg-[#f5f8fc] px-2 text-right align-middle font-semibold text-xs leading-[18px] text-[#5f708a] first:border-l-0"
    >
      <span className="block w-full truncate text-right">{column.label}</span>
    </th>
  )
}

function RiskTagsCell({ value }: { value: string }) {
  const tags = splitCommaList(value)
  if (tags.length === 0) return <span className="text-[#8695a7]">—</span>

  const visible = tags.slice(0, 2)
  const hiddenCount = tags.length - visible.length

  return (
    <div className="flex items-center justify-start gap-2 overflow-hidden">
      {visible.map((tag) => (
        <span
          key={tag}
          className="max-w-[72px] truncate rounded border border-[#e0e5eb] bg-[#f5f8fc] px-2 py-0.5 text-xs leading-[18px] text-[#34404f]"
          title={tag}
        >
          {tag}
        </span>
      ))}
      {hiddenCount > 0 && (
        <span className="shrink-0 rounded border border-[#e0e5eb] bg-white px-1 py-0.5 text-xs font-medium leading-[18px] text-[#1277c5]">
          +{hiddenCount}
        </span>
      )}
    </div>
  )
}

function TableBodyCell({
  row,
  column,
}: {
  row: ServiceListItem
  column: ServiceListColumn
}) {
  const baseClass =
    'h-9 border-b border-l border-[#e0e5eb] bg-white px-2 text-right align-middle text-xs leading-[18px] text-[#34404f] first:border-l-0'

  if (column.cellType === 'link') {
    return (
      <td
        style={{ width: column.width, minWidth: column.width, maxWidth: column.width }}
        className={baseClass}
      >
        <button
          type="button"
          className="block w-full truncate text-right font-medium text-[#1277c5] hover:underline"
          title={row.ServiceName}
        >
          {row.ServiceName || '—'}
        </button>
      </td>
    )
  }

  if (column.cellType === 'tags') {
    return (
      <td
        style={{ width: column.width, minWidth: column.width, maxWidth: column.width }}
        className={baseClass}
      >
        <RiskTagsCell value={row.RiskStatusDescription_Agg} />
      </td>
    )
  }

  if (column.cellType === 'cost') {
    const cost = formatServiceCost(row.RequiresPayment, row.RequiresPaymentAmount)
    return (
      <td
        style={{ width: column.width, minWidth: column.width, maxWidth: column.width }}
        className={baseClass}
      >
        <span className="block truncate tabular-nums" title={cost}>
          {cost}
        </span>
      </td>
    )
  }

  const value =
    column.id === 'cost'
      ? ''
      : String(row[column.id as keyof ServiceListItem] ?? '')

  return (
    <td
      style={{ width: column.width, minWidth: column.width, maxWidth: column.width }}
      className={baseClass}
    >
      <span className="block truncate" title={value}>
        {value || '—'}
      </span>
    </td>
  )
}

type ServicesListTableProps = {
  rows: ServiceListItem[]
  searchQuery?: string
}

const ServicesListTable = ({ rows, searchQuery = '' }: ServicesListTableProps) => {
  const [sortAsc, setSortAsc] = useState(true)

  const filteredRows = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    if (!q) return rows

    return rows.filter((row) => {
      const haystack = [row.ServiceName, row.FullAddress, row.ServiceTypeDescription]
        .join(' ')
        .toLowerCase()
      return haystack.includes(q)
    })
  }, [rows, searchQuery])

  const sortedRows = useMemo(() => {
    return [...filteredRows].sort((a, b) => {
      const cmp = a.ServiceName.localeCompare(b.ServiceName, 'he')
      return sortAsc ? cmp : -cmp
    })
  }, [filteredRows, sortAsc])

  return (
    <div className="flex min-h-0 flex-1 justify-start overflow-auto bg-white" dir="rtl">
      <table
        className="shrink-0 table-fixed border-collapse text-right"
        style={{ width: TABLE_MIN_WIDTH }}
      >
        <thead className="sticky top-0 z-10">
          <tr>
            {SERVICE_LIST_COLUMNS.map((column) =>
              column.id === 'ServiceName' ? (
                <th
                  key={column.id}
                  scope="col"
                  style={{ width: column.width, minWidth: column.width, maxWidth: column.width }}
                  className="h-9 border-b border-l border-[#e0e5eb] bg-[#f5f8fc] px-2 text-right align-middle font-semibold text-xs leading-[18px] text-[#5f708a] first:border-l-0"
                >
                  <button
                    type="button"
                    onClick={() => setSortAsc((prev) => !prev)}
                    className="flex h-full w-full items-center justify-start gap-2 overflow-hidden text-right"
                  >
                    <span className="truncate">{column.label}</span>
                    <IconSort />
                  </button>
                </th>
              ) : (
                <TableHeaderCell key={column.id} column={column} />
              ),
            )}
          </tr>
        </thead>
        <tbody>
          {sortedRows.map((row) => (
            <tr key={row.objectId} className="group transition-colors hover:bg-[#fafbfd]">
              {SERVICE_LIST_COLUMNS.map((column) => (
                <TableBodyCell key={column.id} row={row} column={column} />
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default ServicesListTable
