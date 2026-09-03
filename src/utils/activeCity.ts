import {
  DASHBOARD_CITY_AREA_OPTIONS,
  DASHBOARD_DEFAULT_CITY,
  getCityAreaOptionByCityId,
  getCityCenterAreaSelectValue,
  type CityAreaOption,
} from '../constants'

/** שם הפרמטר בכתובת שקובע איזו עיר מוצגת — נקרא ללא תלות באותיות גדולות/קטנות */
const CITY_ID_PARAM_NAME = 'cityid'

/**
 * קוד היישוב מפרמטר cityid בכתובת, או null כשהפרמטר חסר או שאינו מספר.
 * הקריאה case-insensitive כדי שגם `?CITYID=3000` יעבוד.
 */
export function getCityIdFromSearch(search: string): number | null {
  const params = new URLSearchParams(search)
  for (const [key, rawValue] of params.entries()) {
    if (key.trim().toLowerCase() !== CITY_ID_PARAM_NAME) continue
    const value = rawValue.trim()
    if (!/^\d+$/.test(value)) return null
    return Number(value)
  }
  return null
}

/**
 * העיר שנבחרה בכתובת, או null כשאין פרמטר או שהקוד אינו אחת מהערים שהדשבורד מכיר —
 * במקרה כזה חוזרים להתנהגות «כל הערים», כדי שקישור עם קוד שגוי לא יציג מסך ריק.
 */
export const URL_SELECTED_CITY: CityAreaOption | null = getCityAreaOptionByCityId(
  getCityIdFromSearch(window.location.search),
)

/** הערים שמוצגות בסלקט «אזור» — רק העיר מהכתובת, או כל הערים כשאין פרמטר */
export const ACTIVE_CITY_AREA_OPTIONS: readonly CityAreaOption[] = URL_SELECTED_CITY
  ? [URL_SELECTED_CITY]
  : DASHBOARD_CITY_AREA_OPTIONS

/** העיר שעליה נפתחת המפה ושהאזור שלה נבחר בטעינה */
export const ACTIVE_DEFAULT_CITY: CityAreaOption = URL_SELECTED_CITY ?? DASHBOARD_DEFAULT_CITY

/**
 * האזור הנבחר כברירת מחדל — גם כמצב ההתחלתי של הדשבורד וגם היעד של «נקה הכל»,
 * כדי שתמיד יישאר אזור אחד נבחר (הזרימה של המפה ורשימת המענים מניחה בחירה לא ריקה).
 */
export const ACTIVE_DEFAULT_AREA_VALUE = getCityCenterAreaSelectValue(ACTIVE_DEFAULT_CITY.value)
