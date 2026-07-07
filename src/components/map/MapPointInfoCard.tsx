import { useEffect, useRef, useState } from 'react'
import type { MapPointInfoIconId } from './mapPointInfoData'
import { IconClose, IconExpand, MapPointInfoIcon } from './MapPointInfoIcons'

export type MapPointInfoField = {
  fieldName?: string
  fieldValue?: unknown
}

type MapPointInfoCardProps = {
  data: MapPointInfoField[]
  isOtherLayer?: boolean
  onClose: () => void
  selectedAreaCenter?: { x: number; y: number } | null
  onExpandMap: (center: { x: number; y: number } | null) => void
}

type DetailRowData = {
  id: string
  icon: MapPointInfoIconId
  value: string,
  hebel?: string
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

function DetailRow({ detail, showLabel }: { detail: DetailRowData; showLabel?: boolean }) {
  if (showLabel) {
    return (
      <div className="flex w-full shrink-0 items-start justify-between gap-3">
        <span className="text-right text-[14px] font-semibold leading-[22.871px] text-[#084878]">
          {detail.id}
        </span>
                <p className="min-w-0 flex-1 text-left text-[14px] leading-[22.871px] text-[#5f708a]">{detail.value}</p>

      </div>
    )
  }

  return (
    <div className="w-full">
      {/* <span className="flex size-5 shrink-0 items-center justify-center">
        <MapPointInfoIcon icon={detail.icon} />
      </span> */}
      <span className="w-full text-right text-[14px] font-semibold leading-[22.871px] text-[#084878]">
        {detail.hebel || detail.id}
      </span>
      <p className="w-full flex-1 text-right text-[14px] leading-[22.871px] text-[#5f708a]">{detail.value}</p>
    </div>
  )
}

const DETAIL_SPECS: Array<{ id: string; icon: MapPointInfoIconId; field: string; hebel: string; fallbackField?: string }> = [
  // 1-2: ServiceName and ServiceDescription are displayed separately as title and description
  // 3: התאמה למצבי סיכון
  { id: 'risk', icon: 'target', field: 'riskstatusdescription_agg', hebel: 'מצבי סיכון' },
  // 4: לאילו מצבי סיכון מענה זה מתאים?
  { id: 'airisktype', icon: 'target', field: 'airisktype', hebel: 'מצבי סיכון' },
  // 5: מדוע מענה זה מוצג כ/ן?
  { id: 'aiscore', icon: 'target', field: 'aiscoreexplanation', hebel: 'מדוע מענה זה מוצג ?' },
  // 6: כתובת
  { id: 'address', icon: 'location', field: 'fulladdress', hebel: 'כתובת' },
  // 7: סוג מיקום
  { id: 'location', icon: 'location', field: 'locationtype', hebel: 'סוג מיקום' },
  // 8: אוכלוסיה ייעודית
  { id: 'audience', icon: 'group', field: 'targetpopulations', hebel: 'אוכלוסיה ייעודית' },
  // 9: שם ארגון מספק השירות
  { id: 'provider', icon: 'building', field: 'providername', hebel: 'שם ארגון מספק השירות' },
  // 10: מייל
  { id: 'mail', icon: 'phone', field: 'mail', hebel: 'מייל' },
  // 11: טלפון
  { id: 'phone', icon: 'phone', field: 'phone', hebel: 'טלפון' },
  // 12: פרטי קשר
  { id: 'contact', icon: 'phone', field: 'contactdetails', hebel: 'פרטי קשר' },
  // 13: סוג מענה
  { id: 'servicetype', icon: 'building', field: 'servicetypename', hebel: 'סוג מענה' },
  // 14: סוג פעילות
  { id: 'activitytype', icon: 'building', field: 'activitytype', hebel: 'סוג פעילות' },
  // 15: נגישות
  { id: 'accessibility', icon: 'accessibility', field: 'accessibility', hebel: 'נגישות' },
  // 16: פירוט על נגישות
  { id: 'accessibilitytext', icon: 'accessibility', field: 'accessibilitytext', hebel: 'פירוט על נגישות' },
  // 17: קהל יעד
  { id: 'eligibility', icon: 'group', field: 'participationeligibility', hebel: 'קהל יעד' },
  // 18: שפות
  { id: 'language', icon: 'language', field: 'language', hebel: 'שפות'   },
  // 19: סוג ארגון (נותן השירות)
  { id: 'providertype', icon: 'building', field: 'serviceproviderorganizationtype', hebel: 'סוג ארגון (נותן השירות)' },
  // 20: שעות פעילות
  { id: 'hours', icon: 'clock', field: 'openhours', hebel: 'שעות פעילות' },
  // 21: תדירות
  { id: 'frequency', icon: 'clock', field: 'frequency', hebel: 'תדירות' },
  // 22: דרוש תשלום
  { id: 'payment', icon: 'price', field: 'requirespayment', hebel: 'דרושים תשלום' },
  // 23: עלות
  { id: 'price', icon: 'price', field: 'requirespaymentamount', hebel: 'עלות' },
  // 24: אתר מקור
  { id: 'link', icon: 'link', field: 'servicelink', hebel: 'אתר מקור' },
  // 25: תאריך שליפת המידע מהרשת
  { id: 'insertdate', icon: 'clock', field: 'insertdate', hebel: 'תאריך שליפת המידע מהרשת' },
  // 26: תאריך
  { id: 'servicedate', icon: 'clock', field: 'servicedate', hebel: 'תאריך' },
]

const MapPointInfoCard = ({
  data,
  isOtherLayer = false,
  onClose,
  selectedAreaCenter,
  onExpandMap,
}: MapPointInfoCardProps) => {
  const lastServiceNameRef = useRef<string | null>(null)
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

  // For other layers, show all fields with values (with field names as labels)
  const details: DetailRowData[] = isOtherLayer
    ? (() => {
        const allFields: DetailRowData[] = []
        for (const row of data ?? []) {
          if (!row?.fieldName) continue
          const value = cleanFieldValue(row.fieldValue)
          if (value) {
            allFields.push({
              id: row.fieldName, // field name will be shown as label
              icon: 'location', // default icon for other layers
              value: value,
            })
          }
        }
        return allFields // all fields
      })()
    : DETAIL_SPECS.map((spec) => {
        let value = spec.field === 'requirespaymentamount' ? getPaymentValue() : getFieldValue(spec.field)

        // Special handling for fulladdress field based on LocationType
        if (spec.field === 'fulladdress' && !value) {
          const locationType = getFieldValue('locationtype')
          // If LocationType is physical (פיזי), show "לא נמצאה כתובת"
          // Otherwise, skip the address field entirely (value stays empty)
          if (locationType && locationType.toLowerCase().includes('פיזי')) {
            value = 'לא נמצאה כתובת'
          }
        }

        if (!value && spec.fallbackField) value = getFieldValue(spec.fallbackField)
        return { id: spec.id, icon: spec.icon, value, hebel: spec.hebel }
      }).filter((item) => item.value)

  const title = isOtherLayer
    ? 'מידע נוסף'
    : getFieldValue('servicename')
  const description = isOtherLayer
    ? ''
    : getFieldValue('servicedescription')
  const serviceCenter: MapCenterPoint | null = (() => {
    const x = parseCoordinate(getFieldValue('gisx'))
    const y = parseCoordinate(getFieldValue('gisy'))
    if (x == null || y == null) return null
    return { x, y }
  })()
  const mapCenter = isOtherLayer ? null : (serviceCenter ?? selectedAreaCenter ?? null)

  // Reset mini map when switching services
  if (lastServiceNameRef.current !== title) {
    lastServiceNameRef.current = title
    setIsMiniMapReady(false)
  }

  useEffect(() => {
    if (!mapCenter) return

    const timer = setTimeout(() => {
      setIsMiniMapReady(true)
    }, 500)

    return () => clearTimeout(timer)
  }, [mapCenter, title])

  // Create iframe-based mini map URL
  const miniMapSrc = mapCenter
    ? `https://govmap.gov.il/?c=${mapCenter.x},${mapCenter.y}&z=10&mk=1`
    : null

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
          <div className="flex w-full flex-col items-end justify-center gap-3.5">
            {details.map((detail) => (
              <DetailRow key={detail.id} detail={detail} showLabel={isOtherLayer} />
            ))}
          </div>

          {miniMapSrc && (
            <div className="relative h-[196px] w-full shrink-0 overflow-hidden rounded-2xl bg-[#f0f4f8]">
              <iframe
                src={miniMapSrc}
                className="h-full w-full border-0"
                title="מפת המענה"
                loading="lazy"
              />
              {!isMiniMapReady && (
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#dce8f4] via-[#e8eef4] to-[#f0f4f8] opacity-60" />
              )}
              <button
                type="button"
                onClick={() => onExpandMap(mapCenter)}
                className="absolute right-2 top-2 flex items-center justify-center rounded-[7px] bg-white p-0.5 shadow-sm transition-colors hover:bg-[#f5f8fc]"
                aria-label="הרחבת מפה"
              >
                <span className="flex size-5 items-center justify-center">
                  <IconExpand />
                </span>
              </button>
            </div>
          )}
        </div>
      </div>
    </aside>
  )
}

export default MapPointInfoCard
