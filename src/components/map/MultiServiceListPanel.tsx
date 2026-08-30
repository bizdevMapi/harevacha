import { buildDetailCells, InfoRow, ServiceHeaderContent } from './detailsGridUtils'

export type ServiceData = {
  objectId?: number
  servicename?: string
  servicetypename?: string
  fulladdress?: string
  servicedescription?: string
  targetpopulations?: string
  requirespayment?: string
  requirespaymentamount?: string
  serviceproviderorganizationtype?: string
  language?: string
  airisktype?: string
  accessibility?: string
  providername?: string
}

type MultiServiceListPanelProps = {
  services: ServiceData[]
  address?: string
  onSelect?: (index: number) => void
}

const ServiceListItem = ({
  service,
  onClick,
}: {
  index: number
  service: ServiceData
  onClick?: () => void
}) => {
  const detailCells = buildDetailCells(service)

  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex flex-col gap-4 rounded-2xl border border-[#e0e5eb] bg-white p-4 text-right transition-colors hover:bg-[#f5f8fc] cursor-pointer"
    >
      {/* Gray header section with title and description */}
      <div className="flex flex-col gap-2 bg-[#f5f8fc] px-6 py-4 rounded-2xl">
        <ServiceHeaderContent service={service} />
        {service.servicedescription && (
          <p className="text-right text-[13px] leading-5 text-[#34404f] w-full">
            {service.servicedescription}
          </p>
        )}
      </div>

      {/* Info section with grid */}
      <div className="grid grid-cols-2 grid-rows-3 gap-x-4 gap-y-3 bg-white transition-colors group-hover:bg-[#f5f8fc] rounded-2xl" dir="rtl">
        {detailCells.map((cell) => (
          <div
            key={`${cell.row}-${cell.col}-${cell.icon}`}
            className="min-w-0"
            style={{ gridColumn: cell.col, gridRow: cell.row }}
          >
            <InfoRow icon={cell.icon} value={cell.value || '-'} />
          </div>
        ))}
      </div>
    </button>
  )
}

const MultiServiceListPanel = ({ services, onSelect }: MultiServiceListPanelProps) => {
  if (!services || services.length === 0) {
    return null
  }

  return (
    <div className="flex flex-col gap-4">
      {services.map((service, index) => (
        <ServiceListItem
          key={service.objectId || index}
          index={index}
          service={service}
          onClick={onSelect ? () => onSelect(index) : undefined}
        />
      ))}
    </div>
  )
}

export default MultiServiceListPanel
