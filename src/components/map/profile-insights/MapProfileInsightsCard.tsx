import { useEffect, useState } from 'react'
import { useDashboardUi } from '../../../context/DashboardUiContext'
import { CITY_PROFILE_SLICES } from './constants'
import NeighborhoodComparisonContent from './NeighborhoodComparisonContent'
import ProfileCharacteristicsContent from './ProfileCharacteristicsContent'
import ProfileInsightsHeader from './ProfileInsightsHeader'
import ProfileInsightsLegend from './ProfileInsightsLegend'
import ProfileInsightsTabs, { type InsightsTab } from './ProfileInsightsTabs'

const MapProfileInsightsCard = () => {
  const { profileInsightsOpen } = useDashboardUi()

  const [detailsExpanded, setDetailsExpanded] = useState(false)
  const [tab, setTab] = useState<InsightsTab>('neighborhoods')

  /** כשהלוח נפתח (אחרי «ללא פילוח») — תמיד מקופל; בלי זה ה-state נשמר כי הרכיב לא unmount כשמחזירים null */
  useEffect(() => {
    if (profileInsightsOpen) {
      setDetailsExpanded(false)
    }
  }, [profileInsightsOpen])

  if (!profileInsightsOpen) {
    return null
  }

  return (
    <aside
      className="pointer-events-auto absolute right-4 top-4 z-20 flex w-[min(100vw-2rem,392px)] max-h-[min(85vh,580px)] flex-col overflow-hidden rounded-[14px] border border-brand-lightBlue bg-white shadow-[0_12px_36px_rgba(15,80,130,0.16),0_2px_8px_rgba(15,23,42,0.06)]"
      dir="rtl"
    >
      <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-3 pt-3.5">
        <ProfileInsightsHeader
          detailsExpanded={detailsExpanded}
          onToggleDetails={() => setDetailsExpanded((v) => !v)}
        />

        {detailsExpanded && (
          <>
            <ProfileInsightsTabs active={tab} onChange={setTab} />

            <div className="mb-3 min-h-0">
              {tab === 'neighborhoods' ? <NeighborhoodComparisonContent /> : <ProfileCharacteristicsContent />}
            </div>
          </>
        )}

        <ProfileInsightsLegend slices={CITY_PROFILE_SLICES} />
      </div>
    </aside>
  )
}

export default MapProfileInsightsCard
