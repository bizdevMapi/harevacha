import { useState } from 'react'
import { useDashboardUi } from '../../context/DashboardUiContext'
import MapFiltersPanel from '../map/MapFiltersPanel'
import ServicesListTable from './ServicesListTable'

const ServicesListView = () => {
  const { servicesList, servicesListLoading } = useDashboardUi()
  const [searchQuery, setSearchQuery] = useState('')

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
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
      />

      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        {servicesList.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-2 p-6 text-center">
            <p className="text-sm font-medium text-[#161a20]">אין מענים להצגה</p>
            <p className="max-w-md text-xs text-[#5f708a]">
              לא נמצאו מענים באזור שנבחר. נסו לשנות אזור או לרענן את הדף.
            </p>
          </div>
        ) : (
          <ServicesListTable rows={servicesList} searchQuery={searchQuery} />
        )}
      </div>
    </div>
  )
}

export default ServicesListView
