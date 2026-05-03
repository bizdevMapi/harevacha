import { useEffect, useRef } from 'react'
import { SITE } from '../../constants'

const GOVMAP_TOKEN = import.meta.env.VITE_GOVMAP_TOKEN

const GovMapView = () => {
  const mapRef = useRef<HTMLDivElement | null>(null)

  const registerGovmapEvents = () => {
    console.log('registerGovmapEvents')
    window.govmap.onEvent(window.govmap.events.CLICK).progress((e) => {
      console.log('e', e)
      const params = {
        geometry: `POINT(${e.mapPoint.x} ${e.mapPoint.y})`,
        radius: 1000,
        layers: [
          SITE.layers.municipalitiesLayer
        ]
      }
      window.govmap.getLayerFeaturesByLocation(params, GOVMAP_TOKEN);
  });
  }

  useEffect(() => {
    const scriptSrc = 'https://www.govmap.gov.il/govmap/api/govmap.api.js'

    const initMap = () => {
      if (!window.govmap) return
      window.govmap.createMap('map-container', {
        token: GOVMAP_TOKEN,
        level: 5,
        center: { x: 220000, y: 630000 },
        layersMode: 1,
        identifyOnClick: false,
        layers:[
          SITE.layers.municipalitiesLayer
        ],
        visibleLayers:[
          SITE.layers.municipalitiesLayer
        ],
        onLoad: () => {
          registerGovmapEvents();
        }
      },
    )
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

  return (
    <section className="relative h-full w-full overflow-hidden rounded-md border border-brand-lightBlue bg-brand-bgLight">
      <div ref={mapRef} id="map-container" className="absolute inset-0 h-full w-full" style={{ direction: 'rtl' }} />
    </section>
  )
}

export default GovMapView
