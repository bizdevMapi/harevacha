import GovMapView from "./components/map/GovMapView"
import ServicesListView from "./components/list/ServicesListView"
import { DashboardUiProvider, useDashboardUi } from "./context/DashboardUiContext"
import { FilterToolbar, Header } from "./components/layout"

function AppShell() {
  const { viewMode } = useDashboardUi()

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <Header />
      <FilterToolbar />

      <main className="flex min-h-0 flex-1 flex-row-reverse">
        <section className="min-w-0 flex-1 bg-[#eef3f7]">
          <div className="relative h-full w-full overflow-hidden rounded-md border border-slate-300 bg-brand-bgLight shadow-sm">
            <div
              className={
                viewMode === "map"
                  ? "h-full"
                  : "pointer-events-none invisible absolute inset-0"
              }
              aria-hidden={viewMode !== "map"}
            >
              <GovMapView />
            </div>
            {viewMode === "list" && (
              <div className="absolute inset-0 z-10 bg-white">
                <ServicesListView />
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  )
}

function App() {
  return (
    <DashboardUiProvider>
      <AppShell />
    </DashboardUiProvider>
  )
}

export default App
