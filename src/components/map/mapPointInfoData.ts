/** סוג אייקון לשורת פרטים — להרחבה כשמחברים ל-API */
export type MapPointInfoIconId =
  | 'location'
  | 'phone'
  | 'clock'
  | 'group'
  | 'language'
  | 'target'
  | 'price'
  | 'building'
  | 'accessibility'

export type MapPointInfoDetail = {
  id: string
  icon: MapPointInfoIconId
  value: string
}

/** מבנה נתוני מענה נבחר — החלף ב-`MapPointInfo` מ-API / GovMap */
export type MapPointInfo = {
  id: string
  title: string
  description: string
  /** תמונת תצוגה מקדימה למפה (אופציונלי) */
  mapPreviewUrl?: string
  details: MapPointInfoDetail[]
}

/**
 * נתוני דוגמה — להחלפה בקריאה אמיתית, למשל:
 * `setSelectedPointInfo(mapGovmapFeatureToPointInfo(feature))`
 */
/** המרה זמנית מתשובת GovMap — להחליף כשה-API ייציב */
export function mapGovmapEntityToPointInfo(rawEntity: {
  fields?: Array<{ name?: string; fieldValue?: string; value?: string }>
}): MapPointInfo | null {
  const fields = rawEntity.fields ?? []
  const getVal = (name: string) =>
    fields.find((f) => f.name === name)?.fieldValue ?? fields.find((f) => f.name === name)?.value

  const title = getVal('servicenam')
  if (!title) return null

  const description = getVal('address') ?? ''
  const otherFields = fields.filter(
    (f) => f.name && !['servicenam', 'serviceid', 'address'].includes(f.name),
  )

  return {
    id: String(getVal('serviceid') ?? title),
    title,
    description,
    details: otherFields.map((f, i) => ({
      id: f.name ?? `field-${i}`,
      icon: 'location' as const,
      value: f.fieldValue ?? f.value ?? '',
    })),
  }
}

export const MOCK_SELECTED_MAP_POINT: MapPointInfo = {
  id: 'mock-bari-bahaim',
  title: 'בריא בחיים',
  description:
    'מרכז לאורח חיים בריא לגיל השלישי, עם פעילות גופנית מותאמת, תזונה נכונה וקהילה תומכת לחיים פעילים ומלאי חיוניות.',
  details: [
    { id: 'address', icon: 'location', value: 'שמואל הלוי 44, ירושלים' },
    { id: 'phone', icon: 'phone', value: '02-6457898' },
    { id: 'hours', icon: 'clock', value: "א'-ה', 8:00-16:00" },
    { id: 'audience', icon: 'group', value: 'כללית, ערבים, חרדים, דתיים, עולים' },
    { id: 'languages', icon: 'language', value: 'עברית, ערבית, רוסית' },
    { id: 'focus', icon: 'target', value: 'עוני, ניתוק חברתי, ירידה קוגניטיבית' },
    { id: 'price', icon: 'price', value: '50-80 ש״ח למפגש' },
    { id: 'provider', icon: 'building', value: 'קופ״ח' },
    { id: 'accessibility', icon: 'accessibility', value: 'מגבלת ניידות, שמיעה' },
  ],
}
