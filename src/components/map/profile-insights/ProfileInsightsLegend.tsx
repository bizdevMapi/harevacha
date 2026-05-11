import type { ProfileSlice } from './constants'

type ProfileInsightsLegendProps = {
  slices: ProfileSlice[]
}

const ProfileInsightsLegend = ({ slices }: ProfileInsightsLegendProps) => {
  return (
    <div className="flex flex-wrap items-center justify-end gap-x-4 gap-y-2 border-t border-[#e8edf2] pt-3">
      {slices.map((s) => (
        <div key={s.key} className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 shrink-0 rounded-[2px]" style={{ backgroundColor: s.color }} />
          <span className="text-[12px] text-[#3d5266]">{s.label}</span>
        </div>
      ))}
    </div>
  )
}

export default ProfileInsightsLegend
