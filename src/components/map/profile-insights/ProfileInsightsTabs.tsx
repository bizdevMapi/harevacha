export type InsightsTab = 'neighborhoods' | 'profiles'

type ProfileInsightsTabsProps = {
  active: InsightsTab
  onChange: (tab: InsightsTab) => void
}

const tabs: { id: InsightsTab; label: string }[] = [
  { id: 'neighborhoods', label: 'השוואת שכונות' },
  { id: 'profiles', label: 'מאפייני פרופילים' },
]

const ProfileInsightsTabs = ({ active, onChange }: ProfileInsightsTabsProps) => {
  return (
    <div className="mb-3.5 flex gap-1 border-b border-brand-lightBlue/90">
      {tabs.map((t) => {
        const isOn = active === t.id
        return (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={isOn}
            onClick={() => onChange(t.id)}
            className={`relative flex-1 rounded-t-md pb-2.5 pt-2 text-center text-[13px] font-semibold tracking-tight transition-colors ${
              isOn
                ? 'text-brand-toolbarBar'
                : 'text-[#8a9bab] hover:bg-brand-bgLight hover:text-[#5c6e80]'
            }`}
          >
            {t.label}
            {isOn ? (
              <span
                className="absolute bottom-0 left-3 right-3 h-[3px] rounded-t-[2px] bg-brand-toolbarBar shadow-[0_-1px_0_rgba(255,255,255,0.35)_inset]"
                aria-hidden
              />
            ) : null}
          </button>
        )
      })}
    </div>
  )
}

export default ProfileInsightsTabs
