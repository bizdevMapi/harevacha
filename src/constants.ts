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

/**
 * מרכז ירושלים (קואורדינטות GovMap / רשת ישראל החדשה).
 * `cityId` = קוד היישוב בשדה cityid של שכבת המענים, וגם הערך של פרמטר cityid בכתובת.
 * `nearbyProviderCityCodes` = קודי providercitycode של «מענים נוספים בסביבה» של העיר.
 */
export const JERUSALEM_CITY_CENTER_AREA_OPTION = {
  label: 'ירושלים',
  cityId: 3000,
  cityObjectId: '1',
  value: { x: 220000, y: 630000 },
  geometry: 'POLYGON ((211000 621000, 227000 621000, 227000 643000, 211000 643000, 211000 621000))',
  nearbyProviderCityCodes: [
    1015, 2400, 2610, 3618, 4000, 5000, 6100, 6300, 6900, 7700, 7900, 8400, 8600, 8700,
  ],
} as const

/** מרכז טירת כרמל */
export const TIRAT_CARMEL_CITY_AREA_OPTION = {
  label: 'טירת כרמל',
  cityId: 2100,
  cityObjectId: '2',
  value: { x: 198811.34, y: 741553.42 },
  geometry: 'POLYGON ((196500 739500, 199500 739500, 199500 744000, 196500 744000, 196500 739500))',
  nearbyProviderCityCodes: [4000, 5000, 6900, 683],
} as const

/**
 * העיירות הקבועות בסלקט «אזור» — התוויות תואמות את setl_name בשכבה 22.
 * הסדר כאן הוא הסדר שבו מוצגים בסלקט הבלוקים של הערים (עיר, «מענים נוספים בסביבה», שכונות).
 */
export const DASHBOARD_CITY_AREA_OPTIONS = [
  TIRAT_CARMEL_CITY_AREA_OPTION,
  JERUSALEM_CITY_CENTER_AREA_OPTION,
] as const

export type CityAreaOption = (typeof DASHBOARD_CITY_AREA_OPTIONS)[number]

/** העיר שעליה נפתח הדשבורד כשאין פרמטר cityid בכתובת */
export const DASHBOARD_DEFAULT_CITY = TIRAT_CARMEL_CITY_AREA_OPTION

/**
 * מרכז וגיאומטריה של עיר לפי שמה — לזום לעיר במקום לשכונה כשנבחרו כמה שכונות.
 */
export function getCityAreaOptionByName(cityName: string | undefined): CityAreaOption | null {
  if (!cityName) return null
  return DASHBOARD_CITY_AREA_OPTIONS.find((city) => city.label === cityName) ?? null
}

/** עיר לפי קוד יישוב — לזיהוי הערך של פרמטר cityid בכתובת */
export function getCityAreaOptionByCityId(cityId: number | null): CityAreaOption | null {
  if (cityId == null) return null
  return DASHBOARD_CITY_AREA_OPTIONS.find((city) => city.cityId === cityId) ?? null
}

/** פוליגון שמכסה את כל שטח הארץ — לשימוש עם intersectFeatures כשהסינון האמיתי נעשה ב-whereClause ולא בגיאומטריה */
export const ISRAEL_EXTENT_POLYGON =
  'POLYGON ((130000 380000, 285000 380000, 285000 805000, 130000 805000, 130000 380000))' as const

/** רמת זום ל-GovMap — ערכים גבוהים מדי (למשל 10+) עלולים להציג מפה לבנה ללא אריחי בסיס */
export const GOVMAP_DEFAULT_VIEW_LEVEL = 7 as const

/** מרמת זום זו ומעלה — קליק בוחר שכונה; מתחת — קליק בוחר יישוב */
export const GOVMAP_NEIGHBORHOOD_CLICK_MIN_LEVEL = 8 as const

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
export function getProfileInsightsMainTitle(selectedAreas: string[], profileKey: string): string {
  const isAllCity = selectedAreas.length === 1 && selectedAreas[0] === DASHBOARD_ALL_CITY_AREA_VALUE
  const hasProfile = profileKey !== 'none'
  const isMultipleAreas = selectedAreas.length > 1

  if (isAllCity && !hasProfile) {
    return 'לפי פרופילים בכל העיר'
  }
  if (isAllCity && hasProfile) {
    return `לפי ${getProfileFilterLabel(profileKey)} בכל העיר`
  }
  if (isMultipleAreas) {
    return hasProfile
      ? `לפי ${getProfileFilterLabel(profileKey)} באזורים הנבחרים`
      : 'לפי פרופילים באזורים הנבחרים'
  }
  if (hasProfile) {
    const areaLabel = getDashboardAreaLabel(selectedAreas[0])
    return `לפי ${getProfileFilterLabel(profileKey)} ב${areaLabel}`
  }
  const areaLabel = getDashboardAreaLabel(selectedAreas[0])
  return `לפי פרופילים ב${areaLabel}`
}

export const SITE = Object.freeze({
  locale: 'he',
  layers: Object.freeze({
    municipalitiesLayer: 'layer_125',
    neighborhoodsLayer: 'layer_22',
    statisticsLayer: 'layer_23',
    servicesLayer: import.meta.env.VITE_SERVICES_LAYER || 'layer_233404',
    sportsLayer: 'layer_400',
    seniorHousingLayer: 'layer_337',
    institutionsLayer: 'layer_96',
    postLayer: 'layer_200710',
    populationCensusLayer: 'layer_313',
  }),

  
})
