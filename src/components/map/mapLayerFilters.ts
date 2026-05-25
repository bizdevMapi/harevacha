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

export type LayerFilterTopValue = {
  count: number
  value?: string
}

export type LayerFilterField = {
  name: string
  displayName: string
  fieldType: number
  values?: {
    fieldType?: number
    topValues?: LayerFilterTopValue[]
  }
}

export const FILTER_SECTIONS_CONFIG = [
  { fieldName: 'riskstatusdescription_agg', title: 'מצב סיכון' },
  { fieldName: 'targetpopulations', title: 'סוג אוכלוסיה' },
  { fieldName: 'language', title: 'שפה', titleClassName: 'text-[#06365a]' },
] as const

const FILTER_FIELD_CONFIG = FILTER_SECTIONS_CONFIG

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

export function buildAreaObjectIdsClause(objectIds: number[]): string {
  if (objectIds.length === 0) return '1=0'
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
): string {
  const areaClause = buildAreaObjectIdsClause(areaObjectIds)
  const attributeClause = buildServicesLayerWhereClause(selectedKeys)
  return combineWhereClauses(areaClause, attributeClause)
}

function splitFilterValue(value: string): string[] {
  return value
    .split(/[,،]/)
    .map((part) => part.trim())
    .filter((part) => part.length > 0 && part !== 'NULL')
}

function aggregateTopValues(topValues: LayerFilterTopValue[]): FilterItem[] {
  const counts = new Map<string, number>()

  for (const entry of topValues) {
    if (!entry.value || entry.value === 'NULL') continue

    const parts = splitFilterValue(entry.value)
    if (parts.length === 0) continue

    for (const part of parts) {
      counts.set(part, (counts.get(part) ?? 0) + entry.count)
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

export function buildFilterSectionsFromLayerFields(
  fields: LayerFilterField[] | null | undefined,
): FilterSectionData[] {
  if (!fields?.length) return []

  return FILTER_FIELD_CONFIG.map((config) => {
    const field = fields.find((f) => f.name === config.fieldName)
    const topValues = field?.values?.topValues ?? []
    const items = aggregateTopValues(topValues)

    return {
      title: config.title,
      titleClassName: 'titleClassName' in config ? config.titleClassName : undefined,
      items,
    }
  }).filter((section) => section.items.length > 0)
}
