import {
  GOVMAP_DEFAULT_VIEW_LEVEL,
  GOVMAP_MUNICIPALITIES_LAYER_ID,
  SITE,
} from '../../constants'
import type { NeighborhoodMapOption } from '../../context/DashboardUiContext'
import type { ServiceListItem } from '../../data/servicesListTypes'
import {
  mapIntersectFeaturesToServicesList,
  SERVICE_TABLE_LAYER_FIELDS,
} from '../../data/servicesListTypes'

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
      // For MULTIPOLYGON, extract all coordinate pairs from all polygons
      // For POLYGON, extract coordinate pairs from the single polygon
      const coordsRegex = /\(\(([^)]+)\)\)/g
      let minX = Infinity
      let minY = Infinity
      let maxX = -Infinity
      let maxY = -Infinity
      let foundCoords = false

      let match
      while ((match = coordsRegex.exec(geometry)) !== null) {
        const coordPairs = match[1].split(',').map(pair => {
          const parts = pair.trim().split(/\s+/).map(Number)
          return { x: parts[0], y: parts[1] }
        })

        for (const point of coordPairs) {
          if (isNaN(point.x) || isNaN(point.y)) continue
          foundCoords = true
          if (point.x < minX) minX = point.x
          if (point.y < minY) minY = point.y
          if (point.x > maxX) maxX = point.x
          if (point.y > maxY) maxY = point.y
        }
      }

      if (!foundCoords) return null

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

export async function applySelectedArea(
  option: NeighborhoodMapOption,
  callbacks: ApplySelectedAreaCallbacks,
  pageToken?: string,
): Promise<void> {
  const govmap = window.govmap
  const geometry = option.geometry
  if (!govmap || !geometry) return

  callbacks.setServicesQueryGeometry(geometry)

    if (option.layerObjectId != null) {
      govmap.searchInLayer?.({
        layerName: NEIGHBORHOODS_LAYER_NAME,
        fieldName: 'objectid',
        fieldValues: [String(option.layerObjectId)],
        highlight: false,
      })
    } else if (option.municipalityObjectId != null) {
      govmap.searchInLayer?.({
        layerName: GOVMAP_MUNICIPALITIES_LAYER_ID,
        fieldName: 'objectid',
        fieldValues: [String(option.municipalityObjectId)],
        highlight: false,
      })
    } else {
      govmap.zoomToXY?.({
        x: option.value.x,
        y: option.value.y,
        level: GOVMAP_DEFAULT_VIEW_LEVEL,
        marker: false,
      })
    }


  const bbox = parseBboxFromGeometry(geometry)
  if (!bbox) {
    console.error('Failed to parse bbox from geometry')
    callbacks.setServicesList([])
    callbacks.setServicesListLoading(false)
    return
  }

  callbacks.setServicesListLoading(true)

  let allRows: ServiceListItem[] = []
  let currentPageToken: string | undefined = pageToken
  let totalRecords = 0

  try {
    do {
      const response = await govmap.aggregate?.({
        apiKey: GOVMAP_TOKEN,
        source: {
          layer: SITE.layers.servicesLayer,
          srid: govmap.aggSrid?.Itm
        },
        operation: {
          type: 'table',
          fields: [...SERVICE_TABLE_LAYER_FIELDS],
        },
        output: {
          limit: PAGE_SIZE,
          page_token: currentPageToken,
        },
        filter: {
          view_mode: "extent",
          bbox: bbox
        }
      })

      console.log('aggregate response:', response)

      const rows = mapIntersectFeaturesToServicesList(
        response?.data,
        SERVICE_TABLE_LAYER_FIELDS,
      )

      allRows = [...allRows, ...rows]

      const metadata = (response as any)?.metadata
      totalRecords = metadata?.total_records_found ?? 0
      const offsetEnd = response?.metadata?.offset_end
      const nextToken = response?.paging?.next_page_token
      const hasMore = response?.paging?.has_more ?? false


      if (!hasMore || !nextToken) {
        break
      }

      currentPageToken = nextToken
    } while (allRows.length < totalRecords)

    callbacks.setServicesList(allRows)

  } catch (error) {
    console.error('failed applying selected area', error)
    callbacks.setServicesList([])
  } finally {
    callbacks.setServicesListLoading(false)
  }
}
