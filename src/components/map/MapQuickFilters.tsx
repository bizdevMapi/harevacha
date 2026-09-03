import { IconFilter, IconSnowflake } from '../../assets/icons'

type QuickFilterButtonProps = {
  icon: 'filter' | 'snowflake'
  label: string
  count: number
  onClick?: () => void
}

function QuickFilterButton({ icon, label, count, onClick }: QuickFilterButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-2 rounded-[8px] border border-[#cbd5e3] bg-white px-3 py-2 shadow-sm transition-colors hover:bg-[#f5f8fc]"
      dir="rtl"
    >
      <span className="flex size-5 shrink-0 items-center justify-center text-[#115b91]">
        {icon === 'filter' ? <IconFilter /> : <IconSnowflake />}
      </span>
      <span className="text-sm leading-5 text-[#34404f]">{label}:</span>
      <span className="text-sm font-semibold leading-5 text-[#115b91]">{count}</span>
    </button>
  )
}

type MapQuickFiltersProps = {
  remoteServicesCount?: number
  missingAddressCount?: number
  onRemoteServicesClick?: () => void
  onMissingAddressClick?: () => void
}

const MapQuickFilters = ({
  remoteServicesCount = 0,
  missingAddressCount = 0,
  onRemoteServicesClick,
  onMissingAddressClick,
}: MapQuickFiltersProps) => {
  const hasAnyFilters = remoteServicesCount > 0 || missingAddressCount > 0

  if (!hasAnyFilters) {
    return null
  }

  return (
    <div className="absolute left-20 top-5 z-20 flex flex-col gap-2" dir="rtl">
      {remoteServicesCount > 0 && (
        <QuickFilterButton
          icon="filter"
          label="מענים מקוונים / עד הבית / טלפוני"
          count={remoteServicesCount}
          onClick={onRemoteServicesClick}
        />
      )}
      {missingAddressCount > 0 && (
        <QuickFilterButton
          icon="snowflake"
          label="מענים עם כתובת חסרה"
          count={missingAddressCount}
          onClick={onMissingAddressClick}
        />
      )}
    </div>
  )
}

export default MapQuickFilters
