import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

export type DashboardViewMode = 'map' | 'list'

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
    }),
    [viewMode, selectedArea, populationSegment, profileKey, profileInsightsOpen, setPopulationSegment],
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
