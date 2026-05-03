import { useState } from "react"
import GovMapView from "./components/map/GovMapView"
import { FilterToolbar, Header } from "./components/layout"

const layers = [
  "שכבת מוסדות חינוך",
  "בתי ספר יסודיים",
  "גני ילדים",
  "מרכזי קהילה",
  "מרכזים רפואיים",
  "תחנות תחבורה ציבורית",
  "חניונים",
  "שטחים פתוחים",
]

function App() {
  const [viewMode, setViewMode] = useState("map")

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <Header />
      <FilterToolbar viewMode={viewMode} onViewModeChange={setViewMode} />

      <main className="flex min-h-0 flex-1 flex-row-reverse">
        {/* <aside className="h-full w-[320px] shrink-0 border-l border-slate-200 bg-white">
          <div className="border-b border-slate-200 px-4 py-3">
            <h2 className="text-sm font-semibold text-slate-800">שכבות וסינונים</h2>
            <p className="mt-1 text-xs text-slate-500">ניהול תצוגת הנתונים במפה</p>
          </div>

          <div className="h-[calc(100%-66px)] space-y-4 overflow-y-auto px-4 py-3">
            <div className="rounded-md border border-slate-200 p-3">
              <h3 className="mb-2 text-xs font-semibold text-slate-700">קטגוריות</h3>
              <div className="space-y-1.5">
                {layers.map((label, index) => (
                  <label
                    key={label}
                    className="flex cursor-pointer items-center gap-2 rounded px-1 py-1 text-xs text-slate-700 hover:bg-brand-bgSoft"
                  >
                    <input type="checkbox" defaultChecked={index < 2} className="h-4 w-4 accent-brand-darkBlue" />
                    <span>{label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="rounded-md border border-slate-200 p-3">
              <h3 className="mb-2 text-xs font-semibold text-slate-700">סינון לפי מרחק</h3>
              <input type="range" min="0" max="20" defaultValue="8" className="w-full accent-brand-darkBlue" />
              <div className="mt-1 flex justify-between text-[11px] text-slate-500">
                <span>0 ק״מ</span>
                <span>20 ק״מ</span>
              </div>
            </div>

            <div className="rounded-md border border-slate-200 p-3">
              <h3 className="mb-2 text-xs font-semibold text-slate-700">סטטוס</h3>
              <div className="space-y-1.5 text-xs text-slate-700">
                <label className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked className="h-4 w-4 accent-brand-darkBlue" />
                  <span>פעיל</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="h-4 w-4 accent-brand-darkBlue" />
                  <span>בטיפול</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="h-4 w-4 accent-brand-darkBlue" />
                  <span>לא פעיל</span>
                </label>
              </div>
            </div>
          </div>
        </aside> */}

        <section className="min-w-0 flex-1 bg-[#eef3f7] p-2">
          <div className="relative h-full w-full overflow-hidden rounded-md border border-slate-300 bg-brand-bgLight shadow-sm">
            {viewMode === "map" ? (
              <>
                <GovMapView />
                <div className="absolute bottom-3 left-3 z-10 flex items-center gap-2">
                  <button
                    type="button"
                    className="h-8 w-8 rounded-full border border-slate-300 bg-white text-slate-700 shadow-sm"
                  >
                    +
                  </button>
                  <button
                    type="button"
                    className="h-8 w-8 rounded-full border border-slate-300 bg-white text-slate-700 shadow-sm"
                  >
                    −
                  </button>
                  <button
                    type="button"
                    className="rounded-full border border-slate-300 bg-white px-3 py-1 text-xs text-slate-700 shadow-sm"
                  >
                    שכבות
                  </button>
                </div>
              </>
            ) : (
              <div className="flex h-full flex-col items-center justify-center gap-2 p-6 text-center text-slate-600">
                <p className="text-sm font-medium text-slate-800">תצוגת רשימה</p>
                <p className="max-w-md text-xs text-slate-500">
                  כאן תוצג רשימת המענים לאחר חיבור לנתונים. ניתן לחזור ל&quot;מפה&quot; מהסרגל למעלה.
                </p>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  )
}

export default App
