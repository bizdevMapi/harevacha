type MapPointTooltipProps = {
  title: string
  subtitle?: string
  position: { left: number; top: number }
}

const MapPointTooltip = ({ title, subtitle, position }: MapPointTooltipProps) => {
  console.log('title--------:', title)
  return (
    <div
      className="pointer-events-none absolute z-30 min-w-[220px] max-w-[320px] rounded-xl border border-[#cfdcf0] bg-white px-4 py-3 shadow-[0_12px_28px_rgba(20,49,86,0.18)]"
      style={{
        left: `${position.left}px`,
        top: `${position.top}px`,
        transform: 'translate(-50%, calc(-100% - 12px))',
      }}
    >
      {subtitle ? <p className="mb-2 text-[12px] font-semibold text-[#8398b3]">{subtitle}</p> : null}
      <p className="mb-1 text-[30px] font-bold leading-none text-[#2b4f73]">{title}</p>
      <p className="text-[13px] leading-5 text-[#5f7691]">{subtitle}</p>
    </div>
  )
}

export default MapPointTooltip
