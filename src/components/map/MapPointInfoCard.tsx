import { useEffect, useMemo, useRef, useState } from 'react'
import type { MapPointInfoIconId } from './mapPointInfoData'
import { IconClose, IconExpand, MapPointInfoIcon } from './MapPointInfoIcons'

export type MapPointInfoField = {
  fieldName?: string
  fieldValue?: unknown
}

type MapPointInfoCardProps = {
  data: MapPointInfoField[]
  onClose: () => void
  selectedAreaCenter?: { x: number; y: number } | null
}

type DetailRowData = {
  id: string
  icon: MapPointInfoIconId
  value: string
}

type MapCenterPoint = {
  x: number
  y: number
}

function cleanFieldValue(value: unknown): string {
  if (value == null) return ''
  const text = String(value).trim()
  if (!text || text.toUpperCase() === 'NULL') return ''
  return text
}

function parseCoordinate(value: unknown): number | null {
  const text = cleanFieldValue(value)
  if (!text) return null
  const parsed = Number(text)
  return Number.isFinite(parsed) ? parsed : null
}

function DetailRow({ detail }: { detail: DetailRowData }) {
  return (
    <div className="flex w-full shrink-0 items-center justify-start gap-3">
      <span className="flex size-5 shrink-0 items-center justify-center">
        <MapPointInfoIcon icon={detail.icon} />
      </span>
      <p className="min-w-0 flex-1 text-right text-[14px] leading-[22.871px] text-[#5f708a]">{detail.value}</p>
    </div>
  )
}

const DETAIL_SPECS: Array<{ id: string; icon: MapPointInfoIconId; field: string; fallbackField?: string }> = [
  { id: 'address', icon: 'location', field: 'fulladdress' },
  { id: 'audience', icon: 'group', field: 'targetpopulations' },
  { id: 'language', icon: 'language', field: 'language' },
  { id: 'risk', icon: 'target', field: 'riskstatusdescription_agg' },
  { id: 'price', icon: 'price', field: 'requirespaymentamount' },
  {
    id: 'provider',
    icon: 'building',
    field: 'serviceproviderorganizationtype',
    fallbackField: 'providername',
  },
  { id: 'accessibility', icon: 'accessibility', field: 'accessibility' },
]

const MapPointInfoCard = ({ data, onClose, selectedAreaCenter }: MapPointInfoCardProps) => {
  const miniMapContainerId = useMemo(
    () => `point-info-map-${Math.random().toString(36).slice(2, 10)}`,
    [],
  )
  const isMiniMapInitializedRef = useRef(false)
  const [isMiniMapReady, setIsMiniMapReady] = useState(false)

  const fieldMap = new Map<string, string>()
  for (const row of data ?? []) {
    if (!row?.fieldName) continue
    const value = cleanFieldValue(row.fieldValue)
    if (value) fieldMap.set(row.fieldName.toLowerCase(), value)
  }

  const getFieldValue = (fieldName: string) => fieldMap.get(fieldName.toLowerCase()) ?? ''

  const getPaymentValue = () => {
    const amount = getFieldValue('requirespaymentamount')
    const requiresPayment = getFieldValue('requirespayment')
    if (amount && requiresPayment && requiresPayment !== 'כן') return `${amount} (${requiresPayment})`
    return amount || requiresPayment
  }

  const details: DetailRowData[] = DETAIL_SPECS.map((spec) => {
    let value = spec.field === 'requirespaymentamount' ? getPaymentValue() : getFieldValue(spec.field)
    if (!value && spec.fallbackField) value = getFieldValue(spec.fallbackField)
    return { id: spec.id, icon: spec.icon, value }
  }).filter((item) => item.value)

  const title = getFieldValue('servicename')
  const description = getFieldValue('servicedescription')
  const serviceCenter: MapCenterPoint | null = (() => {
    const x = parseCoordinate(getFieldValue('gisx'))
    const y = parseCoordinate(getFieldValue('gisy'))
    if (x == null || y == null) return null
    return { x, y }
  })()
  const mapCenter = serviceCenter ?? selectedAreaCenter ?? null

  useEffect(() => {
    if (!mapCenter) return
    const govmap = window.govmap
    const container = document.getElementById(miniMapContainerId)
    if (!container || !govmap?.createMap) return

    if (!isMiniMapInitializedRef.current) {
      isMiniMapInitializedRef.current = true
      govmap.createMap(miniMapContainerId, {
        token: import.meta.env.VITE_GOVMAP_TOKEN,
        center: mapCenter,
        level: 10,
        layersMode: 1,
        identifyOnClick: false,
        onLoad: () => {
          setIsMiniMapReady(true)
          window.govmap?.zoomToXY?.({
            x: mapCenter.x,
            y: mapCenter.y,
            level: 10,
            marker: true,
          })
        },
      })
      return
    }

    govmap.zoomToXY?.({
      x: mapCenter.x,
      y: mapCenter.y,
      level: 10,
      marker: true,
    })
  }, [miniMapContainerId, mapCenter])

  return (
    <aside
      className="flex h-full w-[404px] max-w-[min(100vw,404px)] shrink-0 flex-col bg-white shadow-[2px_0_4px_rgba(164,177,192,0.2)]"
      dir="rtl"
      aria-label={`פרטי מענה: ${title}`}
    >
      <div className="flex min-h-0 flex-1 flex-col gap-4 px-8">
        <div className="flex w-full max-w-[340px] flex-col gap-2">
          <div className="flex pt-8 w-full items-center justify-between">
            <h2 className="text-right text-[22px] font-bold leading-[21px] text-[#084878]">{title}</h2>
            <button
              type="button"
              onClick={onClose}
              className="flex size-12 shrink-0 items-center justify-center rounded-3xl py-3 transition-colors hover:bg-[#f0f4f8]"
              aria-label="סגירה"
            >
              <IconClose />
            </button>
          </div>

          {!!description && (
            <div className="flex w-full items-center justify-center py-4">
              <p className="w-full text-right text-[14px] leading-[22px] text-[#34404f]">{description}</p>
            </div>
          )}
        </div>

        <div className="flex min-h-0 w-full max-w-[340px] flex-1 flex-col items-end gap-6 overflow-y-auto overflow-x-clip pb-6">
          <div className="relative h-[196px] w-full shrink-0 overflow-hidden rounded-2xl bg-[#f0f4f8]">
            <div id={miniMapContainerId} className="h-full w-full" aria-label="מפת האזור הנבחר" />
            {!isMiniMapReady && (
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#dce8f4] via-[#e8eef4] to-[#f0f4f8] opacity-60" />
            )}
            <button
              type="button"
              className="absolute left-[306px] top-2 flex items-center justify-center rounded-[7px] bg-white p-0.5 shadow-sm transition-colors hover:bg-[#f5f8fc]"
              aria-label="הרחבת מפה"
            >
              <span className="flex size-5 items-center justify-center">
                <IconExpand />
              </span>
            </button>
          </div>

          <div className="flex w-full flex-col items-end justify-center gap-3.5">
            {details.map((detail) => (
              <DetailRow key={detail.id} detail={detail} />
            ))}
          </div>
        </div>
      </div>
    </aside>
  )
}

export default MapPointInfoCard
