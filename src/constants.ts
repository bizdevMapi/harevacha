/**
 * קבועים גלובליים לאתר.
 * ייבוא לפי שם מכל מקום תחת `src/`:
 *
 * @example
 * import { SITE } from './constants'
 */

/** הגדרת שכבה ל־getLayerFeaturesByLocation — עדכן שדות לפי נספח א׳ / ממשק הניהול */
export type SpatialLayerQuery = {
  readonly name: string
  readonly fields: readonly string[]
}

/** אפשרויות «נתוני אוכלוסייה» — מקור אחד לסרגל המסננים ולכותרות בכרטיס התובנות */
export const POPULATION_SEGMENT_OPTIONS = [
  { value: 'none', label: 'ללא פילוח' },
  { value: 'risk', label: 'בסיכון להתעללות והזנחה' },
  { value: 'household', label: 'לפי משק בית' },
] as const

export function getPopulationSegmentLabel(segmentValue: string): string {
  const row = POPULATION_SEGMENT_OPTIONS.find((o) => o.value === segmentValue)
  return row?.label ?? segmentValue
}

/** ערך «כל העיר» בסלקט האזור — יישור עם FilterToolbar */
export const DASHBOARD_ALL_CITY_AREA_VALUE = 'jerusalem-all'

export const DASHBOARD_AREA_OPTIONS = [
  { value: 'jerusalem-all', label: 'ירושלים - כל העיר' },
  { value: 'jerusalem-center', label: 'ירושלים - מרכז' },
  { value: 'jerusalem-south', label: 'ירושלים - דרום' },
] as const

export const PROFILE_FILTER_OPTIONS = [
  { value: 'none', label: 'ללא פרופיל' },
  { value: 'profileA', label: 'פרופיל א' },
  { value: 'profileB', label: 'פרופיל ב' },
  { value: 'profileC', label: 'פרופיל ג' },
] as const

export function getDashboardAreaLabel(areaValue: string): string {
  const row = DASHBOARD_AREA_OPTIONS.find((o) => o.value === areaValue)
  return row?.label ?? areaValue
}

export function getProfileFilterLabel(profileValue: string): string {
  const row = PROFILE_FILTER_OPTIONS.find((o) => o.value === profileValue)
  return row?.label ?? profileValue
}

/**
 * כותרת ראשית בכרטיס תובנות — לפי אזור ופרופיל שנבחרו בסרגל.
 */
export function getProfileInsightsMainTitle(selectedArea: string, profileKey: string): string {
  const isAllCity = selectedArea === DASHBOARD_ALL_CITY_AREA_VALUE
  const hasProfile = profileKey !== 'none'

  if (isAllCity && !hasProfile) {
    return 'לפי פרופילים בכל העיר'
  }
  if (isAllCity && hasProfile) {
    return `לפי ${getProfileFilterLabel(profileKey)} בכל העיר`
  }
  if (!isAllCity && hasProfile) {
    const areaLabel = getDashboardAreaLabel(selectedArea)
    return `לפי ${getProfileFilterLabel(profileKey)} ב${areaLabel}`
  }
  const areaLabel = getDashboardAreaLabel(selectedArea)
  return `לפי פרופילים ב${areaLabel}`
}

export const SITE = Object.freeze({
  locale: 'he',
  layers: Object.freeze({
    municipalitiesLayer: 'layer_125',
  }),
  /**
   * ניתוח מרחבי (standalone) — govmap.getLayerFeaturesByLocation
   * @see https://api.govmap.gov.il/docs/standalone/get-layer-features-by-location
   */
  spatialAnalysis: Object.freeze({
    radiusMeters: 150,
    layers: Object.freeze<SpatialLayerQuery[]>([
      Object.freeze({
        name: 'layer_125',
        /** החלף בשמות שדות אמיתיים מהשכבה; לדוגמה: ['שם_ישוב'] וכו׳ */
        fields: Object.freeze(['OBJECTID']),
      }),
    ]),
  }),
})
