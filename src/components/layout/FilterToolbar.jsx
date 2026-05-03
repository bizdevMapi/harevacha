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
import { ToolbarSelect } from '../ui'

/**
 * סרגל פעולות ומסננים מתחת להדר.
 * `viewMode` ו־`onViewModeChange` מגיעים מהורה — אותו state שמחליט אם להציג מפה או רשימה.
 */
const FilterToolbar = ({
  matchCount = 265,
  viewMode,
  onViewModeChange,
  onBack,
}) => {
  const [population, setPopulation] = useState('none')
  const [area, setArea] = useState('jerusalem-all')

  const populationOptions = [
    { value: 'none', label: 'ללא פילוח' },
    { value: 'age', label: 'לפי גיל' },
    { value: 'household', label: 'לפי משק בית' },
  ]

  const areaOptions = [
    { value: 'jerusalem-all', label: 'ירושלים - כל העיר' },
    { value: 'jerusalem-center', label: 'ירושלים - מרכז' },
    { value: 'jerusalem-south', label: 'ירושלים - דרום' },
  ]

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
            value={area}
            onChange={(e) => setArea(e.target.value)}
            options={areaOptions}
            leftIcon={<IconChevronsUpDown />}
            rightIcon={<IconPin />}
            className="w-[min(100%,280px)] sm:w-[248px]"
          />
          <ToolbarSelect
            label="נתוני אוכלוסייה"
            value={population}
            onChange={(e) => setPopulation(e.target.value)}
            options={populationOptions}
            leftIcon={<IconChevronDown />}
            rightIcon={<IconPerson />}
            className="w-[min(100%,240px)] sm:w-[208px]"
          />
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
              onClick={() => onViewModeChange('map')}
              className={`flex items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-bold transition-all duration-150 ${
                viewMode === 'map'
                  ? 'bg-brand-toolbarToggleOn text-white shadow-toolbarToggleOn'
                  : 'text-white/90 hover:bg-white/12 hover:text-white'
              }`}
            >
              <IconMap />
              מפה
            </button>
            <button
              type="button"
              onClick={() => onViewModeChange('list')}
              className={`flex items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-bold transition-all duration-150 ${
                viewMode === 'list'
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
