import { formatServiceCost } from '../../data/servicesListTypes'
import { getOrganizationIcon } from '../../constants/organizationTypeIcons'

/** סוג אייקון לשורת פרטים — להרחבה כשמחברים ל-API */
export type MapPointInfoIconId =
  | 'location'
  | 'phone'
  | 'clock'
  | 'group'
  | 'language'
  | 'target'
  | 'price'
  | 'building'
  | 'building-gov'
  | 'building-private'
  | 'building-nonprofit'
  | 'accessibility'
  | 'link'

export type MapPointInfoDetail = {
  id: string
  icon: MapPointInfoIconId
  value: string
}

/** מבנה נתוני מענה נבחר — החלף ב-`MapPointInfo` מ-API / GovMap */
export type MapPointInfo = {
  id: string
  title: string
  description: string
  /** תמונת תצוגה מקדימה למפה (אופציונלי) */
  mapPreviewUrl?: string
  details: MapPointInfoDetail[]
}

type GovmapFieldRow = { name?: string; fieldValue?: string; value?: string }

function cellToString(value: unknown): string {
  if (value == null) return ''
  const text = String(value).trim()
  if (text === '' || text.toUpperCase() === 'NULL') return ''
  return text
}

function normalizeGovmapFields(rawEntity: unknown): Record<string, string> {
  const map: Record<string, string> = {}

  const ingestFieldRows = (rows: GovmapFieldRow[]) => {
    for (const row of rows) {
      if (!row?.name) continue
      const value = cellToString(row.fieldValue ?? row.value)
      if (value) map[row.name] = value
    }
  }

  if (Array.isArray(rawEntity)) {
    ingestFieldRows(rawEntity)
    return map
  }

  if (!rawEntity || typeof rawEntity !== 'object') return map

  const entity = rawEntity as Record<string, unknown>
  if (Array.isArray(entity.fields)) {
    ingestFieldRows(entity.fields as GovmapFieldRow[])
  }

  for (const [key, value] of Object.entries(entity)) {
    if (key === 'fields' || key === 'geometry') continue
    const text = cellToString(value)
    if (text) map[key] = text
  }

  return map
}

const POINT_INFO_DETAIL_SPECS: Array<{ field: string; icon: MapPointInfoIconId }> = [
  { field: 'FullAddress', icon: 'location' },
  { field: 'Phone', icon: 'phone' },
  { field: 'OpenHours', icon: 'clock' },
  { field: 'TargetPopulations', icon: 'group' },
  { field: 'RiskStatusDescription_Agg', icon: 'target' },
  { field: 'ServiceProviderOrganizationType', icon: 'building' },
  { field: 'Accessibility', icon: 'accessibility' },
]

export function getDetailIconForField(fieldName: string, fieldValue?: string): MapPointInfoIconId {
  if (fieldName === 'ServiceProviderOrganizationType' && fieldValue) {
    return getOrganizationIcon(fieldValue)
  }

  const spec = POINT_INFO_DETAIL_SPECS.find((s) => s.field === fieldName)
  return spec?.icon ?? 'building'
}
