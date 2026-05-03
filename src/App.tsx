import GovMapView from './components/map/GovMapView'

const filters: string[] = [
  'בתי ספר',
  'גני ילדים',
  'מרכזי בריאות',
  'תחבורה ציבורית',
  'פארקים',
  'חניונים',
  'מרכזי קהילה',
  'מרחבים מוגנים',
  'תאורת רחוב',
  'מוקדי שירות',
]

function App() {
  return (
    <div className="h-screen overflow-hidden bg-brand-bgLight" dir="rtl">
      <header className="flex h-14 items-center justify-between bg-brand-darkBlue px-5 text-white shadow-sm">
        <h1 className="text-sm font-semibold md:text-base">מערכת GIS עירונית</h1>
        <div className="text-xs text-white/90">Jerusalem • Gov Dashboard</div>
      </header>

      <main className="flex h-[calc(100vh-3.5rem)] flex-row-reverse">
        <aside className="h-full w-[320px] shrink-0 border-l border-brand-lightBlue bg-white">
          <div className="border-b border-brand-lightBlue px-4 py-3">
            <h2 className="text-sm font-semibold text-brand-darkBlue">סינונים</h2>
            <p className="mt-1 text-xs text-slate-500">בחירת שכבות להצגה על המפה</p>
          </div>

          <div className="h-[calc(100%-61px)] overflow-y-auto px-4 py-3">
            <div className="space-y-2">
              {filters.map((label) => (
                <label
                  key={label}
                  className="flex cursor-pointer items-center gap-2 rounded px-1 py-1 text-sm text-slate-700 hover:bg-brand-bgSoft"
                >
                  <input type="checkbox" className="h-4 w-4 accent-brand-darkBlue" />
                  <span>{label}</span>
                </label>
              ))}
            </div>
          </div>
        </aside>

        <section className="min-w-0 flex-1 bg-brand-bgSoft p-3">
          <div className="h-full w-full rounded-md border border-brand-lightBlue bg-brand-bgLight shadow-sm">
            <GovMapView />
          </div>
        </section>
      </main>
    </div>
  )
}

export default App
