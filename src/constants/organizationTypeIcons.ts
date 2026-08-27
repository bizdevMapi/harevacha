import type { MapPointInfoIconId } from '../components/map/mapPointInfoData'

/**
 * Mapping between organization types and their icons
 * Used to display appropriate icons for different service provider organization types
 */

export const ORGANIZATION_TYPE_TO_ICON: Record<string, MapPointInfoIconId> = {
  'ממשלתי': 'building-gov',
  'פרטי': 'building-private',
  'עמותה': 'building-nonprofit',
}

const DEFAULT_ICON: MapPointInfoIconId = 'building-gov'

export function getOrganizationIcon(organizationType?: string): MapPointInfoIconId {
  if (!organizationType) return DEFAULT_ICON
  return ORGANIZATION_TYPE_TO_ICON[organizationType] ?? DEFAULT_ICON
}
