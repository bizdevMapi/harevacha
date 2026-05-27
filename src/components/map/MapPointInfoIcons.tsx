import type { MapPointInfoIconId } from './mapPointInfoData'

const iconClass = 'size-5 shrink-0 text-[#a4b1c0]'

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
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8.66671 7.33268C8.66671 5.85992 7.47277 4.66602 6.00004 4.66602C4.52728 4.66602 3.33337 5.85992 3.33337 7.33268C3.33337 8.80542 4.52728 9.99935 6.00004 9.99935C7.47277 9.99935 8.66671 8.80542 8.66671 7.33268Z" stroke="#A4B1C0" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
      <path d="M7.35911 5.03849C7.34211 4.91698 7.33337 4.79285 7.33337 4.66667C7.33337 3.19391 8.52731 2 10 2C11.4728 2 12.6667 3.19391 12.6667 4.66667C12.6667 6.13943 11.4728 7.33333 10 7.33333C9.50364 7.33333 9.03897 7.19773 8.64097 6.96153" stroke="#A4B1C0" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
      <path d="M10 14C10 11.7909 8.20913 10 6 10C3.79086 10 2 11.7909 2 14" stroke="#A4B1C0" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
      <path d="M14 11.334C14 9.12485 12.2091 7.33398 10 7.33398" stroke="#A4B1C0" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
    </svg>

  )
}

function IconLanguage() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M1.88928 11.6673L3.71888 4.80636C3.79315 4.5278 4.04543 4.33398 4.33373 4.33398C4.62202 4.33398 4.8743 4.5278 4.94859 4.80636L6.77817 11.6673M3.1115 9.22287H5.55595" stroke="#A4B1C0" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
      <path d="M12.2773 4.33398H10.444V8.00065H12.2773C13.2898 8.00065 14.1106 7.17981 14.1106 6.16732C14.1106 5.15479 13.2898 4.33398 12.2773 4.33398Z" stroke="#A4B1C0" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
      <path d="M12.2773 8H10.444V11.6667H12.2773C13.2898 11.6667 14.1106 10.8458 14.1106 9.83333C14.1106 8.82084 13.2898 8 12.2773 8Z" stroke="#A4B1C0" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
    </svg>



  )
}

function IconTarget() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M11.3333 7.99935C11.3333 9.84028 9.84089 11.3327 7.99996 11.3327C6.15901 11.3327 4.66663 9.84028 4.66663 7.99935C4.66663 6.1584 6.15901 4.66602 7.99996 4.66602" stroke="#A4B1C0" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
      <path d="M9.33337 1.46734C8.90257 1.37989 8.45664 1.33398 8.00004 1.33398C4.31814 1.33398 1.33337 4.31875 1.33337 8.00065C1.33337 11.6825 4.31814 14.6673 8.00004 14.6673C11.6819 14.6673 14.6667 11.6825 14.6667 8.00065C14.6667 7.54405 14.6208 7.09812 14.5334 6.66732" stroke="#A4B1C0" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
      <path d="M10.6667 5.333V3.333L12.6579 1.3418C12.6616 1.33804 12.6681 1.33999 12.6691 1.34521L12.9991 2.9953C12.9997 2.99794 13.0017 3.00001 13.0043 3.00054L14.6545 3.33056C14.6597 3.3316 14.6616 3.33804 14.6579 3.3418L12.6686 5.33104C12.6674 5.3323 12.6657 5.333 12.6639 5.333H10.6667ZM10.6667 5.333L8 7.99966" stroke="#A4B1C0" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
    </svg>


  )
}

function IconPrice() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2.66663 12.6673V3.33398H5.33329C7.54243 3.33398 9.33329 5.12485 9.33329 7.33398V9.33398" stroke="#A4B1C0" stroke-width="1.5" />
      <path d="M12.6666 3.33268L12.6666 12.666L9.99996 12.666C7.79082 12.666 5.99996 10.8752 5.99996 8.66601L5.99996 6.66602" stroke="#A4B1C0" stroke-width="1.5" />
    </svg>


  )
}

function IconBuilding() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M1.33337 14.666H14.6667" stroke="#A4B1C0" stroke-width="1.5" stroke-linecap="round" />
      <path d="M12 6H9.33337C7.67871 6 7.33337 6.34533 7.33337 8V14.6667H14V8C14 6.34533 13.6547 6 12 6Z" stroke="#A4B1C0" stroke-width="1.5" stroke-linejoin="round" />
      <path d="M10 14.6673H2V3.33398C2 1.67932 2.34533 1.33398 4 1.33398H8C9.65467 1.33398 10 1.67932 10 3.33398V6.00065" stroke="#A4B1C0" stroke-width="1.5" stroke-linejoin="round" />
      <path d="M2 4H4M2 6.66667H4M2 9.33333H4" stroke="#A4B1C0" stroke-width="1.5" stroke-linecap="round" />
      <path d="M10 8.66602H11.3333M10 10.666H11.3333" stroke="#A4B1C0" stroke-width="1.5" stroke-linecap="round" />
      <path d="M10.6666 14.666V12.666" stroke="#A4B1C0" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
    </svg>



  )
}

function IconAccessibility() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8.00004 14.6673C11.6819 14.6673 14.6667 11.6825 14.6667 8.00065C14.6667 4.31875 11.6819 1.33398 8.00004 1.33398C4.31814 1.33398 1.33337 4.31875 1.33337 8.00065C1.33337 11.6825 4.31814 14.6673 8.00004 14.6673Z" stroke="#A4B1C0" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
      <path d="M8 5C8.27613 5 8.5 4.77614 8.5 4.5C8.5 4.22386 8.27613 4 8 4M8 5C7.72387 5 7.5 4.77614 7.5 4.5C7.5 4.22386 7.72387 4 8 4M8 5V4" stroke="#A4B1C0" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
      <path d="M10.6667 6C9.97944 6.41239 9.03824 6.66667 8.00004 6.66667C6.96184 6.66667 6.02061 6.41239 5.33337 6" stroke="#A4B1C0" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
      <path d="M8.66663 9.33268L9.33329 11.9993M8.66663 9.33268V6.66602M8.66663 9.33268H7.99996M7.99996 9.33268H7.33329M7.99996 9.33268V6.66602M6.66663 11.9993L7.33329 9.33268M7.33329 9.33268V6.66602" stroke="#A4B1C0" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
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
