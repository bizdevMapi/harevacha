import IconPerson from '../../assets/icons/IconPerson'

/** ארבעה מעגלים משולבים — התאמה ויזואלית לאיקון המשרד במוקאפ */
function MinistryMark() {
  return (
    <svg
      className="h-9 w-9 shrink-0 text-brand-darkBlue md:h-10 md:w-10"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <circle cx="14" cy="14" r="7.5" stroke="currentColor" strokeWidth="1.65" />
      <circle cx="26" cy="14" r="7.5" stroke="currentColor" strokeWidth="1.65" />
      <circle cx="14" cy="26" r="7.5" stroke="currentColor" strokeWidth="1.65" />
      <circle cx="26" cy="26" r="7.5" stroke="currentColor" strokeWidth="1.65" />
    </svg>
  )
}

const Header = () => {
  return (
    <header className="bg-white">
      <div className="mx-auto flex min-h-[4.25rem] max-w-[1920px] items-center justify-between gap-3 px-4 py-2.5 md:gap-6 md:px-8 md:py-3">
        {/* ב־RTL: סדר זה שם את הלוגו בימין המסך */}
        <div className="flex shrink-0 items-center gap-2.5 md:gap-3">
          <MinistryMark />
          <div className="text-right leading-tight">
            <div className="text-[13px] font-bold text-neutral-800 md:text-sm">
              משרד הרווחה
            </div>
            <div className="text-[13px] font-bold text-neutral-800 md:text-sm">
              והביטחון החברתי
            </div>
            <div className="mt-0.5 text-[11px] font-normal text-neutral-500 md:text-xs">
              חוסן חברתי לישראל
            </div>
          </div>
        </div>

        <p className="min-w-0 flex-1 px-2 text-center text-[15px] font-bold leading-snug tracking-tight text-[#1e3a52] md:text-lg md:leading-tight lg:text-xl">
          פוטנציאל למצבי סיכון בקרב אוכלוסיית הגיל השלישי ומענים מותאמים
        </p>

        {/* טקסט קרוב למרכז, אייקון בצד החיצוני (שמאל מסך) */}
        <div className="flex shrink-0 items-center justify-end gap-2 text-neutral-600">
          <span className="text-[13px] font-medium md:text-sm">רווחה ירושלים</span>
          <IconPerson className="h-5 w-5 shrink-0 text-brand-darkBlue" />
        </div>
      </div>
    </header>
  )
}

export default Header
