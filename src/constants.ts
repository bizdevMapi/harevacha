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

/** אזור קבוע ראשון בסלקט «אזור» — מרכז ירושלים (קואורדינטות GovMap / רשת ישראל החדשה) */
export const JERUSALEM_CITY_CENTER_AREA_OPTION = {
  label: 'ירושלים - מרכז העיר',
  value: { x: 220000, y: 630000 },
  geometry: 'POLYGON ((211000 621000, 227000 621000, 227000 643000, 211000 643000, 211000 621000))'
} as const

/** מרכז טירת כרמל — אחרי שכונות ירושלים ולפני שכונות טירת כרמל מהשכבה */
export const TIRAT_CARMEL_CITY_AREA_OPTION = {
  label: 'טירת כרמל - מרכז העיר',
  value: { x: 198811.34, y: 741553.42 },
  geometry: 'POLYGON ((196500 739500, 199500 739500, 199500 744000, 196500 744000, 196500 739500))'
} as const

/** רמת זום ל-GovMap — ערכים גבוהים מדי (למשל 10+) עלולים להציג מפה לבנה ללא אריחי בסיס */
export const GOVMAP_DEFAULT_VIEW_LEVEL = 7 as const

/** מרמת זום זו ומעלה — קליק בוחר שכונה; מתחת — קליק בוחר יישוב */
export const GOVMAP_NEIGHBORHOOD_CLICK_MIN_LEVEL = 9 as const

/** מזהי שכבות ל-identify (ללא קידומת layer_) */
export const GOVMAP_NEIGHBORHOODS_LAYER_ID = '22' as const
export const GOVMAP_MUNICIPALITIES_LAYER_ID = '125' as const

/** ערך ייחודי ל־<select> לפי קואורדינטות מרכז (פריטי «מרכז העיר» הקבועים) */
export function getCityCenterAreaSelectValue(point: { x: number; y: number }): string {
  return `${point.x},${point.y}`
}

export const PROFILE_FILTER_OPTIONS = [
  { value: 'none', label: 'ללא פרופיל' },
  { value: 'profileA', label: 'פרופיל א' },
  { value: 'profileB', label: 'פרופיל ב' },
  { value: 'profileC', label: 'פרופיל ג' },
] as const

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
    neighborhoodsLayer: 'layer_22',
    servicesLayer: import.meta.env.VITE_SERVICES_LAYER || 'layer_233404',
  }),

  
})
