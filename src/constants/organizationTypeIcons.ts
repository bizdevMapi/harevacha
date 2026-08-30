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

/**
 * Light tint background + matching text color per organization icon,
 * used for badges/pills (e.g. the report-error modal service tag).
 * Keyed by icon id (not the raw organization type string) so the pill
 * color always matches whichever icon getOrganizationIcon resolved to.
 */
const ORGANIZATION_ICON_PILL_COLORS: Partial<Record<MapPointInfoIconId, { bg: string; text: string }>> = {
  'building-gov': { bg: '#e3f3fc', text: '#0a6cad' },
  'building-private': { bg: '#f4eafb', text: '#8a2ac0' },
  'building-nonprofit': { bg: '#fdf0e4', text: '#b35f16' },
}

export function getOrganizationPillColor(organizationType?: string): { bg: string; text: string } {
  const iconId = getOrganizationIcon(organizationType)
  return ORGANIZATION_ICON_PILL_COLORS[iconId] ?? ORGANIZATION_ICON_PILL_COLORS[DEFAULT_ICON]!
}
