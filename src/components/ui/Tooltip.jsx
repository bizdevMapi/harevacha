import { useState, useRef, useEffect } from 'react'
import { IconHelp } from '../../assets/icons'

const Tooltip = ({ children, content, position = 'bottom', offset = 8, useAbsolute = false }) => {
  const [isVisible, setIsVisible] = useState(false)
  const [tooltipStyle, setTooltipStyle] = useState({})
  const triggerRef = useRef(null)

  const absolutePositionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  }

  const arrowClasses = {
    top: 'top-full left-1/2 -translate-x-1/2 border-t-[#2a3441] border-t-[6px] border-x-[6px] border-x-transparent',
    bottom: 'bottom-full left-1/2 -translate-x-1/2 border-b-[#2a3441] border-b-[6px] border-x-[6px] border-x-transparent',
    left: 'left-full top-1/2 -translate-y-1/2 border-l-[#2a3441] border-l-[6px] border-y-[6px] border-y-transparent',
    right: 'right-full top-1/2 -translate-y-1/2 border-r-[#2a3441] border-r-[6px] border-y-[6px] border-y-transparent',
  }

  useEffect(() => {
    if (!useAbsolute && isVisible && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect()
      let style = {}

      switch (position) {
        case 'top':
          style = {
            left: `${rect.left + rect.width / 2}px`,
            top: `${rect.top - offset}px`,
            transform: 'translate(-50%, -100%)',
          }
          break
        case 'bottom':
          style = {
            left: `${rect.left + rect.width / 2}px`,
            top: `${rect.bottom + offset}px`,
            transform: 'translate(-50%, 0)',
          }
          break
        case 'left':
          style = {
            right: `${window.innerWidth - rect.left + offset}px`,
            top: `${rect.top + rect.height / 2}px`,
            transform: 'translateY(-50%)',
          }
          break
        case 'right':
          style = {
            left: `${rect.right + offset}px`,
            top: `${rect.top + rect.height / 2}px`,
            transform: 'translateY(-50%)',
          }
          break
      }

      setTooltipStyle(style)
    }
  }, [isVisible, position, offset, useAbsolute])

  const defaultIcon = (
    <span className="inline-flex cursor-help items-center opacity-80 hover:opacity-100">
      <IconHelp />
    </span>
  )

  return (
    <>
      <span
        ref={triggerRef}
        className="inline-flex items-center"
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
      >
        {children || defaultIcon}
      </span>
      {isVisible && content && (
        <div
          className={useAbsolute ? `absolute z-[9999] whitespace-nowrap ${absolutePositionClasses[position]}` : "fixed z-[9999]"}
          style={useAbsolute ? {} : tooltipStyle}
          role="tooltip"
        >
          <div className="relative">
            <div className="rounded-lg bg-[#2a3441] px-4 py-3 text-sm leading-relaxed text-white shadow-lg">
              {typeof content === 'string' ? (
                <div dangerouslySetInnerHTML={{ __html: content }} />
              ) : (
                content
              )}
            </div>
            <div className={`absolute h-0 w-0 ${arrowClasses[position]}`} />
          </div>
        </div>
      )}
    </>
  )
}

export default Tooltip
