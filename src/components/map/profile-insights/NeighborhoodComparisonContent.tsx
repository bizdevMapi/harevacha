import { CITY_PROFILE_SLICES, MOCK_NEIGHBORHOODS, type NeighborhoodRow } from './constants'
import { formatFullCount } from './format'
import StackedBar from './StackedBar'

/** parts = [א׳, ב׳, ג׳] — בפס LTR: ג׳ בהיר, ב׳, א׳ כהה */
function rowSegments(row: NeighborhoodRow) {
  const [a, b, c] = row.parts
  const colors = {
    a: CITY_PROFILE_SLICES[0]!.color,
    b: CITY_PROFILE_SLICES[1]!.color,
    c: CITY_PROFILE_SLICES[2]!.color,
  }
  return [
    { color: colors.c, ratio: c },
    { color: colors.b, ratio: b },
    { color: colors.a, ratio: a },
  ]
}

const NeighborhoodComparisonContent = () => {
  return (
    <div className="max-h-[288px] overflow-y-auto rounded-[12px] border border-[#dce8f0] bg-brand-bgLight px-3 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]">
      <ul className="flex flex-col gap-2.5">
        {MOCK_NEIGHBORHOODS.map((row) => (
          <li
            key={row.id}
            className="flex items-center gap-2.5 rounded-lg px-1 py-1.5 transition-colors hover:bg-white/90"
            dir="rtl"
          >
            <span className="min-w-[5rem] max-w-[7.5rem] shrink-0 truncate text-right text-[12.5px] font-semibold leading-tight text-[#1a3347]">
              {row.name}
            </span>
            <div className="min-w-0 flex-1">
              <StackedBar
                segments={rowSegments(row)}
                heightClass="h-[9px]"
                className="ring-1 ring-black/[0.05] ring-inset"
              />
            </div>
            <span className="min-w-[3.25rem] shrink-0 text-left text-[12.5px] font-bold tabular-nums tracking-tight text-brand-toolbarBlueDeep">
              {formatFullCount(row.total)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default NeighborhoodComparisonContent
