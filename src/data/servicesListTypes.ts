export const SERVICE_TABLE_LAYER_FIELDS = [
  'serviceid',
  'servicename',
  'servicetypename',
   'targetpopulations',
  'language',
  'openhours',
  'accessibility',
  'requirespaymentamount',
  'requirespayment',
  'serviceproviderorganizationtype',
  'fulladdress',
  'providername',
  'locationtype',
  'participationeligibility',
  'activitytype',
  'airisktype',
  'cityid',
  'providercitycode',
  'frequency',
] as const

export type ServiceTableField = (typeof SERVICE_TABLE_LAYER_FIELDS)[number]

export type ServiceListItem = {
  objectId: number
  serviceid: string | number
  servicename: string
  servicetypename: string
  targetpopulations: string
  locationtype: string
  language: string
  openhours: string
  accessibility: string
  requirespaymentamount: string
  requirespayment: string
  serviceproviderorganizationtype: string
  fulladdress: string
  providername: string
  participationeligibility: string
  activitytype: string
  airisktype: string
  // frequency: string
  servicedate: string
  cityid: string
  providercitycode: string
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
  { id: 'servicename', label: 'שם מענה', width: 168, sortable: true, cellType: 'link' },
  { id: 'airisktype', label: 'התאמה למצבי סיכון', width: 168, cellType: 'tags' },
  { id: 'servicetypename', label: 'סוג מענה', width: 168, cellType: 'text' },
  { id: 'providername', label: 'שם ארגון מספק השירות', width: 168, cellType: 'text', sortable: true },
  { id: 'serviceproviderorganizationtype', label: 'סוג ארגון (נותן השירות)', width: 96, cellType: 'text' },
  { id: 'requirespaymentamount', label: 'עלות', width: 96, cellType: 'text' },
  { id: 'locationtype', label: 'סוג מיקום ', width: 96, cellType: 'text' },
  { id: 'accessibility', label: 'נגישות', width: 214, cellType: 'text' },
  { id: 'language', label: 'שפות', width: 118, cellType: 'text' },
  { id: 'targetpopulations', label: 'אוכלוסיה ייעודית', width: 120, cellType: 'text' },
  { id: 'participationeligibility', label: 'קהל יעד', width: 118, cellType: 'text' },
  { id: 'activitytype', label: 'סוג פעילות', width: 118, cellType: 'text' },
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
  items: any,
  fields: readonly string[] = SERVICE_TABLE_LAYER_FIELDS,
): ServiceListItem[] {
  console.log('mapIntersectFeaturesToServicesList', items, fields)
  if (!items?.length) return []
  return items
    .map((item:any) => {
      const objectId = item.serviceid
      if (objectId == null) return null  

      
      return {
        ObjectId:item.serviceid,
        serviceid: item.serviceid,
        servicename: String(item.servicename ?? ''),
        servicetypename: String(item.servicetypename ?? ''),
        RiskStatusDescription_Agg: String(item.RiskStatusDescription_Agg ?? ''),
        targetpopulations: String(item.targetpopulations ?? ''),
        locationtype: String(item.locationtype ?? ''),
        language: String(item.language ?? ''),
        Phone: String(item.Phone ?? ''),
        OpenHours: String(item.OpenHours ?? ''),
        accessibility: String(item.accessibility ?? ''),
        requirespaymentamount: String(item.requirespaymentamount ?? ''),
        requirespayment: String(item.requirespayment ?? ''),
        serviceproviderorganizationtype: String(item.serviceproviderorganizationtype ?? ''),
        FullAddress: String(item.FullAddress ?? ''),
        ServiceDescription: String(item.ServiceDescription ?? ''),
        providername: String(item.providername ?? ''),
        participationeligibility: String(item.participationeligibility ?? ''),
        activitytype: String(item.activitytype ?? ''),
        airisktype: String(item.airisktype ?? ''),
        ContactDetails: String(item.ContactDetails ?? ''),
        Frequency: String(item.Frequency ?? ''),
        ServiceLink: String(item.ServiceLink ?? ''),
        InsertDate: String(item.InsertDate ?? ''),
        ServiceDate: String(item.ServiceDate ?? ''),
        AIScoreExplanation: String(item.AIScoreExplanation ?? ''),
        AccessibilityText: String(item.AccessibilityText ?? ''),
      }
    })
    .filter((item:AnimationPlaybackEvent): item is ServiceListItem => item != null)
}