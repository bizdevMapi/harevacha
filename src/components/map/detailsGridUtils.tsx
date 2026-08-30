import type { MapPointInfoIconId } from './mapPointInfoData'
import { MapPointInfoIcon } from './MapPointInfoIcons'

export type DetailCell = {
  row: 1 | 2 | 3
  col: 1 | 2
  icon: MapPointInfoIconId
  value: string
}

export const cleanValue = (value?: string) => {
  if (!value) return ''
  const normalized = String(value).trim()
  if (!normalized || normalized.toLowerCase() === 'null') return ''
  return normalized
}

export const buildDetailCells = (data: {
  targetpopulations?: string
  requirespayment?: string
  providername?: string
  language?: string
  airisktype?: string
  accessibility?: string
}): DetailCell[] => [
  { row: 1, col: 1, icon: 'group', value: cleanValue(data.targetpopulations) },
  { row: 1, col: 2, icon: 'price', value: cleanValue(data.requirespayment) },
  { row: 2, col: 2, icon: 'building', value: cleanValue(data.providername) },
  { row: 2, col: 1, icon: 'language', value: cleanValue(data.language) },
  { row: 3, col: 1, icon: 'target', value: cleanValue(data.airisktype) },
  { row: 3, col: 2, icon: 'accessibility', value: cleanValue(data.accessibility) },
]

export const InfoRow = ({ icon, value }: { icon: MapPointInfoIconId; value: string }) => (
  <div className="flex h-[25px] w-full min-w-0 items-center justify-start gap-2 text-right text-[12px] leading-[22.87px] text-[#5f708a]">
    <span className="shrink-0">
      <MapPointInfoIcon icon={icon} />
    </span>
    <span className="min-w-0 flex-1 overflow-hidden text-ellipsis whitespace-nowrap" title={value}>
      {value}
    </span>
  </div>
)
