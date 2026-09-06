import Logo from '../../assets/images/logo.png'
import { IconUser } from '../../assets/icons'
import { URL_SELECTED_CITY } from '../../utils/activeCity'

const Header = () => {
  return (
    <header className="bg-white">
      <div className="relative mx-auto flex items-center justify-center px-4 py-4 md:px-8">
        <div className="absolute start-4 top-1/2 -translate-y-1/2 md:start-8">
          <img
            src={Logo}
            alt="משרד הרווחה והביטחון החברתי"
            className="h-8 w-auto max-w-[192px] object-contain md:max-w-[220px]"
          />
        </div>

        <p className="px-[max(3rem,8vw)] text-center text-base font-bold leading-snug tracking-tight text-[#161a20] md:text-lg md:leading-tight lg:text-xl">
          פוטנציאל למצבי סיכון בקרב אוכלוסיית הגיל השלישי ומענים מותאמים
        </p>

        {/* שם הרשות שהדשבורד מוגדר לה — רק כשהעיר נקבעה בפרמטר cityid */}
        {URL_SELECTED_CITY && (
          <div className="absolute end-4 top-1/2 flex -translate-y-1/2 items-center gap-1.5 md:end-8">
            <span className="text-brand-darkBlue">
              <IconUser />
            </span>
            <span className="whitespace-nowrap text-sm text-[#161a20] md:text-[15px]">
              רווחה {URL_SELECTED_CITY.label}
            </span>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header
