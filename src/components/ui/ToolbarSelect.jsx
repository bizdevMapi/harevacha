import { useId } from 'react'

const selectBaseClass = [
  'h-11 min-h-11 cursor-pointer appearance-none rounded-xl border border-slate-200/90',
  'bg-white py-2 pl-10 pr-11 text-[13px] font-semibold text-slate-900',
  'shadow-toolbarField outline-none transition-shadow duration-150',
  'hover:border-slate-300 hover:shadow-md',
  'focus:border-white focus:ring-2 focus:ring-white/95 focus:ring-offset-2 focus:ring-offset-brand-toolbarBar',
].join(' ')


export default function ToolbarSelect({
  label,
  value,
  onChange,
  options,
  leftIcon,
  rightIcon,
  className = '',
}) {
  const id = useId()

  return (
    <div className="relative pt-3">
      <span
        className="pointer-events-none absolute right-3 top-[14px] z-20 -translate-y-1/2 rounded bg-brand-toolbarBar px-1.5 text-[11px] font-bold leading-tight text-white"
        style={{ textShadow: '0 1px 0 rgba(0,0,0,0.12)' }}
      >
        {label}
      </span>
      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={onChange}
          className={`${selectBaseClass} ${className}`.trim()}
        >
          {options?.map(({ value: optValue, label: optLabel }) => (
            <option key={optValue} value={optValue}>
              {optLabel}
            </option>
          ))}
        </select>
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 opacity-80">{leftIcon}</span>
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 opacity-90">{rightIcon}</span>
      </div>
    </div>
  )
}
