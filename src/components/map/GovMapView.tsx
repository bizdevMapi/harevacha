import { useEffect, useRef, useState } from 'react'
import { useDashboardUi } from '../../context/DashboardUiContext'
import { SITE } from '../../constants'
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
    var params = {
      geometry:`POLYGON ((130000 380000, 285000 380000, 285000 805000, 130000 805000, 130000 380000))`,
      layerName: "22",
      fields: ['fname','setl_name'],
      whereClause: "setl_name IN ('ירושלים', 'טירת כרמל')",

      getShapes: true,
  };
  window.govmap.intersectFeatures(params).then(function (response) {
      console.log(response);
      const neighborhoods = response?.data?.map((item: { Values: [string, string, number, number] }) =>
        ({
          label: `${item.Values[1]} - ${item.Values[0]}`,
          value: {x:item.Values[2],y:item.Values[3]},
        })
      )  
      setNeighborhoodsList(neighborhoods)
    }).catch(function (error) {
      console.error('failed getting neighborhoods', error)
    });
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
    console.log('test')
    const scriptSrc = 'https://govmap.gov.il/govmap/api/govmap.api.js'

    const initMap = () => {
      const govmap = window.govmap
      if (!govmap) return
      govmap.createMap('map-container', {
        token: GOVMAP_TOKEN,
        level: 7,
        // center: { x: 220000, y: 630000 },
        center: { x: 197388.45, y: 741225.93 },
        layersMode: 1,
        identifyOnClick: false,
        layers: [
          SITE.layers.municipalitiesLayer,
          "layer_232641",
          "layer_208094",//stage
          "layer_22"// שכונות

        ],
        visibleLayers: [
          SITE.layers.municipalitiesLayer,
          "layer_232641",
          "layer_208094",//stage
          "layer_22"// שכונות

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
