import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from 'react'
import type { ServiceListItem } from '../data/servicesListTypes'

export type DashboardViewMode = 'map' | 'list'

export type NeighborhoodMapOption = {
  label: string
  /** קואורדינטות למיקוד במפה */
  value: { x: number; y: number }
  /** ערך ייחודי ל־<select> — לא להסיק מ־value.x/y כשיש גם objectId */
  optionValue: string
  /** מזהה ישות בשכבה 22 (ל־searchInLayer), אופציונלי לפריט קבוע בלי שכבה */
  layerObjectId?: number,
  geometry?: string,
}

export type DashboardUiValue = {
  viewMode: DashboardViewMode
  setViewMode: (mode: DashboardViewMode) => void
  selectedArea: string
  setSelectedArea: (area: string) => void
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
  servicesListLoading: boolean
  setServicesListLoading: Dispatch<SetStateAction<boolean>>
}

const DashboardUiContext = createContext<DashboardUiValue | null>(null)

/**
 * מצב UI משותף לסרגל המסננים, למפה ולכרטיסי מידע — בלי להעביר פרופס דרך App.
 */
export function DashboardUiProvider({ children }: { children: ReactNode }) {
  const [viewMode, setViewMode] = useState<DashboardViewMode>('map')
  const [selectedArea, setSelectedArea] = useState('jerusalem-all')
  const [populationSegment, setPopulationSegmentState] = useState('none')
  const [profileKey, setProfileKey] = useState('none')
  const [profileInsightsOpen, setProfileInsightsOpen] = useState(false)
  const [neighborhoodsList, setNeighborhoodsList] = useState<NeighborhoodMapOption[]>([])
  const [servicesList, setServicesList] = useState<ServiceListItem[]>([])
  const [servicesListLoading, setServicesListLoading] = useState(false)

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
      selectedArea,
      setSelectedArea,
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
      servicesListLoading,
      setServicesListLoading,
    }),
    [
      viewMode,
      selectedArea,
      populationSegment,
      profileKey,
      profileInsightsOpen,
      setPopulationSegment,
      neighborhoodsList,
      servicesList,
      servicesListLoading,
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
