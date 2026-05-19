import type { MapPointInfo, MapPointInfoDetail } from './mapPointInfoData'
import { IconClose, IconExpand, IconMapPinLarge, MapPointInfoIcon } from './MapPointInfoIcons'

type MapPointInfoCardProps = {
  data: MapPointInfo
  onClose: () => void
}

function DetailRow({ detail }: { detail: MapPointInfoDetail }) {
  return (
    <div className="flex w-full items-center justify-end gap-3">
      <MapPointInfoIcon icon={detail.icon} />
      <p className="min-w-0 flex-1 text-right text-sm leading-[23px] text-[#5f708a]">{detail.value}</p>
    </div>
  )
}

const MapPointInfoCard = ({ data, onClose }: MapPointInfoCardProps) => {
  return (
    <aside
      className="flex h-full w-[404px] max-w-[min(100vw,404px)] shrink-0 flex-col bg-white shadow-[2px_0_4px_rgba(164,177,192,0.2)]"
      dir="rtl"
      aria-label={`פרטי מענה: ${data.title}`}
    >
      <div className="flex min-h-0 flex-1 flex-col gap-4 px-8 pt-0">
        {/* כותרת + סגירה */}
        <div className="flex h-16 shrink-0 items-end justify-between pb-0">
          <h2 className="pb-3 text-[22px] font-bold leading-[21px] text-[#084878]">{data.title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="mb-1 flex size-12 shrink-0 items-center justify-center rounded-3xl transition-colors hover:bg-[#f0f4f8]"
            aria-label="סגירה"
          >
            <IconClose />
          </button>
        </div>

        {/* תיאור */}
        <p className="shrink-0 py-4 text-right text-sm leading-[22px] text-[#34404f]">{data.description}</p>

        {/* גלילה: מפה + פרטים */}
        <div className="flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto overflow-x-hidden pb-6">
          {/* תצוגת מפה */}
          <div className="relative h-[196px] w-full shrink-0 overflow-hidden rounded-2xl bg-[#e8eef4]">
            {data.mapPreviewUrl ? (
              <img
                src={data.mapPreviewUrl}
                alt=""
                className="absolute inset-0 size-full object-cover opacity-60"
              />
            ) : (
              <div
                className="absolute inset-0 bg-gradient-to-b from-[#dce8f4] via-[#e8eef4] to-[#f0f4f8]"
                aria-hidden
              />
            )}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <IconMapPinLarge />
            </div>
            <button
              type="button"
              className="absolute start-2 top-2 flex size-6 items-center justify-center rounded-[7px] bg-white p-0.5 shadow-sm transition-colors hover:bg-[#f5f8fc]"
              aria-label="הרחבת מפה"
            >
              <IconExpand />
            </button>
          </div>

          {/* רשימת פרטים */}
          <div className="flex w-full flex-col items-end gap-3.5">
            {data.details.map((detail) => (
              <DetailRow key={detail.id} detail={detail} />
            ))}
          </div>
        </div>
      </div>
    </aside>
  )
}

export default MapPointInfoCard
