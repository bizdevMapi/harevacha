import { useEffect, useRef, useState } from 'react'
import { useDashboardUi } from '../../context/DashboardUiContext'
import {
  getCityCenterAreaSelectValue,
  GOVMAP_DEFAULT_VIEW_LEVEL,
  JERUSALEM_CITY_CENTER_AREA_OPTION,
  SITE,
  TIRAT_CARMEL_CITY_AREA_OPTION,
} from '../../constants'
import type { NeighborhoodMapOption } from '../../context/DashboardUiContext'
import MapFiltersPanel from './MapFiltersPanel'
import {
  buildFilterSectionsFromServiceList,
  buildFullServicesLayerWhereClause,
  filterServicesBySelectedKeys,
  type FilterSectionData,
} from './mapLayerFilters'
import MapPointInfoCard from './MapPointInfoCard'
import type { MapPointInfo } from './mapPointInfoData'
import MapPointTooltip from './MapPointTooltip'
import MapProfileInsightsCard from './profile-insights/MapProfileInsightsCard'
import {
  mapIntersectFeaturesToServicesList,
  SERVICE_TABLE_LAYER_FIELDS,
} from '../../data/servicesListTypes'

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
  x?: number
  y?: number
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
  risk?: string
  accessibility?: string
}

const GovMapView = () => {
  const {
    servicesQueryGeometry,
    servicesList,
    servicesListLoading,
    setNeighborhoodsList,
    setServicesList,
    setServicesListLoading,
    setMatchedServicesCount,
  } = useDashboardUi()
  const mapRef = useRef<HTMLDivElement | null>(null)
  const isHoverIdentifyInFlightRef = useRef(false)
  const hoverDebounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const pendingHoverPayloadRef = useRef<MapPointerPayload | null>(null)
  const lastHoverIdentifyScreenRef = useRef<{ x: number; y: number } | null>(null)
  const lastHoverIdentifyMapRef = useRef<{ x: number; y: number } | null>(null)
  const hoverPointInfoRef = useRef<HoverPointTooltipInfo | null>(null)
  const areaServiceObjectIdsRef = useRef<number[]>([])
  const [isFiltersOpen, setIsFiltersOpen] = useState(true)
  const [isMapReady, setIsMapReady] = useState(false)
  const [filterSections, setFilterSections] = useState<FilterSectionData[]>([])
  const [selectedPointInfo, setSelectedPointInfo] = useState<MapPointInfo | null>(null)
  const [hoverPointInfo, setHoverPointInfo] = useState<HoverPointTooltipInfo | null>(null)
  const [hoverTooltipPosition, setHoverTooltipPosition] = useState<{ left: number; top: number } | null>(null)

  useEffect(() => {
    hoverPointInfoRef.current = hoverPointInfo
  }, [hoverPointInfo])

  useEffect(() => {
    return () => {
      if (hoverDebounceTimerRef.current) {
        clearTimeout(hoverDebounceTimerRef.current)
      }
    }
  }, [])

  const getNeighborhoods = () => {
    const params = {
      geometry: `POLYGON ((130000 380000, 285000 380000, 285000 805000, 130000 805000, 130000 380000))`,
      layerName: '22',
      fields: ['fname', 'setl_name', 'nbr_code'],
      whereClause: "setl_name IN ( 'טירת כרמל')",
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

      console.log('neighborhoods', { jerusalemNeighborhoods, tiratNeighborhoods })
      setNeighborhoodsList([
        {
          label: JERUSALEM_CITY_CENTER_AREA_OPTION.label,
          value: { ...JERUSALEM_CITY_CENTER_AREA_OPTION.value },
          cityObjectId: '1',
          optionValue: getCityCenterAreaSelectValue(JERUSALEM_CITY_CENTER_AREA_OPTION.value),
          geometry: JERUSALEM_CITY_CENTER_AREA_OPTION.geometry,
        },
        ...jerusalemNeighborhoods,
        {
          label: TIRAT_CARMEL_CITY_AREA_OPTION.label,
          value: { ...TIRAT_CARMEL_CITY_AREA_OPTION.value },
          cityObjectId: '2',
          optionValue: getCityCenterAreaSelectValue(TIRAT_CARMEL_CITY_AREA_OPTION.value),
          geometry: TIRAT_CARMEL_CITY_AREA_OPTION.geometry,
        },
        ...tiratNeighborhoods,
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

    isHoverIdentifyInFlightRef.current = true
    lastHoverIdentifyScreenRef.current = screenPoint
    lastHoverIdentifyMapRef.current = mapPoint

    govmap
      .identifyByXYAndLayer?.(mapPoint.x, mapPoint.y, [SITE.layers.servicesLayer])
      ?.then((response: any) => {
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
        const price =
          paymentAmount && requiresPayment
            ? `${paymentAmount}${requiresPayment === 'כן' ? '' : ` (${requiresPayment})`}`
            : paymentAmount || requiresPayment

        setHoverPointInfo({
          address: cleanValue(getFieldValue('fulladdress')),
          title: cleanValue(getFieldValue('servicename')),
          description: cleanValue(getFieldValue('servicedescription')),
          audiences: cleanValue(getFieldValue('targetpopulations')),
          price,
          provider: cleanValue(getFieldValue('serviceproviderorganizationtype')),
          languages: cleanValue(getFieldValue('language')),
          risk: cleanValue(getFieldValue('riskstatusdescription_agg')),
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
    const clickEvent = govmap.onEvent?.(clickEventType)
    clickEvent?.progress((payload: any) => {
      console.log('map click', payload)

      govmap.identifyByXYAndLayer?.(payload.mapPoint.x, payload.mapPoint.y, [SITE.layers.servicesLayer])
        ?.then((response: any) => {
          console.log('response', response)
          const rawEntity = response?.data?.[0]?.entities?.[0] ?? response?.data?.[0]?.fields ?? null
          console.log('rawEntity', rawEntity)
          //const pointInfo = mapGovmapEntityToPointInfo(rawEntity)
          setSelectedPointInfo(rawEntity.fields)
        })
        ?.catch((error: unknown) => {
          console.error('failed identifying map point', error)
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

  const applyServicesLayerFilter = (selectedKeys: Set<string>) => {
    const filtered = filterServicesBySelectedKeys(servicesList, selectedKeys)
    setMatchedServicesCount(filtered.length)

    const whereClause = buildFullServicesLayerWhereClause(
      areaServiceObjectIdsRef.current,
      selectedKeys,
    )
    window.govmap?.filterLayers?.({
      layerName: SITE.layers.servicesLayer,
      whereClause,
      zoomToExtent: true,
    })
  }

  const fetchServicesList = (geometry: string) => {
    const intersectFeatures = window.govmap?.intersectFeatures
    if (!intersectFeatures || !geometry) return

    const params = {
      geometry,
      layerName: SITE.layers.servicesLayer,
      fields: [...SERVICE_TABLE_LAYER_FIELDS],
    }

    setServicesListLoading(true)
    window.govmap?.intersectFeatures?.(params)
      ?.then(function (response) {
        const rows = mapIntersectFeaturesToServicesList(response?.data, SERVICE_TABLE_LAYER_FIELDS)
        setServicesList(rows)
      })
      .catch(function (error) {
        console.error('failed loading services list', error)
        setServicesList([])
      })
      .finally(function () {
        setServicesListLoading(false)
      })
  }

  useEffect(() => {
    const scriptSrc = import.meta.env.VITE_GOVMAP_URL || 'https://govmap.gov.il/govmap/api/govmap.api.js'

    const initMap = () => {
      const govmap = window.govmap
      if (!govmap) return
      govmap.createMap('map-container', {
        token: GOVMAP_TOKEN,
        level: GOVMAP_DEFAULT_VIEW_LEVEL,
        center: {
          x: JERUSALEM_CITY_CENTER_AREA_OPTION.value.x,
          y: JERUSALEM_CITY_CENTER_AREA_OPTION.value.y
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

    const existingScript = document.querySelector(`script[src="${scriptSrc}"]`)
    if (existingScript) {
      initMap()
      return
    }

    const script = document.createElement('script')
    script.src = scriptSrc
    script.async = true
    script.onload = initMap
    document.body.appendChild(script)
  }, [])

  useEffect(() => {
    if (!isMapReady) return
    fetchServicesList(servicesQueryGeometry)
  }, [isMapReady, servicesQueryGeometry])

  useEffect(() => {
    areaServiceObjectIdsRef.current = servicesList.map((service) => service.objectId)
    setFilterSections(buildFilterSectionsFromServiceList(servicesList))
    setMatchedServicesCount(servicesList.length)
  }, [servicesList, setMatchedServicesCount])

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
          filterSections={filterSections}
          filtersLoading={servicesListLoading}
          onFilterSelectionChange={applyServicesLayerFilter}
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
          <MapPointInfoCard data={selectedPointInfo} onClose={() => setSelectedPointInfo(null)} />
        )}
      </div>
    </section>
  )
}

export default GovMapView
