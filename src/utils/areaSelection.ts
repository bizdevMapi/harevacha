import type { NeighborhoodMapOption } from '../context/DashboardUiContext'

const isCityOption = (option: NeighborhoodMapOption): boolean => option.cityObjectId != null
const isNeighborhoodOption = (option: NeighborhoodMapOption): boolean =>
  option.layerObjectId != null

/**
 * «כל העיר» ושכונות של אותה עיר לא נבחרים יחד — הבחירה האחרונה קובעת:
 * סימון שכונה מסיר את בחירת העיר (כדי שהתוצאות יגיעו רק מהשכונות שנבחרו),
 * וסימון «כל העיר» מסיר את השכונות שלה.
 *
 * הכלל מופעל לפי מה שנוסף בפעולה הזו ולא על כל הבחירה, אחרת סימון «כל העיר»
 * בזמן ששכונות מסומנות היה מתבטל מיד והצ'קבוקס של העיר היה נראה כאילו אינו עובד.
 * פריטים בלי שם עיר (למשל «מענים נוספים בסביבה») לא מושפעים.
 */
export function applyCityNeighborhoodExclusivity(
  previousValues: string[],
  nextValues: string[],
  neighborhoodsList: NeighborhoodMapOption[],
): string[] {
  const byOptionValue = new Map(neighborhoodsList.map((option) => [option.optionValue, option]))
  const previous = new Set(previousValues)
  const added = nextValues.filter((value) => !previous.has(value))
  if (added.length === 0) return nextValues

  /** עיירות שנבחרה להן שכונה עכשיו — בחירת «כל העיר» שלהן מוסרת */
  const citiesToDrop = new Set<string>()
  /** עיירות שנבחרה להן «כל העיר» עכשיו — השכונות שלהן מוסרות */
  const neighborhoodsToDrop = new Set<string>()

  for (const value of added) {
    const option = byOptionValue.get(value)
    if (!option?.cityName) continue
    if (isCityOption(option)) neighborhoodsToDrop.add(option.cityName)
    else if (isNeighborhoodOption(option)) citiesToDrop.add(option.cityName)
  }

  if (citiesToDrop.size === 0 && neighborhoodsToDrop.size === 0) return nextValues

  const filtered = nextValues.filter((value) => {
    const option = byOptionValue.get(value)
    if (!option?.cityName) return true
    if (isCityOption(option) && citiesToDrop.has(option.cityName)) return false
    if (isNeighborhoodOption(option) && neighborhoodsToDrop.has(option.cityName)) return false
    return true
  })

  // לא משאירים בחירה ריקה — הזרימה של המפה ורשימת המענים מניחה אזור אחד לפחות
  return filtered.length > 0 ? filtered : nextValues
}
