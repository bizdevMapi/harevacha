import { MOCK_PROFILE_TRAITS } from './constants'
import { formatFullCount } from './format'
import { IconCheck, IconCross, IconPeople } from './icons'

const ProfileCharacteristicsContent = () => {
  return (
    <div className="max-h-[280px] overflow-y-auto rounded-xl bg-[#f4f6f9] px-3 py-2">
      <div className="flex flex-col">
        {MOCK_PROFILE_TRAITS.map((block, blockIndex) => (
          <div
            key={block.title}
            className={`py-3 ${blockIndex > 0 ? 'border-t border-[#dde4eb]' : ''}`}
          >
            <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-[14px] font-bold text-[#1a2b3c]">{block.title}</h3>
              <div className="flex items-center gap-1 text-[12px] text-[#4a6074]">
                <IconPeople className="h-4 w-4 text-[#1f6ea8]" />
                <span className="font-semibold tabular-nums text-[#1f6ea8]">{formatFullCount(block.cityCount)}</span>
                <span>בכל העיר</span>
              </div>
            </div>
            <ul className="flex flex-col gap-1.5">
              {block.traits.map((t) => (
                <li key={t.label} className="flex items-center justify-between gap-2 text-[12px] text-[#3d5266]">
                  <span className="text-right">{t.label}</span>
                  <span className="shrink-0">{t.present ? <IconCheck /> : <IconCross />}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ProfileCharacteristicsContent
