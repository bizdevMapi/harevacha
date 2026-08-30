import { useLayoutEffect, useRef, useState } from 'react'
import { MapPointInfoIcon } from './MapPointInfoIcons'
import { getOrganizationIcon } from '../../constants/organizationTypeIcons'
import { cleanValue, buildDetailCells, InfoRow } from './detailsGridUtils'
import type { DetailCell } from './detailsGridUtils'

type MapPointTooltipData = {
  address?: string
  title: string
  description?: string
  audiences?: string
  price?: string
  provider?: string
  languages?: string
  airisktype?: string
  accessibility?: string
  isMultipleServices?: boolean
}

type MapPointTooltipProps = {
  data: MapPointTooltipData
  position: { left: number; top: number }
}

type TooltipPlacement = 'above' | 'below'

const TOOLTIP_GAP_PX = 12
const VIEWPORT_EDGE_PADDING_PX = 8

type DetailIcon = Parameters<typeof MapPointInfoIcon>[0]['icon']

function resolveTooltipPlacement(
  anchorTop: number,
  tooltipHeight: number,
  containerHeight: number,
): TooltipPlacement {
  const requiredSpace = tooltipHeight + TOOLTIP_GAP_PX + VIEWPORT_EDGE_PADDING_PX
  const spaceAbove = anchorTop
  const spaceBelow = containerHeight - anchorTop

  if (spaceAbove >= requiredSpace) return 'above'
  if (spaceBelow >= requiredSpace) return 'below'
  return spaceBelow >= spaceAbove ? 'below' : 'above'
}

const MapPointTooltip = ({ data, position }: MapPointTooltipProps) => {
  const tooltipRef = useRef<HTMLDivElement>(null)
  const [placement, setPlacement] = useState<TooltipPlacement>('above')

  const address = cleanValue(data.address)
  const title = cleanValue(data.title)
  const description = cleanValue(data.description)
  const isMultiple = data.isMultipleServices

  // Figma: col 1 = ימין, col 2 = שמאל (RTL grid)
  const detailCells: DetailCell[] = [
    { row: 1, col: 1, icon: 'group', value: cleanValue(data.audiences) },
    { row: 1, col: 2, icon: 'price', value: cleanValue(data.price) },
    { row: 2, col: 2, icon: 'building', value: cleanValue(data.provider) },
    { row: 2, col: 1, icon: 'language', value: cleanValue(data.languages) },
    { row: 3, col: 1, icon: 'target', value: cleanValue(data.airisktype) },
    { row: 3, col: 2, icon: 'accessibility', value: cleanValue(data.accessibility) },
  ]

  useLayoutEffect(() => {
    const tooltipEl = tooltipRef.current
    if (!tooltipEl) return

    const parentEl = tooltipEl.offsetParent instanceof HTMLElement ? tooltipEl.offsetParent : null
    const containerHeight = parentEl?.clientHeight ?? window.innerHeight
    const nextPlacement = resolveTooltipPlacement(
      position.top,
      tooltipEl.offsetHeight,
      containerHeight,
    )
    setPlacement((current) => (current === nextPlacement ? current : nextPlacement))
  }, [position.left, position.top, address, title, description, data])

  const transform =
    placement === 'above'
      ? `translate(-50%, calc(-100% - ${TOOLTIP_GAP_PX}px))`
      : `translate(-50%, ${TOOLTIP_GAP_PX}px)`

  return (
    <div
      ref={tooltipRef}
      dir="rtl"
      className="pointer-events-none absolute z-30 w-[420px]"
      style={{
        left: `${position.left}px`,
        top: `${position.top}px`,
        transform,
      }}
    >
      <div className="relative flex w-full flex-col items-center">
        {placement === 'below' && (
          <div
            aria-hidden
            className="relative z-10 h-0 w-0 shrink-0 border-x-[14px] border-x-transparent border-b-[12px] border-b-white"
          />
        )}
        <div
          className={`w-full rounded-[20px] bg-white p-6 drop-shadow-[0_2px_7px_rgba(164,177,192,0.35)] ${
            placement === 'below' ? '-mt-px' : ''
          }`}
        >
          {isMultiple ? (
            <div className="flex flex-col items-end gap-3">
              <div className="w-full text-right text-[14px] font-medium leading-normal text-[#5f708a]">
                {address || '-'}
              </div>
              <div className="w-full rounded-[8px] bg-[#f5f8fc] px-4 py-3">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-[16px] font-bold leading-[22px] text-[#34404f]">{title}</h4>
                </div>
                <div className="flex flex-wrap items-center gap-y-1" style={{ marginLeft: 0 }}>
                  {description.split(', ').map((orgType, index) => {
                    const iconId = getOrganizationIcon(orgType)
                    return (
                      <div
                        key={index}
                        className="flex items-center justify-center"
                        style={{ marginLeft: '-0.375rem' }}
                      >
                        <div className="rounded-full bg-white p-0.5 border border-[#f5f8fc]">
                          <MapPointInfoIcon icon={iconId} />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-end gap-4">
              <div className="w-full text-right text-[14px] font-medium leading-normal text-[#5f708a]">
                {address || '-'}
              </div>
              <div className="w-full rounded-[8px] bg-[#f5f8fc] px-4 py-3 text-right text-[#34404f]">
                <h4 className="text-[16px] font-bold leading-[21px] text-[#34404f]">{title || '-'}</h4>
                <p className="mt-3 text-[13px] leading-5 text-[#34404f]">{description || '-'}</p>
              </div>
            </div>
          )}
          {!isMultiple && (
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
          )}
        </div>
        {placement === 'above' && (
          <div
            aria-hidden
            className="relative z-10 -mt-px h-0 w-0 shrink-0 border-x-[14px] border-x-transparent border-t-[12px] border-t-white"
          />
        )}
      </div>
    </div>
  )
}

export default MapPointTooltip
