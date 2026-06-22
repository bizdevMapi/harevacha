import { useMemo, useState } from 'react'
import type { ServiceListColumn, ServiceListItem } from '../../data/servicesListTypes'
import { formatServiceCost, SERVICE_LIST_COLUMNS } from '../../data/servicesListTypes'
import type { MapPointInfoField } from '../map/MapPointInfoCard'

const TABLE_MIN_WIDTH = SERVICE_LIST_COLUMNS.reduce((sum, col) => sum + col.width, 0)

function IconSort() {
  return (
    <svg className="size-3 shrink-0 text-[#8a97a9]" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d="M5 6.5 8 3.8 11 6.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
      <path d="M5 9.5 8 12.2 11 9.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
    </svg>
  )
}

function TableHeaderCell({ column }: { column: ServiceListColumn }) {
  return (
    <th
      scope="col"
      style={{ width: column.width, minWidth: column.width, maxWidth: column.width }}
      className="h-8 border-b border-l border-[#dce3ec] bg-[#f3f6fa] px-1.5 text-right align-middle text-[11px] font-semibold leading-[16px] text-[#5f708a] last:border-l-0"
    >
      <span className="block w-full truncate text-right">{column.label}</span>
    </th>
  )
}

function TableBodyCell({
  row,
  column,
  onServiceClick,
}: {
  row: ServiceListItem
  column: ServiceListColumn
  onServiceClick?: (row: ServiceListItem) => void
}) {
  const baseClass =
    'h-8 border-b border-l border-[#dce3ec] bg-white px-1.5 text-right align-middle text-[11px] leading-[16px] text-[#34404f] last:border-l-0'

  if (column.cellType === 'link') {
    return (
      <td
        style={{ width: column.width, minWidth: column.width, maxWidth: column.width }}
        className={baseClass}
      >
        <button
          type="button"
          onClick={() => onServiceClick?.(row)}
          className="block w-full truncate text-right font-medium text-[#1e6fb8] hover:underline"
          title={row.ServiceName}
        >
          {row.ServiceName || '—'}
        </button>
      </td>
    )
  }

  if (column.cellType === 'tags') {
    const value = String(row[column.id as keyof ServiceListItem] ?? '')
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
  onServiceClick?: (fields: MapPointInfoField[]) => void
}

const convertServiceToPointInfo = (service: ServiceListItem): MapPointInfoField[] => {
  const fields: MapPointInfoField[] = []

  const addField = (fieldName: string, fieldValue: unknown) => {
    if (fieldValue != null && String(fieldValue).trim() !== '') {
      fields.push({ fieldName, fieldValue })
    }
  }

  addField('servicename', service.ServiceName)
  addField('fulladdress', service.FullAddress)
  addField('servicetypename', service.servicetypename)
  addField('targetpopulations', service.TargetPopulations)
  addField('requirespaymentamount', service.RequiresPaymentAmount)
  addField('requirespayment', service.RequiresPayment)
  addField('serviceproviderorganizationtype', service.ServiceProviderOrganizationType)
  addField('language', service.Language)
  addField('airisktype', service.airisktype)
  addField('accessibility', service.Accessibility)
  addField('providername', service.ProviderName)
  addField('gisx', service.GisX)
  addField('gisy', service.GisY)

  return fields
}

const ServicesListTable = ({ rows, searchQuery = '', onServiceClick }: ServicesListTableProps) => {
  const [sortAsc, setSortAsc] = useState(true)

  const handleServiceClick = (row: ServiceListItem) => {
    const fields = convertServiceToPointInfo(row)
    onServiceClick?.(fields)
  }

  const filteredRows = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    if (!q) return rows

    return rows.filter((row) => {
      const haystack = [row.ServiceName, row.FullAddress, row.servicetypename]
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
    <div className="flex min-h-0 flex-1 items-start justify-start overflow-auto border-t border-[#dce3ec] bg-white" dir="rtl">
      <table
        className="shrink-0 self-start table-fixed border-collapse text-right"
        style={{ width: TABLE_MIN_WIDTH }}
      >
        <thead className="sticky top-0 z-10">
          <tr>
            {SERVICE_LIST_COLUMNS.map((column) =>
              column.sortable === true ? (
                <th
                  key={column.id}
                  scope="col"
                  style={{ width: column.width, minWidth: column.width, maxWidth: column.width }}
                  className="h-8 border-b border-l border-[#dce3ec] bg-[#f3f6fa] px-1.5 text-right align-middle text-[11px] font-semibold leading-[16px] text-[#5f708a] last:border-l-0"
                >
                  <button
                    type="button"
                    onClick={() => setSortAsc((prev) => !prev)}
                    className="flex h-full w-full items-center justify-start gap-1.5 overflow-hidden text-right"
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
            <tr key={row.objectId} className="group transition-colors hover:bg-[#f9fbfe]">
              {SERVICE_LIST_COLUMNS.map((column) => (
                <TableBodyCell key={column.id} row={row} column={column} onServiceClick={handleServiceClick} />
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default ServicesListTable
