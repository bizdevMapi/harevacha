import { useState } from 'react'
import {
  IconBackCircle,
  IconChevronDown,
  IconChevronsUpDown,
  IconList,
  IconMap,
  IconPerson,
  IconPin,
} from '../../assets/icons'
import {
  getCityCenterAreaSelectValue,
  GOVMAP_DEFAULT_VIEW_LEVEL,
  JERUSALEM_CITY_CENTER_AREA_OPTION,
  POPULATION_SEGMENT_OPTIONS,
  PROFILE_FILTER_OPTIONS,
  SITE,
} from '../../constants'
import { useDashboardUi } from '../../context/DashboardUiContext'
import { ToolbarSelect } from '../ui'

/**
 * סרגל פעולות ומסננים מתחת להדר.
 * מצב התצוגה והסינונים נלקח מ־DashboardUiContext (בלי פרופס מה־App).
 */
const FilterToolbar = ({ matchCount = 265, onBack }) => {
  const {
    viewMode,
    setViewMode,
    populationSegment,
    setPopulationSegment,
    profileKey,
    setProfileKey,
    neighborhoodsList,
  } = useDashboardUi()
  const [selectedNeighborhoodOptionValue, setSelectedNeighborhoodOptionValue] = useState(() =>
    getCityCenterAreaSelectValue(JERUSALEM_CITY_CENTER_AREA_OPTION.value),
  )
  const divider = (
    <div
      className="hidden h-11 w-px shrink-0 bg-white/55 sm:block"
      aria-hidden
    />
  )

  return (
    <div className="px-4 pb-5 pt-4 sm:px-6 sm:pb-6 sm:pt-5">
      <div className="bg-brand-toolbarBar flex flex-wrap items-end gap-x-4 gap-y-3 rounded-[14px] border border-white/18 bg-brand-lightBlue px-4 py-4 shadow-toolbarBar sm:flex-nowrap sm:gap-x-5 sm:px-5 sm:py-4">
        <div className="flex min-w-0 shrink-0 flex-wrap items-end gap-4 sm:flex-nowrap sm:gap-5">
          <ToolbarSelect
            label="אזור"
            value={selectedNeighborhoodOptionValue}
            onChange={(e) => {
              const v = e.target.value
              setSelectedNeighborhoodOptionValue(v)
              if (!v) return
              const opt = neighborhoodsList.find((n) => n.optionValue === v)
              const govmap = window.govmap
              if (!opt || !govmap) return

              if (opt.layerObjectId != null) {

                //התמקדות בשכונה
                govmap.searchInLayer?.({
                  layerName: SITE.layers.municipalitiesLayer,
                  fieldName: 'objectId',
                  fieldValues: [opt.layerObjectId?.toString()],
                  highlight: false,
                })
                var params = {
                  geometry: opt.geometry,
                  layerName: SITE.layers.servicesLayer,
                  fields: ['objectId']
                };
                // קבלת המענים בשכונה הנבחרת
                govmap.intersectFeatures(params).then(function (response) {
                  console.log('response', response);
                  var params = {
                    layerName: SITE.layers.servicesLayer,
                    whereClause: "objectid in (" + response.data.map((item) => item.ObjectId?.toString()).join(',') + ")",
                    zoomToExtent: true
                  };
                  // הצגת המענים בשכונה הנבחרת
                  govmap.filterLayers(params);
                }).catch(function (error) {
                  console.error('failed intersecting features', error);
                });


              }

              else govmap.zoomToXY?.({
                x: opt.value.x,
                y: opt.value.y,
                level: GOVMAP_DEFAULT_VIEW_LEVEL,
                marker: false,
              })
            }}
            options={[
              ...neighborhoodsList.map((n) => ({
                value: n.optionValue,
                label: n.label,
              })),
            ]}
            leftIcon={<IconChevronsUpDown />}
            rightIcon={<IconPin />}
            className="w-[min(100%,280px)] sm:w-[248px]"
          />
          <ToolbarSelect
            label="נתוני אוכלוסייה"
            value={populationSegment}
            onChange={(e) => setPopulationSegment(e.target.value)}
            options={[...POPULATION_SEGMENT_OPTIONS]}
            leftIcon={<IconChevronDown />}
            rightIcon={<IconPerson />}
            className="w-[min(100%,240px)] sm:w-[208px]"
          />
          {populationSegment !== 'none' && (
            <ToolbarSelect
              label="פרופיל"
              value={profileKey}
              onChange={(e) => setProfileKey(e.target.value)}
              options={[...PROFILE_FILTER_OPTIONS]}
              leftIcon={<IconChevronDown />}
              rightIcon={<IconPerson />}
              className="w-[min(100%,240px)] sm:w-[208px]"
            />
          )}
        </div>

        {divider}

        <p
          className="min-w-0 flex-1 text-center text-[15px] font-semibold tracking-tight text-white drop-shadow-sm"
          style={{ textShadow: '0 1px 1px rgba(0,0,0,0.15)' }}
        >
          מענים מותאמים:{' '}
          <span className="tabular-nums font-bold text-white">{matchCount}</span>
        </p>

        {divider}

        <div className="flex shrink-0 items-center gap-3">
          <div
            className="flex items-center rounded-full bg-brand-toolbarToggleTrack p-1 ring-1 ring-white/28 shadow-[inset_0_1px_2px_rgba(0,0,0,0.14)]"
            role="group"
            aria-label="בחירת תצוגה"
          >
            {/* ב־RTL הסדר הזה מציב מפה מימין ורשימה משמאל כמו במוקאפ */}
            <button
              type="button"
              onClick={() => setViewMode('map')}
              className={`flex items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-bold transition-all duration-150 ${viewMode === 'map'
                  ? 'bg-brand-toolbarToggleOn text-white shadow-toolbarToggleOn'
                  : 'text-white/90 hover:bg-white/12 hover:text-white'
                }`}
            >
              <IconMap />
              מפה
            </button>
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-bold transition-all duration-150 ${viewMode === 'list'
                  ? 'bg-brand-toolbarToggleOn text-white shadow-toolbarToggleOn'
                  : 'text-white/90 hover:bg-white/12 hover:text-white'
                }`}
            >
              <IconList />
              רשימה
            </button>
          </div>

          <button
            type="button"
            onClick={onBack}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/35 bg-brand-toolbarBlueDeep text-white shadow-md transition-all hover:border-white/55 hover:bg-brand-toolbarToggleOn hover:shadow-lg active:scale-[0.98]"
            aria-label="חזרה"
          >
            <IconBackCircle />
          </button>
        </div>
      </div>
    </div>
  )
}

export default FilterToolbar
