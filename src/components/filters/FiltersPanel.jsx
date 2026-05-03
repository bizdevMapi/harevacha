const filters = [
  'בתי ספר',
  'גני ילדים',
  'מרכזי בריאות',
  'תחבורה ציבורית',
]

const FiltersPanel = () => {
  return (
    <section className="rounded-md border border-brand-lightBlue bg-white p-4">
      <h3 className="mb-3 text-sm font-semibold text-brand-darkBlue">סינונים</h3>
      <div className="space-y-2">
        {filters.map((label) => (
          <label key={label} className="flex items-center gap-2 text-sm text-slate-700">
            <input type="checkbox" className="h-4 w-4 accent-brand-darkBlue" />
            <span>{label}</span>
          </label>
        ))}
      </div>
    </section>
  )
}

export default FiltersPanel
