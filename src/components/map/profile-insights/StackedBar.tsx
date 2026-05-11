type StackedBarProps = {
  segments: Array<{ color: string; ratio: number }>
  className?: string
  /** גובה הפס */
  heightClass?: string
}

/**
 * פס מוערם — יחסי רוחב לפי ratio (סכום אופייני 1).
 * dir=ltr כדי לשמור על סדר בהיר→בינוני→כהה כמו בתמונה.
 */
const StackedBar = ({ segments, className = '', heightClass = 'h-2.5' }: StackedBarProps) => {
  return (
    <div className={`flex w-full overflow-hidden rounded-full ${heightClass} ${className}`} dir="ltr" role="img" aria-hidden>
      {segments.map((seg, i) =>
        seg.ratio > 0 ? (
          <div
            key={i}
            className="h-full min-w-0 transition-[flex-grow]"
            style={{ flexGrow: seg.ratio, flexBasis: 0, backgroundColor: seg.color }}
          />
        ) : null,
      )}
    </div>
  )
}

export default StackedBar
