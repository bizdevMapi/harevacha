type ApiFilterItem = {
  label: string
  count: number
}

type ApiFilterSection = {
  title: string
  items: ApiFilterItem[]
}

const apiFilterSections: ApiFilterSection[] = [
  {
    title: 'מצב סיכון',
    items: [
      { label: 'התעללות והזנחה', count: 56 },
      { label: 'עוני', count: 87 },
      { label: 'ניתוק חברתי', count: 28 },
      { label: 'ירידה קוגנטיבית', count: 32 },
      { label: 'בדידות', count: 14 },
      { label: 'תפקוד פיזי', count: 46 },
    ],
  },
  {
    title: 'סוג אוכלוסיה',
    items: [
      { label: 'כללית', count: 134 },
      { label: 'דתיים', count: 87 },
      { label: 'ערבים', count: 30 },
      { label: 'עולים חדשים', count: 25 },
      { label: 'חרדים', count: 15 },
    ],
  },
  {
    title: 'שפה',
    items: [
      { label: 'עברית', count: 87 },
      { label: 'ערבית', count: 87 },
      { label: 'רוסית', count: 87 },
      { label: 'יידיש', count: 87 },
    ],
  },
]

const categoryPalette = ['#0f3f69', '#1f6ea8', '#3f88be', '#6fa4cd', '#9ec2df', '#c9ddec']

const withCategoryColors = (sections: ApiFilterSection[]) =>
  sections.map((section) => ({
    ...section,
    items: section.items.map((item, index) => ({
      ...item,
      color: categoryPalette[index % categoryPalette.length],
    })),
  }))

const sectionsWithColors = withCategoryColors(apiFilterSections)

type MapFiltersPanelProps = {
  isOpen: boolean
  onToggle: () => void
}

const MapFiltersPanel = ({ isOpen, onToggle }: MapFiltersPanelProps) => {
  const toggleButton = (
    <button
      type="button"
      onClick={onToggle}
      className="absolute left-0 top-6 z-30 flex h-9 w-9 -translate-x-1/2 items-center justify-center rounded-full border border-[#b9cde1] bg-white text-lg font-semibold text-[#1f6ea8] shadow-sm transition-colors hover:bg-[#f2f7fb]"
      aria-label={isOpen ? 'סגירת פנל סינון' : 'פתיחת פנל סינון'}
      title={isOpen ? 'סגירת פנל סינון' : 'פתיחת פנל סינון'}
    >
      {isOpen ? '›' : '‹'}
    </button>
  )

  if (!isOpen) {
    return (
      <div className="relative h-full w-0 shrink-0 overflow-visible">
        {toggleButton}
      </div>
    )
  }

  return (
    <aside className="relative h-full w-[280px] max-w-[88vw] shrink-0 border-l border-[#d7e1ee] bg-white/95 shadow-[-8px_0_18px_rgba(21,58,97,0.08)] backdrop-blur-[1px]">
      {toggleButton}
      <div className="h-full overflow-y-auto px-5 pb-5 pt-6">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-[27px] font-bold leading-none text-[#1e2f47]">סינון מענים</h2>
          <button type="button" className="text-sm font-semibold text-[#2e6eac] hover:text-[#1f598f]">
            ניקוי
          </button>
        </div>

        <div className="relative mb-5">
          <input
            type="text"
            placeholder="איתור מענה לפי שם או כתובת"
            className="w-full border-0 border-b border-[#d6e2ef] bg-transparent px-0 pb-2 pl-8 pt-1 text-sm text-[#173a5d] placeholder:text-[#90a8c3] focus:border-[#4a87c2] focus:outline-none"
          />
          <span className="pointer-events-none absolute left-1 top-1 text-[#6f8daf]">⌕</span>
        </div>

        <div className="space-y-7">
          {sectionsWithColors.map((section) => {
            const sectionTotal = section.items.reduce((sum, item) => sum + item.count, 0)

            return (
              <section key={section.title}>
                <div className="mb-2 flex h-1 w-full overflow-hidden rounded bg-[#dde8f3]">
                  {section.items.map((item) => {
                    const itemPercent = sectionTotal > 0 ? (item.count / sectionTotal) * 100 : 0
                    return (
                      <span
                        key={`${section.title}-${item.label}-bar`}
                        className="h-full"
                        style={{ width: `${itemPercent}%`, backgroundColor: item.color }}
                        aria-hidden
                      />
                    )
                  })}
                </div>

                <h3 className="mb-3 text-[24px] font-bold leading-tight text-[#24384f]">{section.title}</h3>
                <div className="space-y-2">
                  {section.items.map((item) => (
                    <label
                      key={item.label}
                      className="flex cursor-pointer items-center justify-between gap-2 rounded-md px-1 py-1 text-[15px] text-[#5c7188] hover:bg-[#f2f7fb]"
                    >
                      <span className="flex items-center gap-2.5">
                        <input type="checkbox" className="h-4 w-4 rounded border-[#bfd0e1] accent-[#2c6fa8]" />
                        <span>{item.label}</span>
                      </span>
                      <span className="flex items-center gap-2">
                        <span className="text-[13px] tabular-nums text-[#7d92aa]">({item.count})</span>
                        <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} aria-hidden />
                      </span>
                    </label>
                  ))}
                </div>
              </section>
            )
          })}
        </div>
      </div>
    </aside>
  )
}

export default MapFiltersPanel
