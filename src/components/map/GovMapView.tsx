import { useEffect, useRef, useState } from 'react'
import { useDashboardUi } from '../../context/DashboardUiContext'
import {
  getCityCenterAreaSelectValue,
  GOVMAP_DEFAULT_VIEW_LEVEL,
  GOVMAP_MUNICIPALITIES_LAYER_ID,
  GOVMAP_NEIGHBORHOOD_CLICK_MIN_LEVEL,
  GOVMAP_NEIGHBORHOODS_LAYER_ID,
  JERUSALEM_CITY_CENTER_AREA_OPTION,
  SITE,
  TIRAT_CARMEL_CITY_AREA_OPTION,
} from '../../constants'
import type { NeighborhoodMapOption } from '../../context/DashboardUiContext'
import { loadGovmapScript } from '../../utils/loadGovmapScript'
import { applySelectedArea } from './applySelectedArea'
import MapFiltersPanel from './MapFiltersPanel'
import {
  buildFilterSectionsFromServiceList,
  buildFullServicesLayerWhereClause,
  filterServicesBySearchQuery,
  filterServicesBySelectedKeys,
  type FilterSectionData,
} from './mapLayerFilters'
import MapPointInfoCard from './MapPointInfoCard'
import MapPointTooltip from './MapPointTooltip'
import MapProfileInsightsCard from './profile-insights/MapProfileInsightsCard'

const GOVMAP_TOKEN = import.meta.env.VITE_GOVMAP_TOKEN
/** המתנה אחרי תזוזת עכבר לפני קריאת identify */
const HOVER_IDENTIFY_DEBOUNCE_MS = 300
/** תזוזה מינימלית בפיקסלים במסך לפני identify חדש */
const HOVER_MIN_SCREEN_MOVE_PX = 12
/** תזוזה מינימלית בקואורדינטות מפה לפני identify חדש */
const HOVER_MIN_MAP_MOVE = 25

type MapPointerPayload = {
  mapPoint?: { x?: number; y?: number }
  screenPoint?: { x?: number; y?: number }
  point?: { x?: number; y?: number }
  x?: number
  y?: number
}

type GovMapExtentChangePayload = {
  levelChange?: boolean
  lod?: { level?: number }
}

const getPayloadScreenPoint = (payload: MapPointerPayload) => {
  const x =
    typeof payload.screenPoint?.x === 'number'
      ? payload.screenPoint.x
      : typeof payload.x === 'number'
        ? payload.x
        : null
  const y =
    typeof payload.screenPoint?.y === 'number'
      ? payload.screenPoint.y
      : typeof payload.y === 'number'
        ? payload.y
        : null
  if (x === null || y === null) return null
  return { x, y }
}

const getPayloadMapPoint = (payload: MapPointerPayload) => {
  const x = payload.mapPoint?.x
  const y = payload.mapPoint?.y
  if (typeof x !== 'number' || typeof y !== 'number') return null
  return { x, y }
}

const distance2d = (a: { x: number; y: number }, b: { x: number; y: number }) =>
  Math.hypot(a.x - b.x, a.y - b.y)

const isSignificantHoverMove = (
  screen: { x: number; y: number } | null,
  map: { x: number; y: number } | null,
  lastScreen: { x: number; y: number } | null,
  lastMap: { x: number; y: number } | null,
) => {
  if (!lastScreen && !lastMap) return true
  if (screen && lastScreen && distance2d(screen, lastScreen) >= HOVER_MIN_SCREEN_MOVE_PX) {
    return true
  }
  if (map && lastMap && distance2d(map, lastMap) >= HOVER_MIN_MAP_MOVE) {
    return true
  }
  return false
}

type HoverPointTooltipInfo = {
  address?: string
  title: string
  description?: string
  audiences?: string
  price?: string
  provider?: string
  languages?: string
  airisktype?: string
  accessibility?: string
}

type IdentifyField = { fieldName?: string; fieldValue?: string | null }

type IdentifyEntity = {
  objectId?: number
  fields?: IdentifyField[]
  geom?: string
  centroid?: number[]
}

type IdentifyLayerResult = {
  name?: string
  layerId?: string
  fieldsMapping?: Record<string, string>
  entities?: IdentifyEntity[]
}

const cleanIdentifyValue = (value: unknown): string => {
  if (value == null) return ''
  const text = String(value).trim()
  if (!text || text.toUpperCase() === 'NULL') return ''
  return text
}

const getEntityFieldByKey = (
  entity: IdentifyEntity,
  fieldsMapping: Record<string, string> | undefined,
  technicalKey: string,
): string => {
  const fields = entity.fields ?? []
  const displayName = fieldsMapping?.[technicalKey]
  if (displayName) {
    const mapped = fields.find((field) => field.fieldName === displayName)
    const value = cleanIdentifyValue(mapped?.fieldValue)
    if (value) return value
  }

  const direct = fields.find(
    (field) => field.fieldName?.toLowerCase() === technicalKey.toLowerCase(),
  )
  return cleanIdentifyValue(direct?.fieldValue)
}

const normalizeNbrCode = (value: string) => {
  if (!value || value.toUpperCase() === 'NULL') return ''
  return value
}

const isNeighborhoodIdentifyLayer = (layer: IdentifyLayerResult) =>
  layer.layerId === GOVMAP_NEIGHBORHOODS_LAYER_ID ||
  layer.name === 'neighborhoods_area' ||
  layer.fieldsMapping?.fname != null

const isMunicipalityIdentifyLayer = (layer: IdentifyLayerResult) =>
  layer.layerId === GOVMAP_MUNICIPALITIES_LAYER_ID ||
  layer.name === 'regional_authorities' ||
  layer.fieldsMapping?.muni_heb != null ||
  layer.fieldsMapping?.setl_name != null

const isServicesIdentifyLayer = (layer: IdentifyLayerResult, servicesLayerName: string) => {
  const servicesLayerId = servicesLayerName.replace(/^layer_/, '')
  return layer.layerId === servicesLayerId || layer.fieldsMapping?.servicename != null
}

const parseGovMapZoomLevel = (response: unknown, fallback = GOVMAP_DEFAULT_VIEW_LEVEL): number => {
  if (typeof response === 'number' && Number.isFinite(response)) return response
  if (response && typeof response === 'object') {
    const lodLevel = (response as { lod?: { level?: number } }).lod?.level
    if (typeof lodLevel === 'number' && Number.isFinite(lodLevel)) return lodLevel
    const level = (response as { level?: number; z?: number }).level
    if (typeof level === 'number' && Number.isFinite(level)) return level
    const z = (response as { z?: number }).z
    if (typeof z === 'number' && Number.isFinite(z)) return z
  }
  return fallback
}

const shouldUseNeighborhoodClick = (zoomLevel: number) =>
  zoomLevel >= GOVMAP_NEIGHBORHOOD_CLICK_MIN_LEVEL

const getAreaIdentifyLayerId = (zoomLevel: number) =>
  shouldUseNeighborhoodClick(zoomLevel)
    ? GOVMAP_NEIGHBORHOODS_LAYER_ID
    : GOVMAP_MUNICIPALITIES_LAYER_ID

const findNeighborhoodOptionFromIdentify = (
  neighborhoods: NeighborhoodMapOption[],
  entity: IdentifyEntity,
  fieldsMapping: Record<string, string> | undefined,
): NeighborhoodMapOption | undefined => {
  const objectId = entity.objectId
  const nbrCode = normalizeNbrCode(getEntityFieldByKey(entity, fieldsMapping, 'nbr_code'))
  const fname = getEntityFieldByKey(entity, fieldsMapping, 'fname')

  return neighborhoods.find((option) => {
    if (objectId != null && option.layerObjectId === objectId) return true
    if (nbrCode && option.nbrCode === nbrCode) return true
    if (fname && option.fname === fname) return true
    return false
  })
}

const findCityCenterOptionBySettlementName = (
  neighborhoods: NeighborhoodMapOption[],
  settlementName: string,
): NeighborhoodMapOption | undefined => {
  const name = settlementName.trim()
  if (!name) return undefined

  return neighborhoods.find(
    (option) => option.cityObjectId != null && option.label.startsWith(`${name} -`),
  )
}

const normalizeServiceFieldsForCard = (
  entity: IdentifyEntity,
  fieldsMapping: Record<string, string> | undefined,
): IdentifyField[] => {
  const serviceKeys = [
    'servicename',
    'fulladdress',
    'servicedescription',
    'targetpopulations',
    'requirespaymentamount',
    'requirespayment',
    'serviceproviderorganizationtype',
    'language',
    'riskstatusdescription_agg',
    'accessibility',
    'providername',
    'gisx',
    'gisy',
  ] as const

  const normalized: IdentifyField[] = []
  for (const key of serviceKeys) {
    const value = getEntityFieldByKey(entity, fieldsMapping, key)
    if (value) normalized.push({ fieldName: key, fieldValue: value })
  }

  for (const field of entity.fields ?? []) {
    const name = field.fieldName?.toLowerCase()
    if (!name || normalized.some((row) => row.fieldName?.toLowerCase() === name)) continue
    const value = cleanIdentifyValue(field.fieldValue)
    if (value) normalized.push({ fieldName: field.fieldName, fieldValue: value })
  }

  return normalized
}

const getClickMapPoint = (payload: MapPointerPayload) => {
  const mapPoint = payload.mapPoint ?? payload.point
  const x =
    typeof mapPoint?.x === 'number'
      ? mapPoint.x
      : typeof payload.x === 'number'
        ? payload.x
        : null
  const y =
    typeof mapPoint?.y === 'number'
      ? mapPoint.y
      : typeof payload.y === 'number'
        ? payload.y
        : null
  if (x === null || y === null) return null
  return { x, y }
}

const GovMapView = () => {
  const {
    viewMode,
    selectedArea,
    setSelectedArea,
    servicesQueryGeometry,
    neighborhoodsList,
    servicesList,
    servicesListLoading,
    setNeighborhoodsList,
    setServicesQueryGeometry,
    setServicesList,
    setServicesListLoading,
    setMatchedServicesCount,
    serviceFilterSearchQuery,
    setServiceFilterSearchQuery,
    appliedServiceFilterSearchQuery,
    selectedServiceFilterKeys,
    setSelectedServiceFilterKeys,
    selectedPointInfo,
    setSelectedPointInfo,
  } = useDashboardUi()
  const mapRef = useRef<HTMLDivElement | null>(null)
  const isHoverIdentifyInFlightRef = useRef(false)
  const hoverDebounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const pendingHoverPayloadRef = useRef<MapPointerPayload | null>(null)
  const lastHoverIdentifyScreenRef = useRef<{ x: number; y: number } | null>(null)
  const lastHoverIdentifyMapRef = useRef<{ x: number; y: number } | null>(null)
  const hoverPointInfoRef = useRef<HoverPointTooltipInfo | null>(null)
  const hoverSessionRef = useRef(0)
  const areaServiceObjectIdsRef = useRef<number[]>([])
  const mapZoomLevelRef = useRef(GOVMAP_DEFAULT_VIEW_LEVEL)
  const neighborhoodsListRef = useRef(neighborhoodsList)
  const selectedAreaRef = useRef(selectedArea)
  const [isFiltersOpen, setIsFiltersOpen] = useState(true)
  const [isMapReady, setIsMapReady] = useState(false)
  const [filterSections, setFilterSections] = useState<FilterSectionData[]>([])
  const [hoverPointInfo, setHoverPointInfo] = useState<HoverPointTooltipInfo | null>(null)
  const [hoverTooltipPosition, setHoverTooltipPosition] = useState<{ left: number; top: number } | null>(null)
  const selectedAreaOption = neighborhoodsList.find((n) => n.optionValue === selectedArea)
  const applyAreaSelection = (option: NeighborhoodMapOption) => {
    if (option.optionValue === selectedAreaRef.current) {
      return
    }
    setSelectedArea(option.optionValue)
  }
  const handleExpandPointMap = (center: { x: number; y: number } | null) => {
    const target = center ?? selectedAreaOption?.value ?? null
    if (!target) return
    window.govmap?.zoomToXY?.({
      x: target.x,
      y: target.y,
      level: 12,
      marker: true,
    })
    setSelectedPointInfo(null)
  }

  useEffect(() => {
    hoverPointInfoRef.current = hoverPointInfo
  }, [hoverPointInfo])

  useEffect(() => {
    neighborhoodsListRef.current = neighborhoodsList
  }, [neighborhoodsList])

  useEffect(() => {
    selectedAreaRef.current = selectedArea
  }, [selectedArea])

  useEffect(() => {
    return () => {
      if (hoverDebounceTimerRef.current) {
        clearTimeout(hoverDebounceTimerRef.current)
      }
    }
  }, [])

  const clearHoverTooltip = () => {
    hoverSessionRef.current += 1
    if (hoverDebounceTimerRef.current) {
      clearTimeout(hoverDebounceTimerRef.current)
      hoverDebounceTimerRef.current = null
    }
    pendingHoverPayloadRef.current = null
    lastHoverIdentifyScreenRef.current = null
    lastHoverIdentifyMapRef.current = null
    hoverPointInfoRef.current = null
    setHoverPointInfo(null)
    setHoverTooltipPosition(null)
  }

  const getNeighborhoods = () => {
    const params = {
      geometry: `POLYGON ((130000 380000, 285000 380000, 285000 805000, 130000 805000, 130000 380000))`,
      layerName: '22',
      fields: ['fname', 'setl_name', 'nbr_code'],
      whereClause: "setl_name IN ( 'טירת כרמל', 'ירושלים')",
      getShapes: true,
    }
    window.govmap?.intersectFeatures?.(params)?.then(function (response: {
      data?: Array<{ ObjectId?: number; Values?: unknown[] }>
    }) {
      type NeighborhoodRow = {
        id: number
        fname: string
        setlName: string
        nbrCode: string
        x: number
        y: number
        geometry?: string
      }
      const normalizeNbrCode = (value: unknown): string => {
        const text = String(value ?? '').trim()
        if (!text || text.toUpperCase() === 'NULL') return ''
        return text
      }

      const raw: NeighborhoodRow[] = []
      for (const item of response?.data ?? []) {
        const id = item.ObjectId
        const vals = item.Values
        const fname = String(vals?.[0] ?? '')
        const setlName = String(vals?.[1] ?? '')
        const nbrCode = normalizeNbrCode(vals?.[2])
        const x = typeof vals?.[3] === 'number' ? vals[3] : Number.NaN
        const y = typeof vals?.[4] === 'number' ? vals[4] : Number.NaN
        const geometry = typeof vals?.[5] === 'string' ? vals[5] : undefined
        if (id == null || !Number.isFinite(x) || !Number.isFinite(y)) continue
        raw.push({ id, fname, setlName, nbrCode, x, y, geometry })
      }

      const neighborhoodGroupKey = (row: NeighborhoodRow): string => {
        if (row.nbrCode) return row.nbrCode
        return `name:${row.setlName}\u0000${row.fname}`
      }

      const groupByNbrCode = (rows: NeighborhoodRow[]): NeighborhoodRow[] => {
        const byKey = new Map<string, NeighborhoodRow>()
        for (const row of rows) {
          const key = neighborhoodGroupKey(row)
          const existing = byKey.get(key)
          if (!existing || (!existing.geometry && row.geometry)) {
            byKey.set(key, row)
          }
        }
        return [...byKey.values()]
      }

      const toOption = (n: NeighborhoodRow): NeighborhoodMapOption => {
        return {
          label: `${n.setlName} - ${n.fname}`,
          value: { x: n.x, y: n.y },
          geometry: n.geometry,
          optionValue: String(n.id),
          layerObjectId: n.id,
          nbrCode: n.nbrCode || undefined,
          fname: n.fname,
        }
      }

      const byFname = (a: NeighborhoodRow, b: NeighborhoodRow) =>
        a.fname.localeCompare(b.fname, 'he')

      const jerusalemRows = groupByNbrCode(raw.filter((r) => r.setlName === 'ירושלים')).sort(
        byFname,
      )
      const tiratRows = groupByNbrCode(raw.filter((r) => r.setlName === 'טירת כרמל')).sort(
        byFname,
      )

      const jerusalemNeighborhoods = jerusalemRows.map(toOption)
      const tiratNeighborhoods = tiratRows.map(toOption)

      setNeighborhoodsList([
        
        {
          label: TIRAT_CARMEL_CITY_AREA_OPTION.label,
          value: { ...TIRAT_CARMEL_CITY_AREA_OPTION.value },
          cityObjectId: '2',
          optionValue: getCityCenterAreaSelectValue(TIRAT_CARMEL_CITY_AREA_OPTION.value),
          geometry: TIRAT_CARMEL_CITY_AREA_OPTION.geometry,
        },
        ...tiratNeighborhoods,
        {
          label: JERUSALEM_CITY_CENTER_AREA_OPTION.label,
          value: { ...JERUSALEM_CITY_CENTER_AREA_OPTION.value },
          cityObjectId: '1',
          optionValue: getCityCenterAreaSelectValue(JERUSALEM_CITY_CENTER_AREA_OPTION.value),
          geometry: JERUSALEM_CITY_CENTER_AREA_OPTION.geometry,
        },
        ...jerusalemNeighborhoods
      ])
    }).catch(function (error) {
      console.error('failed getting neighborhoods', error)
    })
  }

  const runHoverIdentify = (payload: MapPointerPayload) => {
    const govmap = window.govmap
    const mapPoint = getPayloadMapPoint(payload)
    const screenPoint = getPayloadScreenPoint(payload)
    if (!govmap || !mapPoint) return

    const hoverSession = hoverSessionRef.current
    isHoverIdentifyInFlightRef.current = true
    lastHoverIdentifyScreenRef.current = screenPoint
    lastHoverIdentifyMapRef.current = mapPoint

    govmap
      .identifyByXYAndLayer?.(mapPoint.x, mapPoint.y, [SITE.layers.servicesLayer])
      ?.then((response: any) => {
        if (hoverSession !== hoverSessionRef.current) return

        const rawEntity = response?.data?.[0]?.entities?.[0] ?? response?.data?.[0]?.fields ?? null
        if (!rawEntity || typeof rawEntity !== 'object') {
          lastHoverIdentifyScreenRef.current = null
          lastHoverIdentifyMapRef.current = null
          setHoverPointInfo(null)
          setHoverTooltipPosition(null)
          return
        }

        if (screenPoint) {
          setHoverTooltipPosition({ left: screenPoint.x, top: screenPoint.y })
        }

        const fields = Array.isArray(rawEntity.fields) ? rawEntity.fields : []
        const getFieldValue = (fieldName: string) =>
          String(
            fields.find((f: { fieldName?: string; fieldValue?: string }) => f?.fieldName === fieldName)
              ?.fieldValue ?? '',
          )
        const cleanValue = (value: string) => {
          const normalized = value.trim()
          if (!normalized || normalized.toLowerCase() === 'null') return ''
          return normalized
        }
        const paymentAmount = cleanValue(getFieldValue('requirespaymentamount'))
        const requiresPayment = cleanValue(getFieldValue('requirespayment'))
       

        setHoverPointInfo({
          address: cleanValue(getFieldValue('fulladdress')),
          title: cleanValue(getFieldValue('servicename')),
          description: cleanValue(getFieldValue('servicedescription')),
          audiences: cleanValue(getFieldValue('targetpopulations')),
          price: getFieldValue('requirespayment'),
          provider: cleanValue(getFieldValue('serviceproviderorganizationtype')),
          languages: cleanValue(getFieldValue('language')),
          airisktype: cleanValue(getFieldValue('airisktype')),
          accessibility: cleanValue(getFieldValue('accessibility')),
        })
      })
      ?.catch((error: unknown) => {
        console.error('failed identifying map point on hover', error)
      })
      ?.finally(() => {
        isHoverIdentifyInFlightRef.current = false
      })
  }

  const scheduleHoverIdentify = (payload: MapPointerPayload) => {
    const screenPoint = getPayloadScreenPoint(payload)
    const mapPoint = getPayloadMapPoint(payload)

    if (
      screenPoint &&
      hoverPointInfoRef.current &&
      !isSignificantHoverMove(
        screenPoint,
        mapPoint,
        lastHoverIdentifyScreenRef.current,
        lastHoverIdentifyMapRef.current,
      )
    ) {
      setHoverTooltipPosition({ left: screenPoint.x, top: screenPoint.y })
      return
    }

    if (
      !isSignificantHoverMove(
        screenPoint,
        mapPoint,
        lastHoverIdentifyScreenRef.current,
        lastHoverIdentifyMapRef.current,
      )
    ) {
      return
    }

    pendingHoverPayloadRef.current = payload
    if (hoverDebounceTimerRef.current) {
      clearTimeout(hoverDebounceTimerRef.current)
    }

    hoverDebounceTimerRef.current = setTimeout(() => {
      hoverDebounceTimerRef.current = null
      if (isHoverIdentifyInFlightRef.current) return

      const pending = pendingHoverPayloadRef.current
      if (!pending) return

      const pendingScreen = getPayloadScreenPoint(pending)
      const pendingMap = getPayloadMapPoint(pending)
      if (
        !isSignificantHoverMove(
          pendingScreen,
          pendingMap,
          lastHoverIdentifyScreenRef.current,
          lastHoverIdentifyMapRef.current,
        )
      ) {
        return
      }

      runHoverIdentify(pending)
    }, HOVER_IDENTIFY_DEBOUNCE_MS)
  }

  const registerMapInteractionEvents = () => {
    const govmap = window.govmap
    const clickEventType = govmap?.events?.CLICK
    if (!govmap || clickEventType === undefined) return

    const syncZoomLevelFromMap = () => {
      void Promise.resolve(govmap.getZoomLevel?.())
        .then((zoomResponse) => parseGovMapZoomLevel(zoomResponse))
        .then((zoomLevel) => {
          mapZoomLevelRef.current = zoomLevel
        })
        .catch(() => {
          mapZoomLevelRef.current = GOVMAP_DEFAULT_VIEW_LEVEL
        })
    }

    syncZoomLevelFromMap()

    const extentChangeEventType = govmap.events?.EXTENT_CHANGE
    if (extentChangeEventType !== undefined) {
      const extentChangeEvent = govmap.onEvent?.(extentChangeEventType)
      extentChangeEvent?.progress((payload: GovMapExtentChangePayload) => {
        if (!payload.levelChange) return
        mapZoomLevelRef.current = parseGovMapZoomLevel(payload)
      })
    }

    const clickEvent = govmap.onEvent?.(clickEventType)
    clickEvent?.progress((payload: MapPointerPayload) => {
      clearHoverTooltip()

      const mapPoint = getClickMapPoint(payload)
      if (!mapPoint) return

      const zoomLevel = mapZoomLevelRef.current
      const areaLayerId = getAreaIdentifyLayerId(zoomLevel)
      const useNeighborhoodClick = shouldUseNeighborhoodClick(zoomLevel)

      void govmap
        .identifyByXYAndLayer?.(mapPoint.x, mapPoint.y, [
          areaLayerId,
          SITE.layers.servicesLayer,
        ])
        ?.then((response: any) => ({ response, useNeighborhoodClick }))
        ?.then((result) => {
          if (!result) return

          const { response, useNeighborhoodClick } = result
          let serviceFields: IdentifyField[] | null = null

          // First, check if there's a service at this location
          for (const layerResult of response?.data ?? []) {
            const layer = layerResult as IdentifyLayerResult
            const entity = layer.entities?.[0]
            if (!entity) continue

            if (isServicesIdentifyLayer(layer, SITE.layers.servicesLayer)) {
              const serviceName = getEntityFieldByKey(entity, layer.fieldsMapping, 'servicename')
              if (serviceName) {
                serviceFields = normalizeServiceFieldsForCard(entity, layer.fieldsMapping)
                break // Found service, stop looking
              }
            }
          }

          // If we found a service, show its card and don't select area
          if (serviceFields) {
            setSelectedPointInfo(serviceFields)
            return
          }

          // No service found, proceed with area selection
          for (const layerResult of response?.data ?? []) {
            const layer = layerResult as IdentifyLayerResult
            const entity = layer.entities?.[0]
            if (!entity) continue

            if (!useNeighborhoodClick && isMunicipalityIdentifyLayer(layer)) {
              const settlementName =
                getEntityFieldByKey(entity, layer.fieldsMapping, 'muni_heb') ||
                getEntityFieldByKey(entity, layer.fieldsMapping, 'setl_name') ||
                getEntityFieldByKey(entity, layer.fieldsMapping, 'name')
              const selectedOption = findCityCenterOptionBySettlementName(
                neighborhoodsListRef.current,
                settlementName,
              )
              if (selectedOption) {
                const centroid = entity.centroid
                const center =
                  Array.isArray(centroid) &&
                  centroid.length >= 2 &&
                  Number.isFinite(centroid[0]) &&
                  Number.isFinite(centroid[1])
                    ? { x: centroid[0], y: centroid[1] }
                    : selectedOption.value

                const optionToApply: NeighborhoodMapOption = {
                  ...selectedOption,
                  // Keep the predefined city geometry for service queries.
                  // Municipality identify geometry can be too broad/incompatible for intersectFeatures.
                  value: center,
                  municipalityObjectId: entity.objectId,
                }
                setNeighborhoodsList((prev) =>
                  prev.map((opt) =>
                    opt.optionValue === selectedOption.optionValue
                      ? {
                          ...opt,
                          value: center,
                          municipalityObjectId: entity.objectId,
                        }
                      : opt,
                  ),
                )
                applyAreaSelection(optionToApply)
              }
              return
            }

            if (useNeighborhoodClick && isNeighborhoodIdentifyLayer(layer)) {
              const selectedOption = findNeighborhoodOptionFromIdentify(
                neighborhoodsListRef.current,
                entity,
                layer.fieldsMapping,
              )
              if (selectedOption) {
                applyAreaSelection(selectedOption)
              }
              return
            }
          }
        })
        ?.catch((error: unknown) => {
          console.error('failed identifying map click', error)
          setSelectedPointInfo(null)
        })
    })

    const hoverEventType = govmap.events?.MOUSE_MOVE
    if (hoverEventType !== undefined) {
      const hoverEvent = govmap.onEvent?.(hoverEventType)
      hoverEvent?.progress((payload: MapPointerPayload) => {
        scheduleHoverIdentify(payload)
      })
    }
  }

  const applyServicesLayerFilter = (selectedKeys: Set<string>, searchQuery: string) => {
    const filteredByKeys = filterServicesBySelectedKeys(servicesList, selectedKeys)
    const filtered = filterServicesBySearchQuery(filteredByKeys, searchQuery)
    setMatchedServicesCount(filtered.length)

    const whereClause = buildFullServicesLayerWhereClause(
      areaServiceObjectIdsRef.current,
      selectedKeys,
      searchQuery,
    )
    // window.govmap?.filterLayers?.({
    //   layerName: SITE.layers.servicesLayer,
    //   whereClause,
    //   zoomToExtent: false,
    // })
  }

  useEffect(() => {
    const initMap = () => {
      console.log('initMap')
      const govmap = window.govmap
      if (!govmap) return
      govmap.createMap('map-container', {
        token: GOVMAP_TOKEN,
        level: GOVMAP_DEFAULT_VIEW_LEVEL,
        center: {
          x: TIRAT_CARMEL_CITY_AREA_OPTION.value.x,
          y: TIRAT_CARMEL_CITY_AREA_OPTION.value.y
        },
        layersMode: 1,
        identifyOnClick: false,
        layers: [
          SITE.layers.municipalitiesLayer,
          SITE.layers.neighborhoodsLayer,
          SITE.layers.servicesLayer,
        ],
        visibleLayers: [
          SITE.layers.municipalitiesLayer,
          SITE.layers.neighborhoodsLayer,
          SITE.layers.servicesLayer
        ],
        onLoad: () => {
          registerMapInteractionEvents()
          getNeighborhoods()
          setIsMapReady(true)
        }

      })
    }

    void loadGovmapScript().then(initMap)
  }, [])

  useEffect(() => {
    if (!isMapReady || !selectedArea) return

    const option = neighborhoodsList.find((n) => n.optionValue === selectedArea)
    if (!option?.geometry) return

    let active = true
    void applySelectedArea(option, {
      setServicesQueryGeometry,
      setServicesListLoading,
      setServicesList: (rows) => {
        if (active) setServicesList(rows)
      },
    })

    return () => {
      active = false
    }
  }, [
    isMapReady,
    selectedArea,
    neighborhoodsList,
    setServicesQueryGeometry,
    setServicesList,
    setServicesListLoading,
  ])

  useEffect(() => {
    setSelectedServiceFilterKeys((prev) => (prev.size === 0 ? prev : new Set()))
    setServiceFilterSearchQuery((prev) => (prev === '' ? prev : ''))
  }, [servicesQueryGeometry])

  useEffect(() => {
    if (viewMode !== 'map') return
    if (servicesListLoading) return
    areaServiceObjectIdsRef.current = servicesList.map((service) => service.objectId)
    const relevantServices = filterServicesBySearchQuery(servicesList, appliedServiceFilterSearchQuery)
    setFilterSections(buildFilterSectionsFromServiceList(relevantServices))
    applyServicesLayerFilter(selectedServiceFilterKeys, appliedServiceFilterSearchQuery)
  }, [
    viewMode,
    servicesList,
    servicesListLoading,
    selectedServiceFilterKeys,
    appliedServiceFilterSearchQuery,
    setMatchedServicesCount,
  ])

  useEffect(() => {
    const resizeTimer = window.setTimeout(() => {
      window.dispatchEvent(new Event('resize'))
    }, 120)

    return () => window.clearTimeout(resizeTimer)
  }, [isFiltersOpen])


  return (
    <section className="h-full w-full overflow-hidden rounded-md border border-brand-lightBlue bg-brand-bgLight">
      <div className="relative flex h-full w-full">
        <MapFiltersPanel
          key={servicesQueryGeometry}
          isOpen={isFiltersOpen}
          onToggle={() => setIsFiltersOpen((prev) => !prev)}
          searchQuery={serviceFilterSearchQuery}
          onSearchQueryChange={setServiceFilterSearchQuery}
          filterSections={filterSections}
          filtersLoading={servicesListLoading}
          selectedKeys={selectedServiceFilterKeys}
          onFilterSelectionChange={setSelectedServiceFilterKeys}
        />

        <div className="relative min-w-0 flex-1">
          <div ref={mapRef} id="map-container" className="h-full w-full" style={{ direction: 'rtl' }} />
          {hoverPointInfo && hoverTooltipPosition && (
            <MapPointTooltip
              data={hoverPointInfo}
              position={hoverTooltipPosition}
            />
          )}
          <MapProfileInsightsCard />
        </div>
        {selectedPointInfo && (
          <MapPointInfoCard
            data={selectedPointInfo}
            onClose={() => setSelectedPointInfo(null)}
            selectedAreaCenter={selectedAreaOption?.value ?? null}
            onExpandMap={handleExpandPointMap}
          />
        )}
      </div>
    </section>
  )
}

export default GovMapView
