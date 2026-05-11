type MapPointInfoCardProps = {
  title: string
  subtitle?: string
  description?: string
  details: Array<{ label: string; value: string }>
  onClose: () => void
}

const MapPointInfoCard = ({ title, subtitle, description, details, onClose }: MapPointInfoCardProps) => {
  return (
    <aside
      className="absolute left-3 top-3 z-40 h-[calc(100%-1.5rem)] w-[260px] max-w-[calc(100%-1.5rem)] overflow-hidden rounded-xl border border-[#d6e2ef] bg-[#f2f5f9] shadow-[0_12px_26px_rgba(22,53,88,0.2)]"
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute left-2 top-2 z-10 h-7 w-7 rounded-full text-[#6f8299] transition hover:bg-[#e8eef5] hover:text-[#3e5f81]"
        aria-label="סגירה"
      >
        ✕
      </button>

      <div className="h-full overflow-y-auto px-4 pb-4 pt-6">
        <h3 className="mb-3 text-[34px] font-bold leading-none text-[#1f5d8f]">{title}</h3>
        {description ? <p className="mb-3 text-[12px] leading-5 text-[#4f6984]">{description}</p> : null}
        <div className="mb-4 h-[112px] rounded-lg bg-[#d8dde6]" />
        {subtitle ? <p className="mb-3 text-[12px] text-[#6f8299]">{subtitle}</p> : null}

        <div className="grid grid-cols-1 gap-y-2 border-t border-[#dce6f1] pt-3">
          {details.map((item) => (
            <div key={`${item.label}-${item.value}`}>
              <p className="text-[11px] text-[#8ca1b7]">{item.label}</p>
              <p className="text-[12px] font-semibold text-[#4f6883]">{item.value || '-'}</p>
            </div>
          ))}
        </div>
      </div>
    </aside>
  )
}

export default MapPointInfoCard
