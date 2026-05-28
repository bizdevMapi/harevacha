import { useId, useState } from 'react'
import { IconChevronDown, IconSearch } from '../../assets/icons'
import type { FilterItem, FilterSectionData } from './mapLayerFilters'

function DistributionBar({ items }: { items: FilterItem[] }) {
  const total = items.reduce((sum, item) => sum + item.count, 0)
  if (total === 0) return null

  return (
    <div
      className="flex h-1.5 w-full max-w-[312px] overflow-hidden rounded-full bg-[#cce1f5]"
      aria-hidden
    >
      {items.map((item) => {
        const widthPercent = (item.count / total) * 100
        if (widthPercent <= 0) return null
        return (
          <span
            key={item.label}
            className="h-full shrink-0 first:rounded-s-full last:rounded-e-full"
            style={{ width: `${widthPercent}%`, backgroundColor: item.color }}
          />
        )
      })}
    </div>
  )
}

function FilterListItem({
  item,
  checked,
  onChange,
}: {
  item: FilterItem
  checked: boolean
  onChange: (checked: boolean) => void
}) {
  const id = useId()

  return (
    <label
      htmlFor={id}
      className="flex cursor-pointer items-center justify-between border-b border-[#e0e5eb] p-2"
    >
      <div className="flex min-w-0 items-center gap-2">
        <span
          className="size-2 shrink-0 rounded-[2px]"
          style={{ backgroundColor: item.color }}
          aria-hidden
        />
        <span className="truncate text-sm leading-[18px] text-[#34404f]">{item.label}</span>
        <span className="shrink-0 text-xs leading-[18px] text-[#5f708a] tabular-nums">
          ({item.count})
        </span>
      </div>
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="size-5 shrink-0 cursor-pointer rounded border border-[#e0e5eb] bg-white accent-brand-darkBlue"
      />
    </label>
  )
}

function FilterSection({
  section,
  selectedKeys,
  onToggle,
}: {
  section: FilterSectionData
  selectedKeys: Set<string>
  onToggle: (key: string, checked: boolean) => void
}) {
  const sectionKey = (label: string) => `${section.title}::${label}`

  return (
    <section className="flex w-full flex-col items-end gap-3.5">
      <div className="flex w-full max-w-[312px] flex-col items-end gap-2.5">
        <h3
          className={`w-full text-right text-base font-bold leading-5 ${section.titleClassName ?? 'text-[#084878]'}`}
        >
          {section.title}
        </h3>
        <DistributionBar items={section.items} />
      </div>
      <div className="w-full max-w-[312px]">
        {section.items.map((item) => {
          const key = sectionKey(item.label)
          return (
            <FilterListItem
              key={key}
              item={item}
              checked={selectedKeys.has(key)}
              onChange={(checked) => onToggle(key, checked)}
            />
          )
        })}
      </div>
    </section>
  )
}

type MapFiltersPanelProps = {
  isOpen: boolean
  onToggle: () => void
  hideToggle?: boolean
  searchQuery?: string
  onSearchQueryChange?: (value: string) => void
  onSearchSubmit?: (value: string) => void
  filterSections?: FilterSectionData[]
  filtersLoading?: boolean
  onFilterSelectionChange?: (selectedKeys: Set<string>) => void
  selectedKeys?: Set<string>
}

const MapFiltersPanel = ({
  isOpen,
  onToggle,
  hideToggle = false,
  searchQuery: controlledSearchQuery,
  onSearchQueryChange,
  onSearchSubmit,
  filterSections = [],
  filtersLoading = false,
  onFilterSelectionChange,
  selectedKeys: controlledSelectedKeys,
}: MapFiltersPanelProps) => {
  const searchId = useId()
  const [internalSearchQuery, setInternalSearchQuery] = useState('')
  const searchQuery = controlledSearchQuery ?? internalSearchQuery
  const setSearchQuery = onSearchQueryChange ?? setInternalSearchQuery
  const [internalSelectedKeys, setInternalSelectedKeys] = useState<Set<string>>(() => new Set())
  const selectedKeys = controlledSelectedKeys ?? internalSelectedKeys
  const setSelectedKeys = onFilterSelectionChange ?? setInternalSelectedKeys

  const handleClear = () => {
    setSearchQuery('')
    const next = new Set<string>()
    setSelectedKeys(next)
  }

  const handleToggle = (key: string, checked: boolean) => {
    const next = new Set(selectedKeys)
    if (checked) next.add(key)
    else next.delete(key)
    setSelectedKeys(next)
  }

  const toggleButton = hideToggle ? null : (
    <button
      type="button"
      onClick={onToggle}
      className={`absolute top-0 z-30 flex size-6 items-center justify-center rounded-bl-[4px] rounded-br-[11px] border border-b border-l border-[#cbd5e3] bg-[#fafbfd] py-0.5 text-brand-darkBlue shadow-[-2px_1px_1.5px_rgba(121,136,157,0.2)] transition-colors hover:bg-white ${
        isOpen ? 'left-0' : 'right-0'
      }`}
      aria-label={isOpen ? 'סגירת פנל סינון' : 'פתיחת פנל סינון'}
      title={isOpen ? 'סגירת פנל סינון' : 'פתיחת פנל סינון'}
    >
      <span className={`inline-flex transition-transform ${isOpen ? '-rotate-90' : 'rotate-90'}`}>
        <IconChevronDown className="size-5" />
      </span>
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
    <aside
      dir="rtl"
      className="relative h-full w-[376px] max-w-[min(100vw,376px)] shrink-0 border-l border-[#e0e5eb] bg-[#f5f8fc]"
    >
      {toggleButton}
      <div className="flex h-full flex-col gap-[26px] overflow-y-auto px-8 pb-6 pt-7">
        <div className="flex w-full max-w-[312px] flex-col gap-8">
          {/* כותרת + חיפוש */}
          <div className="flex w-full flex-col gap-4">
            <div className="flex w-full items-center justify-between">
              <h2 className="text-lg font-bold leading-5 text-[#161a20]">סינון מענים</h2>
              <button
                type="button"
                onClick={handleClear}
                className="text-sm font-bold leading-5 text-brand-darkBlue underline decoration-solid underline-offset-2 hover:text-[#0f62a8]"
              >
                ניקוי
              </button>
            </div>

            <div className="flex h-12 w-full items-center gap-2 border-b border-[#cbd5e3] px-1 py-3">
              <input
                id={searchId}
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key !== 'Enter') return
                  e.preventDefault()
                  onSearchSubmit?.(searchQuery)
                }}
                placeholder="איתור מענה לפי שם או כתובת"
                className="min-w-0 flex-1 border-0 bg-transparent text-base leading-6 text-[#161a20] placeholder:text-[#8695a7] focus:outline-none"
              />
              <span className="shrink-0 text-[#5f708a]">
                <IconSearch />
              </span>
            </div>
          </div>

          {/* קטגוריות סינון */}
          <div className="flex flex-col gap-8">
            {filtersLoading && filterSections.length === 0 ? (
              <p className="text-right text-sm text-[#5f708a]">טוען אפשרויות סינון…</p>
            ) : null}
            {!filtersLoading && filterSections.length === 0 ? (
              <p className="text-right text-sm text-[#5f708a]">אין אפשרויות סינון זמינות</p>
            ) : null}
            {filterSections.map((section) => (
              <FilterSection
                key={section.title}
                section={section}
                selectedKeys={selectedKeys}
                onToggle={handleToggle}
              />
            ))}
          </div>
        </div>
      </div>
    </aside>
  )
}

export default MapFiltersPanel
