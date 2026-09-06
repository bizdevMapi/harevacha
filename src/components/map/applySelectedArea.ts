import {
  getCityAreaOptionByName,
  GOVMAP_DEFAULT_VIEW_LEVEL,
  GOVMAP_MUNICIPALITIES_LAYER_ID,
  ISRAEL_EXTENT_POLYGON,
  SITE,
} from '../../constants'
import type { NeighborhoodMapOption } from '../../context/DashboardUiContext'
import type { ServiceListItem } from '../../data/servicesListTypes'
import {
  mapIntersectFeaturesToServicesList,
  SERVICE_TABLE_LAYER_FIELDS,
} from '../../data/servicesListTypes'
import { MAP_POINT_INFO_FIELD_NAMES, type MapPointInfoField } from './MapPointInfoCard'

const NEIGHBORHOODS_LAYER_NAME = '22'

export type ApplySelectedAreaCallbacks = {
  setServicesQueryGeometry: (geometry: string) => void
  setServicesListLoading: (loading: boolean) => void
  setServicesList: (services: ServiceListItem[] | ((prev: ServiceListItem[]) => ServiceListItem[])) => void
}

/**
 * מיקוד מפה + טעינת מענים באזור — מקור יחיד לשינוי אזור בסרגל.
 */
const GOVMAP_TOKEN = import.meta.env.VITE_GOVMAP_TOKEN
const PAGE_SIZE = 1000

export function parseBboxFromGeometry(geometry: string): [number, number, number, number] | null {
  try {
    // Try parsing as WKT format first (e.g., "POLYGON ((x1 y1, x2 y2, ...))" or "MULTIPOLYGON (((x1 y1, x2 y2, ...)))")
    if (geometry.startsWith('POLYGON') || geometry.startsWith('MULTIPOLYGON')) {
      // Match coordinates inside the innermost parentheses
      // For POLYGON: ((coords)) -> extract coords
      // For MULTIPOLYGON: (((coords))) -> extract coords from first polygon
      const coordsMatch = geometry.match(/\(\(\(([^)]+)\)\)\)|\(\(([^)]+)\)\)/)
      if (!coordsMatch) return null

      // Get the matched group (group 1 for MULTIPOLYGON, group 2 for POLYGON)
      const coordsString = coordsMatch[1] || coordsMatch[2]
      if (!coordsString) return null

      const coordPairs = coordsString.split(',').map(pair => {
        const [x, y] = pair.trim().split(/\s+/).map(Number)
        return { x, y }
      })

      if (coordPairs.length === 0) return null

      // Calculate bbox from all coordinates
      let minX = coordPairs[0].x
      let minY = coordPairs[0].y
      let maxX = coordPairs[0].x
      let maxY = coordPairs[0].y

      for (const point of coordPairs) {
        if (point.x < minX) minX = point.x
        if (point.y < minY) minY = point.y
        if (point.x > maxX) maxX = point.x
        if (point.y > maxY) maxY = point.y
      }

      return [minX, minY, maxX, maxY]
    }

    // Try parsing as JSON format (e.g., {"rings": [[[x1, y1], [x2, y2], ...]]})
    const parsed = JSON.parse(geometry)
    if (!parsed || !parsed.rings || !Array.isArray(parsed.rings) || parsed.rings.length === 0) {
      return null
    }

    const coordinates = parsed.rings[0]
    if (!Array.isArray(coordinates) || coordinates.length === 0) {
      return null
    }

    // Calculate bbox from all coordinates
    let minX = coordinates[0][0]
    let minY = coordinates[0][1]
    let maxX = coordinates[0][0]
    let maxY = coordinates[0][1]

    for (const point of coordinates) {
      if (!Array.isArray(point) || point.length < 2) continue
      if (point[0] < minX) minX = point[0]
      if (point[1] < minY) minY = point[1]
      if (point[0] > maxX) maxX = point[0]
      if (point[1] > maxY) maxY = point[1]
    }

    return [minX, minY, maxX, maxY]
  } catch (error) {
    console.error('Failed to parse bbox from geometry:', error)
    return null
  }
}

/**
 * שליפת המענים של אזור בודד (עם עימוד) — יחידת עבודה שגם המסלול היחיד וגם המסלול המרובה משתמשים בה.
 */
async function fetchServicesForArea(
  option: NeighborhoodMapOption,
  bbox: [number, number, number, number] | null,
): Promise<ServiceListItem[]> {
  const govmap = window.govmap
  let allRows: ServiceListItem[] = []
  let currentPageToken: string | undefined
  let totalRecords = 0

  do {
    const params = {
      apiKey: GOVMAP_TOKEN,
      source: {
        layer: SITE.layers.servicesLayer,
        srid: govmap?.aggSrid?.Itm,
      },
      operation: {
        type: 'table',
        fields: [...SERVICE_TABLE_LAYER_FIELDS],
      },
      output: {
        limit: PAGE_SIZE,
        page_token: currentPageToken,
      },
      filter: {} as any,
    }
    if (option.filter) params.filter.filter = option.filter
    else {
      params.filter.view_mode = 'extent'
      params.filter.bbox = bbox
    }
    const response = await govmap?.aggregate?.(params)

    console.log('aggregate response:', response)

    const rows = mapIntersectFeaturesToServicesList(response?.data, SERVICE_TABLE_LAYER_FIELDS)
    allRows = [...allRows, ...rows]

    const metadata = (response as any)?.metadata
    totalRecords = metadata?.total_records_found ?? 0
    const nextToken = response?.paging?.next_page_token
    const hasMore = response?.paging?.has_more ?? false

    if (!hasMore || !nextToken) break
    currentPageToken = nextToken
  } while (allRows.length < totalRecords)

  return allRows
}

function unionBbox(
  boxes: Array<[number, number, number, number]>,
): [number, number, number, number] | null {
  if (boxes.length === 0) return null
  return boxes.reduce((acc, box) => [
    Math.min(acc[0], box[0]),
    Math.min(acc[1], box[1]),
    Math.max(acc[2], box[2]),
    Math.max(acc[3], box[3]),
  ] as [number, number, number, number])
}

function zoomToBboxCenter(bbox: [number, number, number, number]): void {
  window.govmap?.zoomToXY?.({
    x: (bbox[0] + bbox[2]) / 2,
    y: (bbox[1] + bbox[3]) / 2,
    level: GOVMAP_DEFAULT_VIEW_LEVEL,
    marker: false,
  })
}

/**
 * התמקדות בעיר שהאזורים הנבחרים שייכים לה, במקום בשכונות עצמן — ההתנהגות של בחירה מרובה.
 * שכונות של טירת כרמל → זום לטירת כרמל, שכונות של ירושלים → זום לירושלים.
 * בחירה שחוצה עיירות → תיבה שמכילה את כולן.
 * מחזיר false כשאין מידע עיר על אף אזור נבחר, כדי שהקורא יחזור להתמקדות לפי הגיאומטריות.
 */
function zoomToCitiesOfAreas(options: NeighborhoodMapOption[]): boolean {
  const cities: Array<{ label: string; value: { x: number; y: number }; geometry: string }> = []
  const seen = new Set<string>()

  for (const option of options) {
    const city = getCityAreaOptionByName(option.cityName)
    if (!city || seen.has(city.label)) continue
    seen.add(city.label)
    cities.push({ label: city.label, value: { ...city.value }, geometry: city.geometry })
  }

  if (cities.length === 0) return false

  if (cities.length === 1) {
    window.govmap?.zoomToXY?.({
      x: cities[0].value.x,
      y: cities[0].value.y,
      level: GOVMAP_DEFAULT_VIEW_LEVEL,
      marker: false,
    })
    return true
  }

  const cityBboxes: Array<[number, number, number, number]> = []
  for (const city of cities) {
    const bbox = parseBboxFromGeometry(city.geometry)
    if (bbox) cityBboxes.push(bbox)
  }
  const combined = unionBbox(cityBboxes)
  if (!combined) return false
  zoomToBboxCenter(combined)
  return true
}

/**
 * מיקוד מפה + טעינת מענים לאזור יחיד — לשימוש כשיש בדיוק בחירה אחת.
 */
export async function applySelectedArea(
  option: NeighborhoodMapOption,
  callbacks: ApplySelectedAreaCallbacks,
): Promise<void> {
  return applySelectedAreas([option], callbacks)
}

/**
 * מיקוד מפה + טעינת מענים לפי כל האזורים הנבחרים — מקור יחיד לשינוי בחירת אזור בסרגל.
 * תומך גם בבחירה בודדת (מערך באורך 1) וגם בבחירה מרובה.
 */
export async function applySelectedAreas(
  options: NeighborhoodMapOption[],
  callbacks: ApplySelectedAreaCallbacks,
): Promise<void> {
  const govmap = window.govmap
  if (!govmap || options.length === 0) return

  callbacks.setServicesQueryGeometry(options[0]?.geometry ?? '')

  const layerObjectIds = options
    .filter((o) => o.layerObjectId != null)
    .map((o) => String(o.layerObjectId))
  const municipalityObjectIds = options
    .filter((o) => o.municipalityObjectId != null)
    .map((o) => String(o.municipalityObjectId))

  if (layerObjectIds.length > 0) {
    govmap.searchInLayer?.({
      layerName: NEIGHBORHOODS_LAYER_NAME,
      fieldName: 'objectid',
      fieldValues: layerObjectIds,
      highlight: false,
    })
  } else if (municipalityObjectIds.length > 0) {
    govmap.searchInLayer?.({
      layerName: GOVMAP_MUNICIPALITIES_LAYER_ID,
      fieldName: 'objectid',
      fieldValues: municipalityObjectIds,
      highlight: false,
    })
  } else {
    const first = options[0]
    govmap.zoomToXY?.({
      x: first.value.x,
      y: first.value.y,
      level: GOVMAP_DEFAULT_VIEW_LEVEL,
      marker: false,
    })
  }

  const bboxes: Array<[number, number, number, number]> = []
  for (const option of options) {
    if (!option.geometry) continue
    const bbox = parseBboxFromGeometry(option.geometry)
    if (!bbox) {
      console.error('Failed to parse bbox from geometry')
      continue
    }
    bboxes.push(bbox)
  }

  // בבחירה מרובה ההתמקדות היא בעיר שהאזורים שייכים לה ולא בשכונות עצמן.
  // הקריאה כאן מגיעה אחרי searchInLayer בכוונה, כדי שהזום לעיר יהיה האחרון שקובע.
  const zoomedToCity = options.length > 1 && zoomToCitiesOfAreas(options)

  if (!zoomedToCity && layerObjectIds.length === 0 && municipalityObjectIds.length === 0) {
    const combinedBbox = unionBbox(bboxes)
    if (combinedBbox) zoomToBboxCenter(combinedBbox)
  }

  callbacks.setServicesListLoading(true)

  try {
    const rowsPerArea = await Promise.all(
      options.map((option) => {
        const bbox = option.geometry ? parseBboxFromGeometry(option.geometry) : null
        if (!bbox && option.geometry) {
          return Promise.resolve<ServiceListItem[]>([])
        }
        return fetchServicesForArea(option, bbox)
      }),
    )

    const seen = new Set<string>()
    const mergedRows: ServiceListItem[] = []
    for (const rows of rowsPerArea) {
      for (const row of rows) {
        const key = String(row.serviceid)
        if (seen.has(key)) continue
        seen.add(key)
        mergedRows.push(row)
      }
    }

    callbacks.setServicesList(mergedRows)
  } catch (error) {
    console.error('failed applying selected areas', error)
    callbacks.setServicesList([])
  } finally {
    callbacks.setServicesListLoading(false)
  }
}

/**
 * שליפת כל השדות של מענה בודד לפי serviceid — לפתיחת "מידע נוסף של מענה" מתוך הטבלה
 * באותה מלאות שיש בלחיצה מהמפה, בלי לטעון את כל השדות האלה מראש עבור כל שורות הטבלה.
 */
export async function fetchServiceFullDetailsById(serviceid: string): Promise<MapPointInfoField[]> {
  const govmap = window.govmap
  const fields = MAP_POINT_INFO_FIELD_NAMES
  const response = await govmap?.intersectFeatures?.({
    geometry: ISRAEL_EXTENT_POLYGON,
    layerName: SITE.layers.servicesLayer,
    fields,
    whereClause: `serviceid = ${serviceid}`,
  })

  console.log('fetchServiceFullDetailsById response:', response)

  const values = response?.data?.[0]?.Values
  if (!Array.isArray(values)) return []

  return fields
    .map((fieldName, i) => ({ fieldName, fieldValue: values[i] }))
    .filter((field) => field.fieldValue != null && String(field.fieldValue).trim() !== '')
}
