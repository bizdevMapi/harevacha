import type { MapPointInfoIconId } from './mapPointInfoData'

const iconClass = 'size-5 shrink-0 text-[#5f708a]'

function IconLocation() {
  return (
    <svg className={iconClass} viewBox="0 0 20 20" fill="none" aria-hidden>
      <path
        d="M10 11.25a2.25 2.25 0 1 0 0-4.5 2.25 2.25 0 0 0 0 4.5Z"
        stroke="currentColor"
        strokeWidth="1.25"
      />
      <path
        d="M10 2.5c-2.9 0-5.25 2.2-5.25 5.5 0 3.9 5.25 9.5 5.25 9.5s5.25-5.6 5.25-9.5C15.25 4.7 12.9 2.5 10 2.5Z"
        stroke="currentColor"
        strokeWidth="1.25"
      />
    </svg>
  )
}

function IconPhone() {
  return (
    <svg className={iconClass} viewBox="0 0 20 20" fill="none" aria-hidden>
      <path
        d="M6.5 3.5h2l1 3-1.5 1a9 9 0 0 0 4 4l1-1.5 3 1v2a1.5 1.5 0 0 1-1.5 1.5C8.8 14 6 11.2 6 7A1.5 1.5 0 0 1 6.5 3.5Z"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function IconClock() {
  return (
    <svg className={iconClass} viewBox="0 0 20 20" fill="none" aria-hidden>
      <circle cx="10" cy="10" r="6.75" stroke="currentColor" strokeWidth="1.25" />
      <path d="M10 6.5V10l2.5 1.5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
    </svg>
  )
}

function IconGroup() {
  return (
    <svg className={iconClass} viewBox="0 0 20 20" fill="none" aria-hidden>
      <circle cx="7" cy="7.5" r="2.25" stroke="currentColor" strokeWidth="1.1" />
      <circle cx="13.5" cy="8" r="2" stroke="currentColor" strokeWidth="1.1" />
      <path
        d="M3.5 15c.6-2 2.4-3.25 4.5-3.25M12 15c.5-1.8 2-3 3.75-3"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinecap="round"
      />
    </svg>
  )
}

function IconLanguage() {
  return (
    <svg className={iconClass} viewBox="0 0 20 20" fill="none" aria-hidden>
      <path d="M4 5.5h5M6.5 5.5V14" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
      <path
        d="M11.5 8.5c1.2 0 2 .9 2 2.1 0 2.2-1.6 3.4-3.5 3.4"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinecap="round"
      />
      <path d="M11 5.5h4.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
    </svg>
  )
}

function IconTarget() {
  return (
    <svg className={iconClass} viewBox="0 0 20 20" fill="none" aria-hidden>
      <circle cx="10" cy="10" r="6.25" stroke="currentColor" strokeWidth="1.1" />
      <circle cx="10" cy="10" r="2.25" stroke="currentColor" strokeWidth="1.1" />
      <path d="M10 3.5V5M10 15v1.5M3.5 10H5M15 10h1.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
    </svg>
  )
}

function IconPrice() {
  return (
    <svg className={iconClass} viewBox="0 0 20 20" fill="none" aria-hidden>
      <path
        d="M6.5 5.5c0-1.1.9-2 2-2h1c1.7 0 3 1.1 3 2.5S11.2 8.5 9.5 8.5H8c-1.1 0-2 .9-2 2v.5c0 1.1.9 2 2 2h1.5c1.7 0 3 1.1 3 2.5s-1.3 2.5-3 2.5h-1c-1.1 0-2-.9-2-2"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinecap="round"
      />
      <path d="M10 4v12" stroke="currentColor" strokeWidth="1.1" />
    </svg>
  )
}

function IconBuilding() {
  return (
    <svg className={iconClass} viewBox="0 0 20 20" fill="none" aria-hidden>
      <path d="M4 16.5V8l6-3.5 6 3.5v8.5" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round" />
      <path d="M8 16.5v-4h4v4M4 16.5h12" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
    </svg>
  )
}

function IconAccessibility() {
  return (
    <svg className={iconClass} viewBox="0 0 20 20" fill="none" aria-hidden>
      <circle cx="10" cy="4.25" r="1.1" fill="currentColor" />
      <path
        d="M7 7.5h6l-1.25 3H9.25L8.5 16.5M6 16.5h8"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="10" cy="10" r="7.25" stroke="currentColor" strokeWidth="1.1" />
    </svg>
  )
}

function IconMapPinLarge() {
  return (
    <svg className="size-9 text-brand-darkBlue" viewBox="0 0 36 36" fill="none" aria-hidden>
      <path
        d="M18 4.5c-4.7 0-8.5 3.6-8.5 8.25 0 6.1 8.5 14.25 8.5 14.25s8.5-8.15 8.5-14.25C26.5 8.1 22.7 4.5 18 4.5Z"
        fill="currentColor"
        fillOpacity="0.15"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <circle cx="18" cy="12.75" r="2.75" fill="currentColor" />
    </svg>
  )
}

function IconExpand() {
  return (
    <svg className="size-5 text-[#34404f]" viewBox="0 0 20 20" fill="none" aria-hidden>
      <path d="M11 4h5v5M4 16V11h5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
      <path d="M16 4 9 11M4 16l7-7" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
    </svg>
  )
}

function IconClose() {
  return (
    <svg className="size-6 text-[#34404f]" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

export function MapPointInfoIcon({ icon }: { icon: MapPointInfoIconId }) {
  switch (icon) {
    case 'location':
      return <IconLocation />
    case 'phone':
      return <IconPhone />
    case 'clock':
      return <IconClock />
    case 'group':
      return <IconGroup />
    case 'language':
      return <IconLanguage />
    case 'target':
      return <IconTarget />
    case 'price':
      return <IconPrice />
    case 'building':
      return <IconBuilding />
    case 'accessibility':
      return <IconAccessibility />
    default:
      return <IconLocation />
  }
}

export { IconClose, IconExpand, IconMapPinLarge }
