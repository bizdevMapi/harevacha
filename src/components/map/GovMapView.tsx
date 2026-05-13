import { useEffect, useRef, useState } from 'react'
import { useDashboardUi } from '../../context/DashboardUiContext'
import {
  getCityCenterAreaSelectValue,
  GOVMAP_DEFAULT_VIEW_LEVEL,
  JERUSALEM_CITY_CENTER_AREA_OPTION,
  TIRAT_CARMEL_CITY_CENTER_AREA_OPTION,
  SITE,
} from '../../constants'
import type { NeighborhoodMapOption } from '../../context/DashboardUiContext'
import MapFiltersPanel from './MapFiltersPanel'
import MapPointInfoCard from './MapPointInfoCard'
import MapPointTooltip from './MapPointTooltip'
import MapProfileInsightsCard from './profile-insights/MapProfileInsightsCard'

const GOVMAP_TOKEN = import.meta.env.VITE_GOVMAP_TOKEN
const AREA_POINTS: Record<string, Array<{ x: number; y: number }>> = {
  'jerusalem-all': [
    { x: 220000, y: 630000 },
    { x: 216500, y: 632500 },
    { x: 224000, y: 626500 },
  ],
  'jerusalem-center': [
    { x: 220350, y: 631150 },
    { x: 219800, y: 630600 },
    { x: 221050, y: 630250 },
  ],
  'jerusalem-south': [
    { x: 221200, y: 626300 },
    { x: 220100, y: 625600 },
    { x: 222150, y: 627050 },
  ],
}

const GovMapView = () => {
  const { selectedArea, setNeighborhoodsList } = useDashboardUi()
  const mapRef = useRef<HTMLDivElement | null>(null)
  const lastHoverIdentifyAtRef = useRef(0)
  const isHoverIdentifyInFlightRef = useRef(false)
  const [isFiltersOpen, setIsFiltersOpen] = useState(true)
  const [isMapReady, setIsMapReady] = useState(false)
  const [selectedPointInfo, setSelectedPointInfo] = useState<Record<string, unknown> | null>(null)
  const [hoverPointInfo, setHoverPointInfo] = useState<{ title: string; subtitle?: string } | null>(null)
  const [hoverTooltipPosition, setHoverTooltipPosition] = useState<{ left: number; top: number } | null>(null)

  const fetchFeaturesByArea = (areaKey: string) => {
    console.log('fetching features by area', areaKey)
    const govmap = window.govmap
    const getLayerFeaturesByLocation = govmap?.getLayerFeaturesByLocation
    if (!govmap || typeof getLayerFeaturesByLocation !== 'function') return

    const points = AREA_POINTS[areaKey] ?? AREA_POINTS['jerusalem-all']
    const requests = points.map((point) =>
      getLayerFeaturesByLocation.call(
        govmap,
        {
          geometry: `POINT(${point.x} ${point.y})`,
          radius: 3000,
          layers: [
            {
              // name: 'layer_232641',
              name: '22',
              fields: ['fname'],
              //fields: ['servicenam', 'serviceid'],
            },
          ],
        },
        GOVMAP_TOKEN,
      ),
    )

    Promise.all(requests)
      .then((results) => {
        console.log('features by selected area', areaKey, results)
      })
      .catch((error) => {
        console.error('failed fetching features by area', areaKey, error)
      })
  }

  const getNeighborhoods = () => {
    const params = {
      geometry: `POLYGON ((130000 380000, 285000 380000, 285000 805000, 130000 805000, 130000 380000))`,
      layerName: '22',
      fields: ['fname', 'setl_name'],
      whereClause: "setl_name IN ('ירושלים', 'טירת כרמל')",
      getShapes: true,
    }
    window.govmap?.intersectFeatures?.(params)?.then(function (response: {
      data?: Array<{ ObjectId?: number; Values?: unknown[] }>
    }) {
      const raw =
        response?.data
          ?.map((item) => {
            const id = item.ObjectId
            const vals = item.Values
            const fname = String(vals?.[0] ?? '')
            const setlName = String(vals?.[1] ?? '')
            const x = typeof vals?.[2] === 'number' ? vals[2] : Number.NaN
            const y = typeof vals?.[3] === 'number' ? vals[3] : Number.NaN
            const geometry = typeof vals?.[4] === 'string' ? vals[4] : undefined
            if (id == null || !Number.isFinite(x) || !Number.isFinite(y)) return null
            return { id, fname, setlName, x, y, geometry }
          })
          .filter((n): n is NonNullable<typeof n> => n != null) ?? []

      const toOption = (n: (typeof raw)[number]): NeighborhoodMapOption => ({
        label: `${n.setlName} - ${n.fname}`,
        value: { x: n.x, y: n.y },
        geometry: n.geometry,
        optionValue: String(n.id),
        layerObjectId: n.id,
      })

      const byFname = (a: (typeof raw)[number], b: (typeof raw)[number]) =>
        a.fname.localeCompare(b.fname, 'he')

      const jerusalemRows = raw.filter((r) => r.setlName === 'ירושלים').sort(byFname)
      const tiratRows = raw.filter((r) => r.setlName === 'טירת כרמל').sort(byFname)

      const jerusalemNeighborhoods = jerusalemRows.map(toOption)
      const tiratNeighborhoods = tiratRows.map(toOption)

      console.log('neighborhoods', { jerusalemNeighborhoods, tiratNeighborhoods })
      setNeighborhoodsList([
        {
          label: JERUSALEM_CITY_CENTER_AREA_OPTION.label,
          value: { ...JERUSALEM_CITY_CENTER_AREA_OPTION.value },
          optionValue: getCityCenterAreaSelectValue(JERUSALEM_CITY_CENTER_AREA_OPTION.value),
        },
        ...jerusalemNeighborhoods,
        {
          label: TIRAT_CARMEL_CITY_CENTER_AREA_OPTION.label,
          value: { ...TIRAT_CARMEL_CITY_CENTER_AREA_OPTION.value },
          optionValue: getCityCenterAreaSelectValue(TIRAT_CARMEL_CITY_CENTER_AREA_OPTION.value),
        },
        ...tiratNeighborhoods,
      ])
    }).catch(function (error) {
      console.error('failed getting neighborhoods', error)
    })
  }

  const registerMapInteractionEvents = () => {
    const HOVER_IDENTIFY_THROTTLE_MS = 250
    const govmap = window.govmap
    const clickEventType = govmap?.events?.CLICK
    if (!govmap || clickEventType === undefined) return
    govmap.onEvent?.(clickEventType).progress((payload: any) => {
      console.log('map click', payload)

      govmap.identifyByXYAndLayer(payload.mapPoint.x, payload.mapPoint.y, ['layer_232641', 'layer_208094'])
        .then((response: any) => {
          console.log('response', response)
          const rawEntity = response?.data?.[0]?.entities?.[0] ?? response?.data?.[0]?.fields ?? null
          console.log('rawEntity', rawEntity)
          if (!rawEntity || typeof rawEntity !== 'object') {
            setSelectedPointInfo(null)
            return
          }
          setSelectedPointInfo({
            title: rawEntity.fields?.find((field: any) => field.name === 'servicenam')?.fieldValue,
            subtitle: rawEntity.fields?.find((field: any) => field.name === 'serviceid')?.value,
            description: rawEntity.fields?.find((field: any) => field.name === 'address')?.value,
            details: rawEntity.fields?.filter((field: any) => field.name !== 'servicenam' && field.name !== 'serviceid' && field.name !== 'address').map((field: any) => ({ label: field.name, value: field.value })),
          })
        })
    })

    // const hoverEventType = govmap.events?.MOUSE_MOVE
    // if (hoverEventType !== undefined) {
    //   govmap.onEvent?.(hoverEventType).progress((payload: any) => {
    //     const now = Date.now()
    //     if (now - lastHoverIdentifyAtRef.current < HOVER_IDENTIFY_THROTTLE_MS) return
    //     if (isHoverIdentifyInFlightRef.current) return

    //     lastHoverIdentifyAtRef.current = now
    //     isHoverIdentifyInFlightRef.current = true

    //     console.log('map point hover', payload)
    //     govmap
    //       .identifyByXYAndLayer(payload.mapPoint.x, payload.mapPoint.y, ['layer_232641'])
    //       .then((response: any) => {
    //         console.log('response', response)
    //         const rawEntity = response?.data?.[0]?.entities?.[0] ?? response?.data?.[0]?.fields ?? null
    //         console.log('rawEntity', rawEntity)
    //         if (!rawEntity || typeof rawEntity !== 'object') {
    //           setHoverPointInfo(null)
    //           setHoverTooltipPosition(null)
    //           return
    //         }
    //         const left =
    //           typeof payload?.screenPoint?.x === 'number'
    //             ? payload.screenPoint.x
    //             : typeof payload?.x === 'number'
    //               ? payload.x
    //               : null
    //         const top =
    //           typeof payload?.screenPoint?.y === 'number'
    //             ? payload.screenPoint.y
    //             : typeof payload?.y === 'number'
    //               ? payload.y
    //               : null

    //         if (left !== null && top !== null) {
    //           setHoverTooltipPosition({ left, top })
    //         }

    //         setHoverPointInfo({
    //           title: rawEntity?.servicenam ?? 'מענה ללא שם',
    //           subtitle: rawEntity?.serviceid,
    //         })
    //       })
    //       .finally(() => {
    //         isHoverIdentifyInFlightRef.current = false
    //       })
    //   })
    // }
  }

  console.log('selectedPointInfo', selectedPointInfo)

  const getLayerFilters = () => {
    console.log('getting layer filters')
    window.govmap?.getLayerFilterFields("layer_208094", GOVMAP_TOKEN).then((response: any) => {
      console.log('response', response)
    })
  }

  useEffect(() => {
    const scriptSrc = 'https://govmap.gov.il/govmap/api/govmap.api.js'

    const initMap = () => {
      const govmap = window.govmap
      if (!govmap) return
      govmap.createMap('map-container', {
        token: GOVMAP_TOKEN,
        level: GOVMAP_DEFAULT_VIEW_LEVEL,
        center: { 
           x: JERUSALEM_CITY_CENTER_AREA_OPTION.value.x,
           y: JERUSALEM_CITY_CENTER_AREA_OPTION.value.y },
        layersMode: 1,
        identifyOnClick: false,
        layers: [
          SITE.layers.municipalitiesLayer,
          SITE.layers.neighborhoodsLayer,
          SITE.layers.servicesLayer,
          "layer_208094",//stage

        ],
        visibleLayers: [
          SITE.layers.municipalitiesLayer,
          SITE.layers.neighborhoodsLayer,
          SITE.layers.servicesLayer,
          "layer_208094",//stage

        ],
        onLoad: () => {
          registerMapInteractionEvents()
          fetchFeaturesByArea(selectedArea)
          // getLayerFilters()
          getNeighborhoods()
          //setIsMapReady(true)
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
    fetchFeaturesByArea(selectedArea)
  }, [isMapReady, selectedArea])

  useEffect(() => {
    const resizeTimer = window.setTimeout(() => {
      window.dispatchEvent(new Event('resize'))
    }, 120)

    return () => window.clearTimeout(resizeTimer)
  }, [isFiltersOpen])

  return (
    <section className="h-full w-full overflow-hidden rounded-md border border-brand-lightBlue bg-brand-bgLight">
      <div className="relative flex h-full w-full">
        <MapFiltersPanel isOpen={isFiltersOpen} onToggle={() => setIsFiltersOpen((prev) => !prev)} />

        <div className="relative min-w-0 flex-1">
          <div ref={mapRef} id="map-container" className="h-full w-full" style={{ direction: 'rtl' }} />
          {hoverPointInfo && hoverTooltipPosition && (
            <MapPointTooltip
              title={hoverPointInfo.title}
              subtitle={hoverPointInfo.subtitle}
              position={hoverTooltipPosition}
            />
          )}
          <MapProfileInsightsCard />
        </div>
        {selectedPointInfo && (
          <MapPointInfoCard
            title={selectedPointInfo.title as string}
            subtitle={selectedPointInfo.subtitle as string}
            description={selectedPointInfo.description as string}
            details={selectedPointInfo.details as Array<{ label: string; value: string }>}
            onClose={() => {
              setSelectedPointInfo(null)
            }}
          />
        )}
      </div>
    </section>
  )
}

export default GovMapView
