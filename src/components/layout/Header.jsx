import Logo from '../../assets/images/logo.png'

const Header = () => {
  return (
    <header className="bg-white">
      <div className="relative mx-auto flex min-h-[4.25rem] items-center justify-center px-4 py-4 md:px-8">
        <div className="absolute start-4 top-1/2 -translate-y-1/2 md:start-8">
          <img
            src={Logo}
            alt="משרד הרווחה והביטחון החברתי"
            className="h-10 w-auto max-w-[192px] object-contain md:h-12 md:max-w-[220px]"
          />
        </div>

        <p className="max-w-[min(100%,52rem)] px-[max(3rem,8vw)] text-center text-base font-bold leading-snug tracking-tight text-[#161a20] md:text-lg md:leading-tight lg:text-xl">
          פוטנציאל למצבי סיכון בקרב אוכלוסיית הגיל השלישי ומענים מותאמים
        </p>
      </div>
    </header>
  )
}

export default Header
