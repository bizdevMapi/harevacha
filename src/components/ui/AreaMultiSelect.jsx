import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react'
import { IconChevronDown, IconSearch } from '../../assets/icons'
import Tooltip from './Tooltip'

const triggerBaseClass = [
  'flex min-h-12 w-full cursor-pointer items-center appearance-none rounded-xl',
  'bg-white py-2.5 pl-10 pr-11 text-[18px]',
].join(' ')

function getSelectedCountLabel(count) {
  if (count === 1) return 'נבחרה שכונה אחת'
  return `נבחרו ${count} שכונות`
}

/**
 * סלקט "אזור" — תפריט נפתח עם אפשרות למתג ל"בחירה מרובה" (צ'קבוקסים).
 * במצב רגיל (המתג כבוי) ההתנהגות זהה לסלקט נייטיבי: קליק על פריט בוחר אותו וסוגר.
 */
export default function AreaMultiSelect({
  label,
  selectedValues,
  onChange,
  options,
  /** היעד של «נקה הכל» — הבחירה לא יורדת לאפס אזורים */
  defaultValues,
  rightIcon,
  className = '',
  tooltip,
  tooltipPosition = 'bottom',
  tooltipOffset = 8,
}) {
  const id = useId()
  const searchId = useId()
  const containerRef = useRef(null)
  const [isOpen, setIsOpen] = useState(false)
  const [isMultiMode, setIsMultiMode] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const closeMenu = useCallback(() => {
    setIsOpen(false)
    setSearchQuery('')
  }, [])

  useEffect(() => {
    if (!isOpen) return
    const handleOutsideClick = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        closeMenu()
      }
    }
    document.addEventListener('mousedown', handleOutsideClick)
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [isOpen, closeMenu])

  const filteredOptions = useMemo(() => {
    const query = searchQuery.trim()
    if (!query) return options
    return options.filter((option) => option.label.includes(query))
  }, [options, searchQuery])

  const selectedOptions = options.filter((option) => selectedValues.includes(option.value))
  const triggerLabel =
    selectedOptions.length > 1
      ? `נבחרו ${selectedOptions.length} שכונות`
      : selectedOptions[0]?.label ?? ''

  const selectSingle = (value) => {
    onChange([value])
    closeMenu()
  }

  const toggleValue = (value, checked) => {
    if (checked) {
      onChange([...selectedValues, value])
      return
    }
    if (selectedValues.length <= 1) return
    onChange(selectedValues.filter((v) => v !== value))
  }

  const handleMultiModeToggle = () => {
    const next = !isMultiMode
    setIsMultiMode(next)
    if (!next && selectedValues.length > 1) {
      onChange([selectedValues[0]])
    }
  }

  const handleClearAll = () => {
    if (defaultValues?.length) {
      onChange(defaultValues)
      return
    }
    // בלי ברירת מחדל — משאירים את הבחירה הראשונה, כדי לא להישאר בלי אזור נבחר
    onChange(selectedValues.slice(0, 1))
  }

  return (
    <div ref={containerRef} className={`relative shrink-0 ${className}`.trim()}>
      <span
        className="pointer-events-none absolute right-3 top-1 z-20 flex -translate-y-1/2 items-center gap-1 rounded bg-brand-darkBlue px-1.5 text-[12px] leading-tight text-white"
        style={{ textShadow: '0 1px 0 rgba(0,0,0,0.12)' }}
      >
        <span>{label}</span>
        {tooltip && (
          <span className="pointer-events-auto relative inline-block">
            <Tooltip content={tooltip} position={tooltipPosition} offset={tooltipOffset} useAbsolute={true} />
          </span>
        )}
      </span>
      <div className="relative">
        <button
          id={id}
          type="button"
          onClick={() => (isOpen ? closeMenu() : setIsOpen(true))}
          aria-expanded={isOpen}
          className={`${triggerBaseClass} text-right`.trim()}
        >
          <span className="truncate">{triggerLabel}</span>
        </button>
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 opacity-80">{rightIcon}</span>
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 opacity-90">
          <IconChevronDown />
        </span>
      </div>

      {isOpen && (
        <div
          dir="rtl"
          className="absolute right-0 top-full z-30 mt-2 w-full min-w-[260px] overflow-hidden rounded-xl border border-[#e0e5eb] bg-white shadow-lg"
        >
          <div className="flex h-11 w-full items-center gap-2 border-b border-[#e0e5eb] px-3">
            <input
              id={searchId}
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="חיפוש שכונה"
              className="min-w-0 flex-1 border-0 bg-transparent text-sm text-[#34404f] placeholder:text-[#8695a7] focus:outline-none"
            />
            <span className="shrink-0 text-[#8695a7]">
              <IconSearch />
            </span>
          </div>
          <div className="flex items-center justify-between border-b border-[#e0e5eb] px-3 py-2.5">
            <span className="text-sm font-semibold leading-[18px] text-[#34404f]">בחירה מרובה</span>
            <button
              type="button"
              role="switch"
              aria-checked={isMultiMode}
              onClick={handleMultiModeToggle}
              className={`relative h-5 w-9 shrink-0 rounded-full transition-colors ${isMultiMode ? 'bg-brand-darkBlue' : 'bg-[#d5dbe3]'
                }`}
            >
              <span
                className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all ${isMultiMode ? 'left-0.5' : 'right-0.5'
                  }`}
              />
            </button>
          </div>
          {isMultiMode && (
            <div className="flex items-center justify-between border-b border-[#e0e5eb] px-3 py-2">
              <span className="text-sm text-[#8695a7]">{getSelectedCountLabel(selectedOptions.length)}</span>
              <button
                type="button"
                onClick={handleClearAll}
                className="text-sm font-semibold text-brand-darkBlue hover:underline"
              >
                נקה הכל
              </button>
            </div>
          )}
          <div className="max-h-[320px] overflow-y-auto">
            {filteredOptions.length === 0 && (
              <p className="px-3 py-3 text-center text-sm text-[#8695a7]">לא נמצאו תוצאות</p>
            )}
            {filteredOptions.map((option) => {
              const checked = selectedValues.includes(option.value)
              if (!isMultiMode) {
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => selectSingle(option.value)}
                    className={`flex w-full items-center justify-start px-3 py-3 text-right text-sm hover:bg-[#f0f4f8] ${checked ? 'font-bold text-brand-darkBlue' : 'text-[#34404f]'
                      }`}
                  >
                    {option.label}
                  </button>
                )
              }
              return (
                <label
                  key={option.value}
                  className="flex cursor-pointer items-center justify-between px-3 py-3 hover:bg-[#f0f4f8]"
                >
                  <span className={`truncate text-sm text-[#34404f] ${checked ? 'font-bold' : ''}`.trim()}>
                    {option.label}
                  </span>
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={(e) => toggleValue(option.value, e.target.checked)}
                    className="size-5 shrink-0 cursor-pointer rounded border border-[#e0e5eb] bg-white accent-brand-darkBlue"
                  />
                </label>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
