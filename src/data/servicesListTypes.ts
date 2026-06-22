/** שדות נדרשים לשכבת המענים — עמודות טבלה + שדות לכרטיס מידע */
export const SERVICE_TABLE_LAYER_FIELDS = [
  'ServiceName',
  'servicetypename',
  'RiskStatusDescription_Agg',
  'TargetPopulations',
  'Language',
  'Phone',
  'OpenHours',
  'Accessibility',
  'RequiresPaymentAmount',
  'RequiresPayment',
  'ServiceProviderOrganizationType',
  'FullAddress',
  'ServiceDescription',
  'ProviderName',
  'LocationType',
  'ParticipationEligibility',
  'ActivityType',
  'airisktype',
  'GisX',
  'GisY',
] as const

export type ServiceTableField = (typeof SERVICE_TABLE_LAYER_FIELDS)[number]

export type ServiceListItem = {
  objectId: number
  ServiceName: string
  servicetypename: string
  RiskStatusDescription_Agg: string
  TargetPopulations: string
  LocationType: string
  Language: string
  Phone: string
  OpenHours: string
  Accessibility: string
  RequiresPaymentAmount: string
  RequiresPayment: string
  ServiceProviderOrganizationType: string
  FullAddress: string
  ServiceDescription: string
  ProviderName: string
  ParticipationEligibility: string
  ActivityType: string
  airisktype: string
  GisX: string
  GisY: string
}

export type ServiceListColumnId =
  | ServiceTableField
  | 'cost'

export type ServiceListColumn = {
  id: ServiceListColumnId
  label: string
  width: number
  sortable?: boolean
  cellType?: 'link' | 'tags' | 'cost' | 'text'
}

/** עמודות הטבלה — סדר RTL מימין לשמאל כמו בפיגמה */
export const SERVICE_LIST_COLUMNS: ServiceListColumn[] = [
  { id: 'ServiceName', label: 'שם מענה', width: 168, sortable: true, cellType: 'link' },
  { id: 'airisktype', label: 'התאמה למצבי סיכון', width: 168, cellType: 'tags' },
  { id: 'servicetypename', label: 'סוג מענה', width: 168, cellType: 'text' },
  { id: 'ProviderName', label: 'שם ארגון מספק השירות', width: 168, cellType: 'text' },
  { id: 'ServiceProviderOrganizationType', label: 'סוג ארגון (נותן השירות)', width: 96, cellType: 'text' },
  { id: 'RequiresPaymentAmount', label: 'עלות', width: 96, cellType: 'text' },
  { id: 'LocationType', label: 'סוג מיקום ', width: 96, cellType: 'text' },
  { id: 'Accessibility', label: 'נגישות', width: 214, cellType: 'text' },
  { id: 'Language', label: 'שפות', width: 118, cellType: 'text' },
  { id: 'TargetPopulations', label: 'אוכלוסיה ייעודית', width: 120, cellType: 'text' },
  { id: 'ParticipationEligibility', label: 'קהל יעד', width: 118, cellType: 'text' },
  { id: 'ActivityType', label: 'סוג פעילות', width: 118, cellType: 'text' },
]

export type GovmapIntersectFeature = {
  ObjectId?: number
  Values?: unknown[]
}

function cellToString(value: unknown): string {
  if (value == null) return ''
  const text = String(value).trim()
  if (text === '' || text.toUpperCase() === 'NULL') return ''
  return text
}

export function splitCommaList(value: string): string[] {
  if (!value) return []
  return value
    .split(/[,،]/)
    .map((part) => part.trim())
    .filter(Boolean)
}

export function formatServiceCost(requiresPayment: string, amount: string): string {
  const paymentText = requiresPayment.trim()
  const amountText = amount.trim()

  if (
    paymentText === 'לא' ||
    paymentText.includes('ללא') ||
    amountText.includes('ללא עלות')
  ) {
    return 'ללא עלות'
  }

  const digits = amountText.replace(/[^\d]/g, '')
  if (digits) return `₪ ${digits}`

  if (amountText) return amountText
  if (paymentText) return paymentText
  return '—'
}

export function mapIntersectFeaturesToServicesList(
  items: GovmapIntersectFeature[] | undefined,
  fields: readonly string[] = SERVICE_TABLE_LAYER_FIELDS,
): ServiceListItem[] {
  if (!items?.length) return []
  return items
    .map((item) => {
      const objectId = item.ObjectId
      if (objectId == null) return null

      const values = item.Values ?? []
      const row: Record<string, string | number> = { objectId }

      fields.forEach((fieldName, index) => {
        row[fieldName] = cellToString(values[index])
      })
      
      return {
        objectId,
        ServiceName: String(row.ServiceName ?? ''),
        servicetypename: String(row.servicetypename ?? ''),
        RiskStatusDescription_Agg: String(row.RiskStatusDescription_Agg ?? ''),
        TargetPopulations: String(row.TargetPopulations ?? ''),
        LocationType: String(row.LocationType ?? ''),
        Language: String(row.Language ?? ''),
        Phone: String(row.Phone ?? ''),
        OpenHours: String(row.OpenHours ?? ''),
        Accessibility: String(row.Accessibility ?? ''),
        RequiresPaymentAmount: String(row.RequiresPaymentAmount ?? ''),
        RequiresPayment: String(row.RequiresPayment ?? ''),
        ServiceProviderOrganizationType: String(row.ServiceProviderOrganizationType ?? ''),
        FullAddress: String(row.FullAddress ?? ''),
        ServiceDescription: String(row.ServiceDescription ?? ''),
        ProviderName: String(row.ProviderName ?? ''),
        ParticipationEligibility: String(row.ParticipationEligibility ?? ''),
        ActivityType: String(row.ActivityType ?? ''),
        airisktype: String(row.airisktype ?? ''),
        GisX: String(row.GisX ?? ''),
        GisY: String(row.GisY ?? ''),
      }
    })
    .filter((row): row is ServiceListItem => row != null)
}
