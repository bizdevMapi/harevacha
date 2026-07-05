import { useEffect, useMemo } from 'react'
import { useDashboardUi } from '../../context/DashboardUiContext'
import MapFiltersPanel from '../map/MapFiltersPanel'
import {
  buildFilterSectionsFromServiceList,
  filterServicesBySearchQuery,
  filterServicesBySelectedKeys,
} from '../map/mapLayerFilters'
import MapPointInfoCard from '../map/MapPointInfoCard'
import ServicesListTable from './ServicesListTable'

const ServicesListView = () => {
  const {
    viewMode,
    servicesList,
    servicesListLoading,
    setMatchedServicesCount,
    serviceFilterSearchQuery,
    setServiceFilterSearchQuery,
    appliedServiceFilterSearchQuery,
    selectedServiceFilterKeys,
    setSelectedServiceFilterKeys,
    selectedPointInfo,
    setSelectedPointInfo,
    selectedArea,
    neighborhoodsList,
    expandedFilterSections,
    setExpandedFilterSections,
  } = useDashboardUi()

  const filterSections = useMemo(
    () => buildFilterSectionsFromServiceList(servicesList),
    [servicesList],
  )

  const filteredRows = useMemo(() => {
    const bySelectedKeys = filterServicesBySelectedKeys(servicesList, selectedServiceFilterKeys)
    return filterServicesBySearchQuery(bySelectedKeys, appliedServiceFilterSearchQuery)
  }, [servicesList, selectedServiceFilterKeys, appliedServiceFilterSearchQuery])

  const selectedAreaOption = neighborhoodsList.find((n) => n.optionValue === selectedArea)

  useEffect(() => {
    if (viewMode !== 'list') return
    setMatchedServicesCount(filteredRows.length)
  }, [viewMode, filteredRows.length, setMatchedServicesCount])

  if (servicesListLoading) {
    return (
      <div className="flex h-full items-center justify-center bg-white p-6 text-sm text-[#5f708a]">
        טוען רשימת מענים…
      </div>
    )
  }

  return (
    <div className="flex h-full min-w-0 bg-white" dir="rtl">
      <MapFiltersPanel
        isOpen
        hideToggle
        onToggle={() => {}}
        searchQuery={serviceFilterSearchQuery}
        onSearchQueryChange={setServiceFilterSearchQuery}
        filterSections={filterSections}
        filtersLoading={servicesListLoading}
        selectedKeys={selectedServiceFilterKeys}
        onFilterSelectionChange={setSelectedServiceFilterKeys}
        expandedSections={expandedFilterSections}
        onExpandedSectionsChange={setExpandedFilterSections}
      />

      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        {filteredRows.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-2 p-6 text-center">
            <p className="text-sm font-medium text-[#161a20]">אין מענים להצגה</p>
            <p className="max-w-md text-xs text-[#5f708a]">
              לא נמצאו מענים באזור שנבחר. נסו לשנות אזור או לרענן את הדף.
            </p>
          </div>
        ) : (
          <ServicesListTable rows={filteredRows} onServiceClick={(fields) => setSelectedPointInfo({ fields, isOtherLayer: false })} />
        )}
      </div>

      {selectedPointInfo && (
        <MapPointInfoCard
          data={selectedPointInfo.fields}
          isOtherLayer={selectedPointInfo.isOtherLayer}
          onClose={() => setSelectedPointInfo(null)}
          selectedAreaCenter={selectedAreaOption?.value ?? null}
          onExpandMap={(center) => {
            const target = center ?? selectedAreaOption?.value ?? null
            if (!target) return
            window.govmap?.zoomToXY?.({
              x: target.x,
              y: target.y,
              level: 12,
              marker: true,
            })
            setSelectedPointInfo(null)
          }}
        />
      )}
    </div>
  )
}

export default ServicesListView
