import { useId } from 'react'
import { IconChevronDown } from '../../assets/icons'

const selectBaseClass = [
  'min-h-12 cursor-pointer appearance-none rounded-xl',
  'bg-white py-2.5 pl-10 pr-11 text-[18px]',
  // 'shadow-toolbarField outline-none transition-shadow duration-150',
  // 'hover:border-slate-300 hover:shadow-md',
  // 'focus:border-white focus:ring-2 focus:ring-white/95 focus:ring-offset-2 focus:ring-offset-brand-darkBlue',
].join(' ')


export default function ToolbarSelect({
  label,
  value,
  onChange,
  options,
  rightIcon,
  className = '',
}) {
  const id = useId()

  return (
    <div className="relative">
      <span
        className="pointer-events-none absolute right-3 top-1 z-20 -translate-y-1/2 rounded bg-brand-darkBlue px-1.5 text-[12px] leading-tight text-white"
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
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 opacity-80">{rightIcon}</span>
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 opacity-90"><IconChevronDown /></span>
      </div>
    </div>
  )
}
