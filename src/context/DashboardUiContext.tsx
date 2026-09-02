import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from 'react'
import type { ServiceListItem } from '../data/servicesListTypes'
import { DASHBOARD_DEFAULT_AREA_VALUE, TIRAT_CARMEL_CITY_AREA_OPTION } from '../constants'
import type { MapPointInfoField } from '../components/map/MapPointInfoCard'

export type SelectedPointInfo = {
  fields: MapPointInfoField[] | MapPointInfoField[][]
  isOtherLayer: boolean
  isMultipleServices?: boolean
}

export type DashboardViewMode = 'map' | 'list'

export type NeighborhoodMapOption = {
  label: string
  /** קואורדינטות למיקוד במפה */
  value: { x: number; y: number }
  /** ערך ייחודי ל־<select> — לא להסיק מ־value.x/y כשיש גם objectId */
  optionValue: string
  /** מזהה ישות בשכבה 22 (ל־searchInLayer), אופציונלי לפריט קבוע בלי שכבה */
  layerObjectId?: number,
  /** קוד שכונה אחיד בשכבה 22 — לקיבוץ ולחיפוש */
  nbrCode?: string
  /** שם שכונה — חיפוש בשכבה כשאין nbr_code */
  fname?: string
  /** שם היישוב שהשכונה שייכת לו (setl_name בשכבה 22) — להתמקדות בעיר בבחירה מרובה */
  cityName?: string
  geometry?: string,
  cityObjectId?: string,
  /** מזהה ישות בשכבת רשויות (125) — להדגשת גבול הרשות */
  municipalityObjectId?: number,
  filter?: string
}

export type DashboardUiValue = {
  viewMode: DashboardViewMode
  setViewMode: (mode: DashboardViewMode) => void
  selectedAreas: string[]
  setSelectedAreas: Dispatch<SetStateAction<string[]>>
  populationSegment: string
  setPopulationSegment: (segment: string) => void
  profileKey: string
  setProfileKey: (key: string) => void
  profileInsightsOpen: boolean
  setProfileInsightsOpen: (open: boolean) => void
  neighborhoodsList: NeighborhoodMapOption[]
  setNeighborhoodsList: Dispatch<SetStateAction<NeighborhoodMapOption[]>>
  servicesList: ServiceListItem[]
  setServicesList: Dispatch<SetStateAction<ServiceListItem[]>>
  matchedServicesCount: number
  setMatchedServicesCount: Dispatch<SetStateAction<number>>
  servicesListLoading: boolean
  setServicesListLoading: Dispatch<SetStateAction<boolean>>
  servicesQueryGeometry: string
  setServicesQueryGeometry: (geometry: string) => void
  serviceFilterSearchQuery: string
  setServiceFilterSearchQuery: (query: string) => void
  appliedServiceFilterSearchQuery: string
  selectedServiceFilterKeys: Set<string>
  setSelectedServiceFilterKeys: Dispatch<SetStateAction<Set<string>>>
  selectedPointInfo: SelectedPointInfo | null
  setSelectedPointInfo: Dispatch<SetStateAction<SelectedPointInfo | null>>
  expandedFilterSections: Set<string>
  setExpandedFilterSections: Dispatch<SetStateAction<Set<string>>>
  /** תווית המסנן המהיר הפעיל (מהמפה) — להצגה לצד מספר המענים בסרגל, כדי שיהיה ברור מה מוצג */
  activeQuickFilterLabel: string | null
  setActiveQuickFilterLabel: Dispatch<SetStateAction<string | null>>
}

const DashboardUiContext = createContext<DashboardUiValue | null>(null)
const SEARCH_FILTER_DEBOUNCE_MS = 350

/**
 * מצב UI משותף לסרגל המסננים, למפה ולכרטיסי מידע — בלי להעביר פרופס דרך App.
 */
export function DashboardUiProvider({ children }: { children: ReactNode }) {
  const [viewMode, setViewMode] = useState<DashboardViewMode>('map')
  const [selectedAreas, setSelectedAreas] = useState<string[]>([DASHBOARD_DEFAULT_AREA_VALUE])
  const [populationSegment, setPopulationSegmentState] = useState('none')
  const [profileKey, setProfileKey] = useState('none')
  const [profileInsightsOpen, setProfileInsightsOpen] = useState(false)
  const [neighborhoodsList, setNeighborhoodsList] = useState<NeighborhoodMapOption[]>([])
  const [servicesList, setServicesList] = useState<ServiceListItem[]>([])
  const [matchedServicesCount, setMatchedServicesCount] = useState(0)
  const [servicesListLoading, setServicesListLoading] = useState(false)
  const [servicesQueryGeometry, setServicesQueryGeometry] = useState<string>(
    TIRAT_CARMEL_CITY_AREA_OPTION.geometry || ''
  )
  const [serviceFilterSearchQuery, setServiceFilterSearchQuery] = useState('')
  const [appliedServiceFilterSearchQuery, setAppliedServiceFilterSearchQuery] = useState('')
  const [selectedServiceFilterKeys, setSelectedServiceFilterKeys] = useState<Set<string>>(
    () => new Set(),
  )
  const [selectedPointInfo, setSelectedPointInfo] = useState<SelectedPointInfo | null>(null)
  const [expandedFilterSections, setExpandedFilterSections] = useState<Set<string>>(
    () => new Set(),
  )
  const [activeQuickFilterLabel, setActiveQuickFilterLabel] = useState<string | null>(null)

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setAppliedServiceFilterSearchQuery(serviceFilterSearchQuery)
    }, SEARCH_FILTER_DEBOUNCE_MS)

    return () => window.clearTimeout(timer)
  }, [serviceFilterSearchQuery])

  useEffect(() => {
    setSelectedPointInfo(null)
  }, [viewMode])

  const setPopulationSegment = useCallback((value: string) => {
    setPopulationSegmentState(value)
    if (value === 'none') {
      setProfileKey('none')
      setProfileInsightsOpen(false)
    } else {
      setProfileInsightsOpen(true)
    }
  }, [])

  const value = useMemo(
    (): DashboardUiValue => ({
      viewMode,
      setViewMode,
      selectedAreas,
      setSelectedAreas,
      populationSegment,
      setPopulationSegment,
      profileKey,
      setProfileKey,
      profileInsightsOpen,
      setProfileInsightsOpen,
      neighborhoodsList,
      setNeighborhoodsList,
      servicesList,
      setServicesList,
      matchedServicesCount,
      setMatchedServicesCount,
      servicesListLoading,
      setServicesListLoading,
      servicesQueryGeometry,
      setServicesQueryGeometry,
      serviceFilterSearchQuery,
      setServiceFilterSearchQuery,
      appliedServiceFilterSearchQuery,
      selectedServiceFilterKeys,
      setSelectedServiceFilterKeys,
      selectedPointInfo,
      setSelectedPointInfo,
      expandedFilterSections,
      setExpandedFilterSections,
      activeQuickFilterLabel,
      setActiveQuickFilterLabel,
    }),
    [
      viewMode,
      selectedAreas,
      populationSegment,
      profileKey,
      profileInsightsOpen,
      setPopulationSegment,
      neighborhoodsList,
      servicesList,
      matchedServicesCount,
      servicesListLoading,
      servicesQueryGeometry,
      serviceFilterSearchQuery,
      appliedServiceFilterSearchQuery,
      selectedServiceFilterKeys,
      selectedPointInfo,
      expandedFilterSections,
      activeQuickFilterLabel,
    ],
  )

  return <DashboardUiContext.Provider value={value}>{children}</DashboardUiContext.Provider>
}

export function useDashboardUi(): DashboardUiValue {
  const ctx = useContext(DashboardUiContext)
  if (ctx == null) {
    throw new Error('useDashboardUi must be used within DashboardUiProvider')
  }
  return ctx
}
