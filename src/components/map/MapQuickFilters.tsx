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
  localCount?: number
  missingDataCount?: number
  onLocalClick?: () => void
  onMissingDataClick?: () => void
}

const MapQuickFilters = ({
  localCount = 0,
  missingDataCount = 0,
  onLocalClick,
  onMissingDataClick,
}: MapQuickFiltersProps) => {
  const hasAnyFilters = localCount > 0 || missingDataCount > 0

  if (!hasAnyFilters) {
    return null
  }

  return (
    <div className="absolute right-4 top-4 z-20 flex flex-col gap-2" dir="rtl">
      {localCount > 0 && (
        <QuickFilterButton
          icon="filter"
          label=":מענים מקוונים / עד הבית"
          count={localCount}
          onClick={onLocalClick}
        />
      )}
      {missingDataCount > 0 && (
        <QuickFilterButton
          icon="snowflake"
          label=":מענים עם כתובת חסרה"
          count={missingDataCount}
          onClick={onMissingDataClick}
        />
      )}
    </div>
  )
}

export default MapQuickFilters
