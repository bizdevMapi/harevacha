import {
  IconBackCircle,
  IconClose,
  IconHelp,
  IconList,
  IconMap,
  IconPerson,
  IconPin,
} from '../../assets/icons'
import {
  POPULATION_SEGMENT_OPTIONS,
  PROFILE_FILTER_OPTIONS,
} from '../../constants'
import { ACTIVE_DEFAULT_AREA_VALUE } from '../../utils/activeCity'
import { useDashboardUi } from '../../context/DashboardUiContext'
import { applyCityNeighborhoodExclusivity } from '../../utils/areaSelection'
import { AreaMultiSelect, ToolbarSelect, Tooltip } from '../ui'

const toolbarSelectWidthClass =
  'w-full max-w-[200px] sm:w-[200px] sm:max-w-[200px] xl:w-[240px] xl:max-w-[240px] 2xl:w-[312px] 2xl:max-w-[312px]'

const viewModeOptions = [
  { mode: 'map', label: 'מפה', Icon: IconMap },
  { mode: 'list', label: 'רשימה', Icon: IconList },
]

const viewModeToggleButtonClass =
  'flex items-center gap-1.5 rounded-full px-3 py-2.5 text-sm transition-all duration-150'
const viewModeToggleButtonActiveClass =
  'bg-brand-toolbarToggleOn text-white shadow-toolbarToggleOn'
const viewModeToggleButtonInactiveClass =
  'text-white/90 hover:bg-white/12 hover:text-white'


const FilterToolbar = ({ onBack = () => { } }) => {
  const {
    viewMode,
    setViewMode,
    selectedAreas,
    setSelectedAreas,
    populationSegment,
    setPopulationSegment,
    profileKey,
    setProfileKey,
    neighborhoodsList,
    matchedServicesCount,
    activeQuickFilterLabel,
    setActiveQuickFilterLabel,
    setSelectedServiceFilterKeys,
    setServiceFilterSearchQuery,
  } = useDashboardUi()
  const matchCount = matchedServicesCount

  const handleClearQuickFilter = () => {
    setActiveQuickFilterLabel(null)
    setSelectedServiceFilterKeys(new Set())
    setServiceFilterSearchQuery('')
  }
  const divider = (
    <div
      className="hidden h-11 w-px shrink-0 bg-white/55 sm:block"
      aria-hidden
    />
  )

  const areaSelect = (
    <AreaMultiSelect
      label="אזור"
      selectedValues={selectedAreas}
      onChange={(next) =>
        setSelectedAreas(
          applyCityNeighborhoodExclusivity(selectedAreas, next, neighborhoodsList),
        )
      }
      options={neighborhoodsList.map((n) => ({
        value: n.optionValue,
        label: n.label,
      }))}
      defaultValues={[ACTIVE_DEFAULT_AREA_VALUE]}
      rightIcon={<IconPin />}
      className={toolbarSelectWidthClass}
    />
  )

  return (
    <div className="px-2 pb-3 pt-0">
      <div className="flex flex-wrap items-end gap-x-4 gap-y-3 rounded-[10px] border border-white/18 bg-brand-darkBlue px-2 py-2 shadow-toolbarBar sm:flex-nowrap sm:items-center sm:gap-x-5">
        {areaSelect}
        {divider}

        <div className="flex min-w-0 flex-1 flex-wrap items-end justify-between gap-x-4 gap-y-3 sm:flex-nowrap sm:items-center">
          <div className="flex min-w-0 flex-wrap items-end gap-3 sm:flex-nowrap sm:gap-4">
            <ToolbarSelect
              label="נתוני אוכלוסייה"
              value={populationSegment}
              // onChange={(e) => setPopulationSegment(e.target.value)}
              options={[...POPULATION_SEGMENT_OPTIONS]}
              rightIcon={<IconPerson />}
              className={toolbarSelectWidthClass}
              tooltip={`
               <p>בחרו מצב סיכון או משתנה דמוגרפי להצגה על גבי המפה</p>
              `}
              tooltipPosition="left"
            />
            {populationSegment !== 'none' && (
              <>
              {divider}
              <ToolbarSelect
                label="פרופיל"
                value={profileKey}
                onChange={(e) => setProfileKey(e.target.value)}
                options={[...PROFILE_FILTER_OPTIONS]}
                rightIcon={<IconPerson />}
                className={toolbarSelectWidthClass}
              />
              </>
             
            )}
          </div>
          {divider}

          <p
              className="min-w-0 flex-1 text-center text-[15px] tracking-tight text-white drop-shadow-sm sm:text-right"
              style={{ textShadow: '0 1px 1px rgba(0,0,0,0.15)' }}
            >
              {activeQuickFilterLabel ? (
                <>
                  <span className="tabular-nums font-bold">{matchCount}</span>{' '}
                  {activeQuickFilterLabel}
                  <button
                    type="button"
                    onClick={handleClearQuickFilter}
                    aria-label="ביטול הסינון המהיר"
                    className="mr-1.5 inline-flex size-5 items-center justify-center rounded-full text-white/80 transition-colors hover:bg-white/15 hover:text-white"
                  >
                    <IconClose />
                  </button>
                </>
              ) : (
                <>
                  מענים מותאמים{' '}
                  :{' '}
                  <span className="tabular-nums font-bold">{matchCount}</span>
                </>
              )}
            </p>
          <div className="flex shrink-0 flex-wrap items-center gap-3 sm:gap-4">
          
            <div
              className="flex items-center gap-1 bg-[#2A8AD4] rounded-[39px] p-1"
              role="group"
              aria-label="בחירת תצוגה"
            >
              {viewModeOptions.map(({ mode, label, Icon }) => {
                const isActive = viewMode === mode
                return (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setViewMode(mode)}
                    aria-pressed={isActive}
                    className={`${viewModeToggleButtonClass} ${isActive ? viewModeToggleButtonActiveClass : viewModeToggleButtonInactiveClass
                      }`}
                  >
                    <Icon />
                    {label}
                  </button>
                )
              })}
            </div>
{/* {divider} */}
            {/* <button
              type="button"
              onClick={onBack}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/35 bg-brand-toolbarBlueDeep text-white shadow-md transition-all hover:border-white/55 hover:bg-brand-toolbarToggleOn hover:shadow-lg active:scale-[0.98]"
              aria-label="חזרה"
            >
              <IconBackCircle />
            </button> */}
          </div>
        </div>
      </div>
    </div>
  )
}

export default FilterToolbar
