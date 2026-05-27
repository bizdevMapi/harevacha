import { MapPointInfoIcon } from './MapPointInfoIcons'

type MapPointTooltipData = {
  address?: string
  title: string
  description?: string
  audiences?: string
  price?: string
  provider?: string
  languages?: string
  risk?: string
  accessibility?: string
}

type MapPointTooltipProps = {
  data: MapPointTooltipData
  position: { left: number; top: number }
}

const cleanValue = (value?: string) => {
  if (!value) return ''
  const normalized = String(value).trim()
  if (!normalized || normalized.toLowerCase() === 'null') return ''
  return normalized
}

type DetailIcon = Parameters<typeof MapPointInfoIcon>[0]['icon']

type TooltipDetailCell = {
  row: 1 | 2 | 3
  col: 1 | 2
  icon: DetailIcon
  value: string
}

const InfoRow = ({ icon, value }: { icon: DetailIcon; value: string }) => (
  <div className="flex h-[25px] w-full min-w-0 items-center justify-start gap-2 text-right text-[12px] leading-[22.87px] text-[#5f708a]">
    <span className="shrink-0">
      <MapPointInfoIcon icon={icon} />
    </span>
    <span className="min-w-0 flex-1 overflow-hidden text-ellipsis whitespace-nowrap" title={value}>
      {value}
    </span>
  </div>
)

const MapPointTooltip = ({ data, position }: MapPointTooltipProps) => {
  const address = cleanValue(data.address)
  const title = cleanValue(data.title)
  const description = cleanValue(data.description)
  // Figma: col 1 = ימין, col 2 = שמאל (RTL grid)
  const detailCells: TooltipDetailCell[] = [
    { row: 1, col: 1, icon: 'group', value: cleanValue(data.audiences) },
    { row: 1, col: 2, icon: 'price', value: cleanValue(data.price) },
    { row: 2, col: 1, icon: 'building', value: cleanValue(data.provider) },
    { row: 2, col: 2, icon: 'language', value: cleanValue(data.languages) },
    { row: 3, col: 1, icon: 'target', value: cleanValue(data.risk) },
    { row: 3, col: 2, icon: 'accessibility', value: cleanValue(data.accessibility) },
  ]

  return (
    <div
      dir="rtl"
      className="pointer-events-none absolute z-30 w-[420px]"
      style={{
        left: `${position.left}px`,
        top: `${position.top}px`,
        transform: 'translate(-50%, calc(-100% - 12px))',
      }}
    >
      <div className="relative drop-shadow-[0_2px_7px_rgba(164,177,192,0.35)]">
        <div className="rounded-[20px] bg-white p-6">
          <div className="flex flex-col items-end gap-4">
            <div className="w-full text-right text-[14px] font-medium leading-normal text-[#5f708a]">
              {address || '-'}
            </div>
            <div className="w-full rounded-[8px] bg-[#f5f8fc] px-4 py-3 text-right text-[#34404f]">
              <h4 className="text-[16px] font-bold leading-[21px] text-[#34404f]">{title || '-'}</h4>
              <p className="mt-3 text-[13px] leading-5 text-[#34404f]">{description || '-'}</p>
            </div>
          </div>
          <div className="mt-4 grid w-full grid-cols-2 grid-rows-3 gap-x-4 gap-y-3" dir="rtl">
            {detailCells.map((cell) => (
              <div
                key={`${cell.row}-${cell.col}-${cell.icon}`}
                className="min-w-0"
                style={{ gridColumn: cell.col, gridRow: cell.row }}
              >
                <InfoRow icon={cell.icon} value={cell.value || '-'} />
              </div>
            ))}
          </div>
        </div>
        <div
          aria-hidden
          className="absolute left-1/2 top-[calc(100%-1px)] h-0 w-0 -translate-x-1/2 border-x-[14px] border-x-transparent border-t-[12px] border-t-white"
        />
      </div>
    </div>
  )
}

export default MapPointTooltip
