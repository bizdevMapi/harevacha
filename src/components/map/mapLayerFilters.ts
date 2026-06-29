import type { ServiceListItem } from '../../data/servicesListTypes'

export const FILTER_DATA_COLORS = ['#042640', '#115b91', '#115b91', '#2a8ad4', '#80b3e6', '#cce1f5'] as const

export type FilterItem = {
  label: string
  count: number
  color: string
}

export type FilterSectionData = {
  title: string
  titleClassName?: string
  items: FilterItem[]
}

export const FILTER_SECTIONS_CONFIG = [
  { fieldName: 'airisktype', title: 'מצב סיכון ייעודי' },
  { fieldName: 'accessibility', title: 'הנגשה' },
  { fieldName: 'locationtype', title: 'סוג מיקום' },
  { fieldName: 'targetpopulations', title: 'התאמה לסוגי אוכלוסיות' },
  { fieldName: 'language', title: 'שפות המענה' },
  { fieldName: 'servicetypedescription', title: 'סוג המענה' },
  { fieldName: 'serviceproviderorganizationtype', title: 'סוג ארגון נותן שירות' },
  { fieldName: 'requirespayment', title: 'עלות השירות' },
  { fieldName: 'activitytype', title: 'סוג הפעילות' },
  { fieldName: 'participationeligibility', title: 'קהל יעד' },
] as const

const FILTER_FIELD_CONFIG = FILTER_SECTIONS_CONFIG

type AreaServiceFilterRow = {
  objectId: number
  riskStatus: string
  serviceDescription: string
  locationType: string
  aiRiskType: string
  accessibility: string
  targetPopulations: string
  language: string
  serviceTypeDescription: string
  serviceProviderOrganizationType: string
  requiresPayment: string
  activityType: string
  participationEligibility: string
}

const FILTER_FIELD_TO_ROW_KEY: Record<
  (typeof FILTER_SECTIONS_CONFIG)[number]['fieldName'],
  keyof Omit<AreaServiceFilterRow, 'objectId'>
> = {
  locationtype: 'locationType',
  airisktype: 'aiRiskType',
  accessibility: 'accessibility',
  targetpopulations: 'targetPopulations',
  language: 'language',
  servicetypedescription: 'serviceTypeDescription',
  serviceproviderorganizationtype: 'serviceProviderOrganizationType',
  requirespayment: 'requiresPayment',
  activitytype: 'activityType',
  participationeligibility: 'participationEligibility',
}

const FILTER_FIELD_TO_SERVICE_KEY: Record<
  (typeof FILTER_SECTIONS_CONFIG)[number]['fieldName'],
  keyof ServiceListItem
> = {
  locationtype: 'LocationType',
  airisktype: 'airisktype',
  accessibility: 'Accessibility',
  targetpopulations: 'TargetPopulations',
  language: 'Language',
  servicetypedescription: 'ServiceTypeDescription',
  serviceproviderorganizationtype: 'ServiceProviderOrganizationType',
  requirespayment: 'RequiresPayment',
  activitytype: 'ActivityType',
  participationeligibility: 'ParticipationEligibility',
}

export const SECTION_TITLE_TO_FIELD_NAME: Record<string, string> = Object.fromEntries(
  FILTER_SECTIONS_CONFIG.map((config) => [config.title, config.fieldName]),
)

export function parseFilterSelectionKey(
  key: string,
): { fieldName: string; value: string } | null {
  const separatorIndex = key.indexOf('::')
  if (separatorIndex === -1) return null

  const title = key.slice(0, separatorIndex)
  const value = key.slice(separatorIndex + 2)
  const fieldName = SECTION_TITLE_TO_FIELD_NAME[title]
  if (!fieldName || !value) return null

  return { fieldName, value }
}

function escapeSqlLiteral(value: string): string {
  return value.replace(/'/g, "''")
}

function fieldContainsClause(fieldName: string, value: string): string {
  return `${fieldName} LIKE '%${escapeSqlLiteral(value)}%'`
}

/** OR within the same field; AND across different fields. */
export function buildServicesLayerWhereClause(selectedKeys: Iterable<string>): string | null {
  const valuesByField = new Map<string, string[]>()

  for (const key of selectedKeys) {
    const parsed = parseFilterSelectionKey(key)
    if (!parsed) continue
    const existing = valuesByField.get(parsed.fieldName) ?? []
    existing.push(parsed.value)
    valuesByField.set(parsed.fieldName, existing)
  }

  if (valuesByField.size === 0) return null

  const fieldClauses = Array.from(valuesByField.entries()).map(([fieldName, values]) => {
    const valueClauses = values.map((value) => fieldContainsClause(fieldName, value))
    return valueClauses.length === 1 ? valueClauses[0] : `(${valueClauses.join(' OR ')})`
  })

  return fieldClauses.length === 1 ? fieldClauses[0] : `(${fieldClauses.join(' AND ')})`
}

export function buildServicesSearchWhereClause(searchQuery: string): string | null {
  const query = searchQuery.trim()
  if (!query) return null
  const escaped = escapeSqlLiteral(query)
  return `(servicename LIKE '%${escaped}%' OR fulladdress LIKE '%${escaped}%')`
}

export function buildAreaObjectIdsClause(objectIds: number[]): string {
  if (objectIds.length === 0) return `objectid IN (999999999)`
  return `objectid IN (${objectIds.join(',')})`
}

export function combineWhereClauses(...clauses: Array<string | null | undefined>): string {
  const parts = clauses.filter((clause): clause is string => Boolean(clause))
  if (parts.length === 0) return '1=1'
  if (parts.length === 1) return parts[0]
  return `(${parts.join(' AND ')})`
}

/** Area (object IDs from geometry) + optional attribute filters from the side panel. */
export function buildFullServicesLayerWhereClause(
  areaObjectIds: number[],
  selectedKeys: Iterable<string>,
  searchQuery = '',
): string {
  const areaClause = buildAreaObjectIdsClause(areaObjectIds)
  const attributeClause = buildServicesLayerWhereClause(selectedKeys)
  const searchClause = buildServicesSearchWhereClause(searchQuery)
  return combineWhereClauses(areaClause, attributeClause, searchClause)
}

function splitFilterValue(value: string): string[] {
  return value
    .split(/[,،]/)
    .map((part) => part.trim())
    .filter((part) => part.length > 0 && part !== 'NULL')
}

function aggregateAreaFieldValues(rawValues: string[]): FilterItem[] {
  const counts = new Map<string, number>()

  for (const value of rawValues) {
    if (!value) continue
    const parts = splitFilterValue(value)
    for (const part of parts) {
      counts.set(part, (counts.get(part) ?? 0) + 1)
    }
  }

  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([label, count], index) => ({
      label,
      count,
      color: FILTER_DATA_COLORS[index % FILTER_DATA_COLORS.length],
    }))
}

function serviceListToAreaRows(services: ServiceListItem[]): AreaServiceFilterRow[] {
  return services.map((service) => ({
    objectId: service.objectId,
    riskStatus: service.RiskStatusDescription_Agg,
    serviceDescription: service.ServiceDescription,
    locationType: service.LocationType,
    aiRiskType: service.airisktype,
    accessibility: service.Accessibility,
    targetPopulations: service.TargetPopulations,
    language: service.Language,
    serviceTypeDescription: service.ServiceTypeDescription,
    serviceProviderOrganizationType: service.ServiceProviderOrganizationType,
    requiresPayment: service.RequiresPayment,
    activityType: service.ActivityType,
    participationEligibility: service.ParticipationEligibility,
  }))
}

export function buildFilterSectionsFromServiceList(
  services: ServiceListItem[],
): FilterSectionData[] {
  return buildFilterSectionsForArea(serviceListToAreaRows(services))
}

export function updateFilterSectionsCounts(
  sections: FilterSectionData[],
  filteredServices: ServiceListItem[],
): FilterSectionData[] {
  const filteredRows = serviceListToAreaRows(filteredServices)

  return sections.map((section) => {
    const config = FILTER_FIELD_CONFIG.find((c) => c.title === section.title)
    if (!config) return section

    const rowKey = FILTER_FIELD_TO_ROW_KEY[config.fieldName]
    const rawValues: string[] = filteredRows.map((row) => row[rowKey])
    const filteredCounts = new Map<string, number>()

    for (const value of rawValues) {
      if (!value) continue
      const parts = splitFilterValue(value)
      for (const part of parts) {
        filteredCounts.set(part, (filteredCounts.get(part) ?? 0) + 1)
      }
    }

    const updatedItems = section.items.map((item) => ({
      ...item,
      count: filteredCounts.get(item.label) ?? 0,
    }))

    return {
      ...section,
      items: updatedItems,
    }
  })
}

function fieldValueMatchesSelection(fieldValue: string, selectedValues: string[]): boolean {
  return selectedValues.some((selected) => fieldValue.includes(selected))
}

/** סינון client-side — אותה לוגיקה כמו buildServicesLayerWhereClause (OR בשדה, AND בין שדות). */
export function filterServicesBySelectedKeys(
  services: ServiceListItem[],
  selectedKeys: Iterable<string>,
): ServiceListItem[] {
  const valuesByField = new Map<string, string[]>()

  for (const key of selectedKeys) {
    const parsed = parseFilterSelectionKey(key)
    if (!parsed) continue
    const existing = valuesByField.get(parsed.fieldName) ?? []
    existing.push(parsed.value)
    valuesByField.set(parsed.fieldName, existing)
  }

  if (valuesByField.size === 0) return services

  return services.filter((service) => {
    for (const [fieldName, values] of valuesByField.entries()) {
      if (!(fieldName in FILTER_FIELD_TO_SERVICE_KEY)) return false
      const serviceKey =
        FILTER_FIELD_TO_SERVICE_KEY[fieldName as keyof typeof FILTER_FIELD_TO_SERVICE_KEY]
      const fieldValue = String(service[serviceKey] ?? '')
      if (!fieldValueMatchesSelection(fieldValue, values)) return false
    }
    return true
  })
}

export function filterServicesBySearchQuery(
  services: ServiceListItem[],
  searchQuery: string,
): ServiceListItem[] {
  const q = searchQuery.trim().toLowerCase()
  if (!q) return services

  return services.filter((service) => {
    const haystack = [service.ServiceName, service.FullAddress].join(' ').toLowerCase()
    return haystack.includes(q)
  })
}

function buildFilterSectionsForArea(areaRows: AreaServiceFilterRow[]): FilterSectionData[] {
  if (areaRows.length === 0) return []

  return FILTER_FIELD_CONFIG.map((config) => {
    const rowKey = FILTER_FIELD_TO_ROW_KEY[config.fieldName]
    const rawValues: string[] = areaRows.map((row) => row[rowKey])
    const items = aggregateAreaFieldValues(rawValues)

    return {
      title: config.title,
      titleClassName: 'titleClassName' in config ? config.titleClassName : undefined,
      items,
    }
  }).filter((section) => section.items.length > 0)
}
