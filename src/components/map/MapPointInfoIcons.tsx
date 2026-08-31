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

function IconLink() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6.66667 8.66732C6.95467 9.04965 7.31867 9.36465 7.73467 9.59065C8.15067 9.81665 8.608 9.94865 9.078 9.97865C9.548 10.0087 10.0193 9.93598 10.46 9.76465C10.9007 9.59332 11.3013 9.32732 11.6333 8.98532L13.3 7.31865C13.8728 6.72192 14.1901 5.92421 14.1813 5.09688C14.1725 4.26955 13.8383 3.47841 13.253 2.89312C12.6677 2.30783 11.8765 1.97363 11.0492 1.96481C10.2219 1.956 9.42418 2.27327 8.82733 2.84599L7.75067 3.91732" stroke="#A4B1C0" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
      <path d="M9.33333 7.33268C9.04533 6.95035 8.68133 6.63535 8.26533 6.40935C7.84933 6.18335 7.392 6.05135 6.922 6.02135C6.452 5.99135 5.98067 6.06402 5.54 6.23535C5.09933 6.40668 4.69867 6.67268 4.36667 7.01468L2.7 8.68135C2.12728 9.27808 1.80995 10.0758 1.81877 10.9031C1.82758 11.7304 2.16178 12.5216 2.74707 13.1069C3.33236 13.6922 4.1235 14.0264 4.95083 14.0352C5.77816 14.044 6.57587 13.7267 7.17267 13.154L8.24333 12.0827" stroke="#A4B1C0" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
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
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M15.8333 9.99935V7.49932C15.8333 5.92797 15.8333 5.14231 15.3452 4.65416C14.857 4.16601 14.0713 4.16601 12.5 4.16602L10 4.16602" stroke="#A4B1C0" stroke-width="1.5" stroke-miterlimit="16" stroke-linecap="round" stroke-linejoin="round" />
      <path d="M4.16675 10L4.16677 12.5C4.16678 14.0713 4.16679 14.857 4.65495 15.3452C5.14311 15.8333 5.92877 15.8333 7.50011 15.8333H10.0001" stroke="#A4B1C0" stroke-width="1.5" stroke-miterlimit="16" stroke-linecap="round" stroke-linejoin="round" />
    </svg>

  )
}

function IconBack() {
  return (
    <svg className="size-5 text-[#34404f]" viewBox="0 0 20 20" fill="none" aria-hidden>
      <path d="M7.5 5l6 5-6 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function IconChevronLeft() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path d="M10 3.5 5.5 8l4.5 4.5" stroke="#5F708A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function IconChevronRight() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path d="M6 3.5 10.5 8 6 12.5" stroke="#5F708A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
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

function IconReport() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M11.0779 1.10938V3.17636M4.87695 1.10938V3.17636M7.97743 1.10938V3.17636" stroke="#084878" stroke-linecap="round" stroke-linejoin="round" />
      <path d="M13.4897 8.00098V6.96749C13.4897 4.69393 13.4897 3.55714 12.7834 2.85083C12.0771 2.14453 10.9403 2.14453 8.66677 2.14453H7.28878C5.01522 2.14453 3.87843 2.14453 3.17213 2.85084C2.46582 3.55714 2.46582 4.69393 2.46582 6.96749V10.068C2.46582 12.3415 2.46582 13.4783 3.17213 14.1846C3.87843 14.8909 5.01522 14.8909 7.28878 14.8909H7.97777" stroke="#084878" stroke-linecap="round" stroke-linejoin="round" />
      <path d="M5.22217 10.0665H7.97814M5.22217 7.31055H10.7341" stroke="#084878" stroke-linecap="round" stroke-linejoin="round" />
      <path d="M11.241 14.6501L10.0444 14.8893L10.2837 13.6928C10.3324 13.4498 10.4518 13.2265 10.627 13.0513L13.4282 10.2502C13.6732 10.0051 14.0707 10.0051 14.3159 10.2502L14.6836 10.6179C14.9286 10.8631 14.9286 11.2606 14.6836 11.5056L11.8825 14.3067C11.7073 14.4819 11.484 14.6014 11.241 14.6501Z" stroke="#084878" stroke-linecap="round" stroke-linejoin="round" />
    </svg>

  )
}

function IconInfo() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <circle cx="8" cy="8" r="6.25" stroke="#A4B1C0" strokeWidth="1.25" />
      <path d="M8 7.333V11M8 5.333h.007" stroke="#A4B1C0" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function IconSparkle() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M1.34619 8.10463C4.29401 8.10463 7.24183 5.15681 7.24183 2.20898C7.24183 5.15681 10.1897 8.10463 13.1375 8.10463C10.1897 8.10463 7.24183 11.0524 7.24183 14.0003C7.24183 11.0524 4.29401 8.10463 1.34619 8.10463Z" stroke="#1277C5" stroke-linejoin="round" />
      <path d="M10.6982 3.22005C11.476 3.22005 13.0316 1.6645 13.0316 0.886719C13.0316 1.6645 14.5871 3.22005 15.3649 3.22005C14.5871 3.22005 13.0316 4.77561 13.0316 5.55339C13.0316 4.77561 11.476 3.22005 10.6982 3.22005Z" fill="#1277C5" />
    </svg>

  )
}

function IconSend() {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path
        d="M17.5 2.5 9.167 10.833M17.5 2.5l-5.833 15-3.334-6.667L1.667 7.5 17.5 2.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function IconBuildingGov() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M14 0.412109C21.5046 0.412109 27.5879 6.49542 27.5879 14C27.5879 21.5046 21.5046 27.5879 14 27.5879C6.49542 27.5879 0.412109 21.5046 0.412109 14C0.412109 6.49542 6.49542 0.412109 14 0.412109Z" fill="#1095DD" stroke="white" stroke-width="0.823529" />
      <g clip-path="url(#clip0_22939_60113)">
        <path d="M11.5464 23.4167L10.1332 22.6092L12.5558 18.4102L11.183 17.6027L9.97173 19.7022L8.55859 18.8947L12.7173 11.7079C12.2058 11.183 11.8223 10.5841 11.5666 9.91116C11.3108 9.23824 11.183 8.54513 11.183 7.83183C11.183 7.34733 11.2436 6.86632 11.3647 6.38882C11.4858 5.91131 11.681 5.45022 11.9501 5.00556L13.3229 5.81306C13.1345 6.12261 12.9999 6.44238 12.9191 6.77238C12.8384 7.10238 12.798 7.44207 12.798 7.79146C12.798 8.50475 12.973 9.17445 13.3229 9.80053C13.6728 10.4266 14.1708 10.9278 14.8168 11.3041L16.6337 12.3539C17.4681 12.8384 18.0805 13.535 18.4707 14.4437C18.861 15.3524 19.0562 16.2035 19.0562 16.997C19.0562 17.5085 18.9889 18.0064 18.8543 18.4909C18.7197 18.9754 18.5313 19.433 18.2891 19.8637L16.8759 19.0562C17.0643 18.7332 17.1989 18.4035 17.2797 18.067C17.3604 17.7305 17.4008 17.3873 17.4008 17.0374C17.4008 16.6067 17.3402 16.1895 17.2191 15.7858C17.098 15.382 16.9028 15.0052 16.6337 14.6553L11.5464 23.4167ZM17.0374 11.3849C16.5933 11.3849 16.2132 11.2269 15.8972 10.9109C15.5812 10.5949 15.4229 10.2145 15.4224 9.76985C15.4219 9.32518 15.5801 8.94512 15.8972 8.62965C16.2143 8.31418 16.5944 8.15591 17.0374 8.15483C17.4805 8.15376 17.8608 8.31203 18.1784 8.62965C18.4961 8.94727 18.6541 9.32734 18.6524 9.76985C18.6508 10.2124 18.4928 10.5927 18.1784 10.9109C17.864 11.229 17.4837 11.387 17.0374 11.3849ZM15.0187 7.34733C14.6687 7.34733 14.3794 7.2262 14.1506 6.98395C13.9218 6.7417 13.8074 6.45907 13.8074 6.13607C13.8074 5.78615 13.9285 5.49679 14.1708 5.268C14.413 5.0392 14.6957 4.9248 15.0187 4.9248C15.3686 4.9248 15.6579 5.04593 15.8867 5.28818C16.1155 5.53044 16.2299 5.81306 16.2299 6.13607C16.2299 6.48599 16.1088 6.77534 15.8665 7.00414C15.6243 7.23293 15.3417 7.34733 15.0187 7.34733Z" fill="white" />
      </g>
      <defs>
        <clipPath id="clip0_22939_60113">
          <rect width="19.3802" height="19.3802" fill="white" transform="translate(4.11719 4.11719)" />
        </clipPath>
      </defs>
    </svg>

  )
}

function IconBuildingPrivate() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M14 0.412109C21.5046 0.412109 27.5879 6.49542 27.5879 14C27.5879 21.5046 21.5046 27.5879 14 27.5879C6.49542 27.5879 0.412109 21.5046 0.412109 14C0.412109 6.49542 6.49542 0.412109 14 0.412109Z" fill="#C44DEF" stroke="white" stroke-width="0.823529" />
      <g clip-path="url(#clip0_22939_60107)">
        <path d="M11.5464 23.4167L10.1332 22.6092L12.5558 18.4102L11.183 17.6027L9.97173 19.7022L8.55859 18.8947L12.7173 11.7079C12.2058 11.183 11.8223 10.5841 11.5666 9.91116C11.3108 9.23824 11.183 8.54513 11.183 7.83183C11.183 7.34733 11.2436 6.86632 11.3647 6.38882C11.4858 5.91131 11.681 5.45022 11.9501 5.00556L13.3229 5.81306C13.1345 6.12261 12.9999 6.44238 12.9191 6.77238C12.8384 7.10238 12.798 7.44207 12.798 7.79146C12.798 8.50475 12.973 9.17445 13.3229 9.80053C13.6728 10.4266 14.1708 10.9278 14.8168 11.3041L16.6337 12.3539C17.4681 12.8384 18.0805 13.535 18.4707 14.4437C18.861 15.3524 19.0562 16.2035 19.0562 16.997C19.0562 17.5085 18.9889 18.0064 18.8543 18.4909C18.7197 18.9754 18.5313 19.433 18.2891 19.8637L16.8759 19.0562C17.0643 18.7332 17.1989 18.4035 17.2797 18.067C17.3604 17.7305 17.4008 17.3873 17.4008 17.0374C17.4008 16.6067 17.3402 16.1895 17.2191 15.7858C17.098 15.382 16.9028 15.0052 16.6337 14.6553L11.5464 23.4167ZM17.0374 11.3849C16.5933 11.3849 16.2132 11.2269 15.8972 10.9109C15.5812 10.5949 15.4229 10.2145 15.4224 9.76985C15.4219 9.32518 15.5801 8.94512 15.8972 8.62965C16.2143 8.31418 16.5944 8.15591 17.0374 8.15483C17.4805 8.15376 17.8608 8.31203 18.1784 8.62965C18.4961 8.94727 18.6541 9.32734 18.6524 9.76985C18.6508 10.2124 18.4928 10.5927 18.1784 10.9109C17.864 11.229 17.4837 11.387 17.0374 11.3849ZM15.0187 7.34733C14.6687 7.34733 14.3794 7.2262 14.1506 6.98395C13.9218 6.7417 13.8074 6.45907 13.8074 6.13607C13.8074 5.78615 13.9285 5.49679 14.1708 5.268C14.413 5.0392 14.6957 4.9248 15.0187 4.9248C15.3686 4.9248 15.6579 5.04593 15.8867 5.28818C16.1155 5.53044 16.2299 5.81306 16.2299 6.13607C16.2299 6.48599 16.1088 6.77534 15.8665 7.00414C15.6243 7.23293 15.3417 7.34733 15.0187 7.34733Z" fill="white" />
      </g>
      <defs>
        <clipPath id="clip0_22939_60107">
          <rect width="19.3802" height="19.3802" fill="white" transform="translate(4.11719 4.11719)" />
        </clipPath>
      </defs>
    </svg>

  )
}

function IconBuildingNonprofit() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M14 0.412109C21.5046 0.412109 27.5879 6.49542 27.5879 14C27.5879 21.5046 21.5046 27.5879 14 27.5879C6.49542 27.5879 0.412109 21.5046 0.412109 14C0.412109 6.49542 6.49542 0.412109 14 0.412109Z" fill="#E47D23" stroke="white" stroke-width="0.823529" />
      <g clip-path="url(#clip0_22939_60110)">
        <path d="M11.5464 23.4167L10.1332 22.6092L12.5558 18.4102L11.183 17.6027L9.97173 19.7022L8.55859 18.8947L12.7173 11.7079C12.2058 11.183 11.8223 10.5841 11.5666 9.91116C11.3108 9.23824 11.183 8.54513 11.183 7.83183C11.183 7.34733 11.2436 6.86632 11.3647 6.38882C11.4858 5.91131 11.681 5.45022 11.9501 5.00556L13.3229 5.81306C13.1345 6.12261 12.9999 6.44238 12.9191 6.77238C12.8384 7.10238 12.798 7.44207 12.798 7.79146C12.798 8.50475 12.973 9.17445 13.3229 9.80053C13.6728 10.4266 14.1708 10.9278 14.8168 11.3041L16.6337 12.3539C17.4681 12.8384 18.0805 13.535 18.4707 14.4437C18.861 15.3524 19.0562 16.2035 19.0562 16.997C19.0562 17.5085 18.9889 18.0064 18.8543 18.4909C18.7197 18.9754 18.5313 19.433 18.2891 19.8637L16.8759 19.0562C17.0643 18.7332 17.1989 18.4035 17.2797 18.067C17.3604 17.7305 17.4008 17.3873 17.4008 17.0374C17.4008 16.6067 17.3402 16.1895 17.2191 15.7858C17.098 15.382 16.9028 15.0052 16.6337 14.6553L11.5464 23.4167ZM17.0374 11.3849C16.5933 11.3849 16.2132 11.2269 15.8972 10.9109C15.5812 10.5949 15.4229 10.2145 15.4224 9.76985C15.4219 9.32518 15.5801 8.94512 15.8972 8.62965C16.2143 8.31418 16.5944 8.15591 17.0374 8.15483C17.4805 8.15376 17.8608 8.31203 18.1784 8.62965C18.4961 8.94727 18.6541 9.32734 18.6524 9.76985C18.6508 10.2124 18.4928 10.5927 18.1784 10.9109C17.864 11.229 17.4837 11.387 17.0374 11.3849ZM15.0187 7.34733C14.6687 7.34733 14.3794 7.2262 14.1506 6.98395C13.9218 6.7417 13.8074 6.45907 13.8074 6.13607C13.8074 5.78615 13.9285 5.49679 14.1708 5.268C14.413 5.0392 14.6957 4.9248 15.0187 4.9248C15.3686 4.9248 15.6579 5.04593 15.8867 5.28818C16.1155 5.53044 16.2299 5.81306 16.2299 6.13607C16.2299 6.48599 16.1088 6.77534 15.8665 7.00414C15.6243 7.23293 15.3417 7.34733 15.0187 7.34733Z" fill="white" />
      </g>
      <defs>
        <clipPath id="clip0_22939_60110">
          <rect width="19.3802" height="19.3802" fill="white" transform="translate(4.11719 4.11719)" />
        </clipPath>
      </defs>
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
    case 'building-gov':
      return <IconBuildingGov />
    case 'building-private':
      return <IconBuildingPrivate />
    case 'building-nonprofit':
      return <IconBuildingNonprofit />
    case 'accessibility':
      return <IconAccessibility />
    case 'link':
      return <IconLink />
    default:
      return <IconLocation />
  }
}

export {
  IconBack,
  IconChevronLeft,
  IconChevronRight,
  IconClose,
  IconExpand,
  IconMapPinLarge,
  IconReport,
  IconInfo,
  IconSparkle,
  IconSend,
}
