import { MapPointInfoIcon } from './MapPointInfoIcons'
import { getOrganizationIcon } from '../../constants/organizationTypeIcons'
import { buildDetailCells, InfoRow } from './detailsGridUtils'

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
}

const ServiceListItem = ({ index, service }: { index: number; service: ServiceData }) => {
  const orgIconId = getOrganizationIcon(service.serviceproviderorganizationtype)
  const detailCells = buildDetailCells(service)

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-[#e0e5eb] bg-white p-4">
      {/* Gray header section with title and description */}
      <div className="flex flex-col gap-2 bg-[#f5f8fc] px-6 py-4 rounded-2xl">
        <div className="flex items-start justify-between gap-4">
          <div className="flex shrink-0">
            <MapPointInfoIcon icon={orgIconId} />
          </div>
          <div className="flex-1 text-right">
            {service.servicetypename && (
              <p className="text-[12px] leading-4 text-[#5f708a]">
                {service.servicetypename}
              </p>
            )}
            <h3 className="text-[16px] font-bold leading-[22px] text-[#34404f]">
              {service.servicename || '-'}
            </h3>
          </div>
        </div>
        {service.servicedescription && (
          <p className="text-right text-[13px] leading-5 text-[#34404f] w-full">
            {service.servicedescription}
          </p>
        )}
      </div>

      {/* Info section with grid */}
      <div className="grid grid-cols-2 grid-rows-3 gap-x-4 gap-y-3 py-4 bg-white rounded-2xl" dir="rtl">
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
    </div>
  )
}

const MultiServiceListPanel = ({ services, address }: MultiServiceListPanelProps) => {
  if (!services || services.length === 0) {
    return null
  }

  return (
    <div className="flex flex-col gap-4">
      {services.map((service, index) => (
        <ServiceListItem key={service.objectId || index} index={index} service={service} />
      ))}
    </div>
  )
}

export default MultiServiceListPanel
