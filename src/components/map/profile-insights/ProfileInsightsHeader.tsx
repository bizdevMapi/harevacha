import { getPopulationSegmentLabel, getProfileInsightsMainTitle } from '../../../constants'
import { useDashboardUi } from '../../../context/DashboardUiContext'
import { CITY_PROFILE_SLICES, CITY_PROFILE_TOTAL } from './constants'
import { formatCompactCount } from './format'
import { IconCollapseArrows, IconExpandArrows, IconPeople } from './icons'
import StackedBar from './StackedBar'

type ProfileInsightsHeaderProps = {
  /** פירוט למטה (טאבים ותוכן) פתוח */
  detailsExpanded: boolean
  onToggleDetails: () => void
}

const ProfileInsightsHeader = ({ detailsExpanded, onToggleDetails }: ProfileInsightsHeaderProps) => {
  const { populationSegment, selectedArea, profileKey } = useDashboardUi()
  const populationSubtitle = getPopulationSegmentLabel(populationSegment)
  const mainTitle = getProfileInsightsMainTitle(selectedArea, profileKey)
  const total = CITY_PROFILE_TOTAL
  /** תצוגת הפס: בהיר משמאל, כהה מימין (כמו בתמונה) */
  const ordered = [...CITY_PROFILE_SLICES].reverse()
  const segments = ordered.map((s) => ({
    color: s.color,
    ratio: s.count / total,
  }))

  return (
    <header className="relative pb-0.5 pr-0.5 pt-0">
      <button
        type="button"
        onClick={onToggleDetails}
        className="absolute left-0 top-0 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-white/30 bg-brand-toolbarBlueDeep text-white shadow-md transition hover:border-white/50 hover:bg-brand-toolbarToggleOn active:scale-[0.96]"
        aria-expanded={detailsExpanded}
        aria-label={detailsExpanded ? 'כיווץ פירוט' : 'הרחבת פירוט'}
        title={detailsExpanded ? 'כיווץ פירוט' : 'הרחבת פירוט'}
      >
        {detailsExpanded ? <IconCollapseArrows className="h-3.5 w-3.5" /> : <IconExpandArrows className="h-3.5 w-3.5" />}
      </button>

      <p className="mb-1.5 pr-11 text-right text-[11px] font-medium leading-snug tracking-tight text-[#6b8299]">
        {populationSubtitle}
      </p>

      <div className="mb-3 flex flex-wrap items-baseline justify-end gap-x-2 gap-y-1 pr-11 text-right">
        <h2 className="text-[16px] font-bold leading-snug tracking-tight text-[#0d2b3d]">{mainTitle}</h2>
        <span className="inline-flex items-center gap-1 rounded-md bg-brand-bgSoft/80 px-1.5 py-0.5 text-[16px] font-bold tabular-nums tracking-tight text-brand-darkBlue">
          <IconPeople className="h-[17px] w-[17px] text-brand-toolbarBar" />
          {formatCompactCount(total)}
        </span>
      </div>

      <StackedBar
        segments={segments}
        heightClass="h-[11px]"
        className="ring-1 ring-black/[0.06] ring-inset shadow-[inset_0_1px_2px_rgba(255,255,255,0.35)]"
      />
    </header>
  )
}

export default ProfileInsightsHeader
