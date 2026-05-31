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
import { buildAreaObjectIdsClause } from './mapLayerFilters'

const NEIGHBORHOODS_LAYER_NAME = '22'

export type ApplySelectedAreaCallbacks = {
  setServicesQueryGeometry: (geometry: string) => void
  setServicesListLoading: (loading: boolean) => void
  setServicesList: (services: ServiceListItem[]) => void
}

/**
 * מיקוד מפה + טעינת מענים באזור — מקור יחיד לשינוי אזור בסרגל.
 */
export async function applySelectedArea(
  option: NeighborhoodMapOption,
  callbacks: ApplySelectedAreaCallbacks,
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

  callbacks.setServicesListLoading(true)
  try {
    const response = await govmap.intersectFeatures?.({
      geometry,
      layerName: SITE.layers.servicesLayer,
      fields: [...SERVICE_TABLE_LAYER_FIELDS],
    })
    const rows = mapIntersectFeaturesToServicesList(
      response?.data,
      SERVICE_TABLE_LAYER_FIELDS,
    )
    callbacks.setServicesList(rows)

    const objectIds = rows
      .map((row) => row.objectId)
      .filter((value) => Number.isFinite(value))
    govmap.filterLayers?.({
      layerName: SITE.layers.servicesLayer,
      whereClause: buildAreaObjectIdsClause(objectIds),
      zoomToExtent: true,
    })
  } catch (error) {
    console.error('failed applying selected area', error)
    callbacks.setServicesList([])
    govmap.filterLayers?.({
      layerName: SITE.layers.servicesLayer,
      zoomToExtent: true,
    })
  } finally {
    callbacks.setServicesListLoading(false)
  }
}
