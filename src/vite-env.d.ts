/// <reference types="vite/client" />

type GovMapInstance = unknown

interface GovMapSpatialLayerSpec {
  name: string
  fields: string[]
}

interface GovMapGetLayerFeaturesByLocationParams {
  geometry: string
  radius?: number
  address?: string
  layers: GovMapSpatialLayerSpec[]
}

interface GovMapCreateOptions {
  token?: string
  level?: number
  center?: { x: number; y: number }
  layersMode?: number
  layers?: string[]
  visibleLayers?: string[]
  identifyOnClick?: boolean
  language?: string
  isRTL?: boolean
  zoom?: number
}

interface GovMapLayerDataParams {
  LayerName: string
  Point: { x: number; y: number }
  Radius: number
}

interface GovMapClickPayload extends Record<string, unknown> {
  x?: number
  y?: number
  mapX?: number
  mapY?: number
  point?: { x?: number; y?: number }
}

interface GovMapOnEventChain {
  progress: (handler: (payload: GovMapClickPayload) => void) => void
  cancel?: () => void
}

/** govmap.api.js — חתימות חלקיות */
interface GovMapApi {
  createMap: (
    target: string | HTMLElement,
    options: GovMapCreateOptions,
    callback?: (map: GovMapInstance) => void,
  ) => void
  events?: { CLICK?: number; [key: string]: number | undefined }
  getLayerData?: (params: GovMapLayerDataParams) => Promise<unknown>
  getLayerFeaturesByLocation?: (
    params: GovMapGetLayerFeaturesByLocationParams,
    apiToken: string,
  ) => Promise<unknown>
  on?: (eventType: number | string, handler: (payload: GovMapClickPayload) => void) => void
  onEvent?: (eventType: number | string) => GovMapOnEventChain
  unbindEvent?: (eventType: number | string, handler: (payload: GovMapClickPayload) => void) => void
  zoomToXY?: (params: { x: number; y: number; level?: number; marker?: boolean }) => void
}

interface Window {
  govmap?: GovMapApi
}
