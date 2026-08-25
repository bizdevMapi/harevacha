import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { IconClose, IconSend } from './MapPointInfoIcons'

type ReportErrorModalProps = {
  /** שם המענה שעליו מדווחת הטעות — מוצג כתגית */
  serviceName?: string
  onClose: () => void
  onSubmit?: (payload: ReportErrorPayload) => void
}

export type ReportErrorPayload = {
  serviceName?: string
  fullName: string
  email: string
  message: string
}

const ReportErrorModal = ({ serviceName, onClose, onSubmit }: ReportErrorModalProps) => {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  // סגירה בלחיצה על Escape
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(false)

    onSubmit?.({ serviceName, fullName, email, message })

    const form = event.currentTarget
    const formData = new FormData(form)

    try {
      const response = await fetch('https://web3forms.com/api/v1/contact', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        setSuccess(true)
        setTimeout(() => {
          onClose()
        }, 1500)
      } else {
        setError('שגיאה בשליחה. אנא נסה שוב.')
        setIsLoading(false)
      }
    } catch (err) {
      console.error('Error sending report:', err)
      setError('שגיאה בחיבור. אנא בדוק את החיבור לאינטרנט.')
      setIsLoading(false)
    }
  }

  const inputClass =
    'w-full rounded-2xl border border-[#dbe3ec] bg-white px-4 py-3 text-right text-[14px] leading-[22px] text-[#34404f] outline-none transition-colors placeholder:text-[#a4b1c0] focus:border-[#4353ff] focus:ring-0'

  return createPortal(
    <div
      className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/40 p-4"
      dir="rtl"
      role="dialog"
      aria-modal="true"
      aria-label="דיווח על טעות"
      onClick={onClose}
    >
      <div
        className="relative flex w-full max-w-[440px] flex-col rounded-3xl bg-white p-8 shadow-[0_8px_32px_rgba(21,26,32,0.2)]"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute left-6 top-6 flex size-9 shrink-0 items-center justify-center rounded-full transition-colors hover:bg-[#f0f4f8]"
          aria-label="סגירה"
        >
          <IconClose />
        </button>

        <div className="flex w-full flex-col items-start gap-2 text-right">
          <h2 className="text-[20px] font-bold leading-[26px] text-[#161a20]">
            מצאתם טעות? נתון לא מדויק?
          </h2>
          <p className="text-[14px] leading-[20px] text-[#5f708a]">
            כתבו לנו ונתקן את הפרטים לטובת כולם
          </p>

          {!!serviceName && (
            <span className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-[#f4eafb] px-3 py-1 text-[13px] font-semibold text-[#8a2ac0]">
              <span className="flex size-4 items-center justify-center rounded-full bg-[#8a2ac0] text-[10px] font-bold text-white">
                ?
              </span>
              {serviceName}
            </span>
          )}
        </div>

        <form className="mt-6 flex w-full flex-col gap-5" onSubmit={handleSubmit}>
          <input type="hidden" name="access_key" value={import.meta.env.VITE_WEB3FORMS_KEY || ''} />
          <input type="hidden" name="to_email" value="rivkah@mapi.gov.il" />
          <input type="hidden" name="service_name" value={serviceName || 'N/A'} />

          <div className="flex w-full flex-col gap-4 sm:flex-row">
            <label className="flex flex-1 flex-col gap-1.5">
              <span className="text-right text-[14px] font-semibold text-[#34404f]">שם מלא</span>
              <input
                type="text"
                name="name"
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                className={inputClass}
                autoComplete="name"
                required
              />
            </label>
            <label className="flex flex-1 flex-col gap-1.5">
              <span className="text-right text-[14px] font-semibold text-[#34404f]">כתובת מייל</span>
              <input
                type="email"
                name="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className={inputClass}
                autoComplete="email"
                required
              />
            </label>
          </div>

          <label className="flex w-full flex-col gap-1.5">
            <span className="text-right text-[14px] font-semibold text-[#34404f]">טקסט חופשי</span>
            <textarea
              name="message"
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              rows={4}
              className={`${inputClass} resize-none`}
              required
            />
          </label>

          {error && (
            <div className="rounded-lg bg-[#fee2e2] px-4 py-3 text-[13px] text-[#991b1b]">
              {error}
            </div>
          )}

          {success && (
            <div className="rounded-lg bg-[#dcfce7] px-4 py-3 text-[13px] text-[#166534]">
              ✓ הודעתך נשלחה בהצלחה! תודה על הפניה.
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading || success}
            className="mt-1 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#4353ff] py-3.5 text-[15px] font-bold text-white transition-colors hover:bg-[#3644e6] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <IconSend />
            {isLoading ? 'שליחה...' : 'שלחו לנו'}
          </button>
        </form>
      </div>
    </div>,
    document.body,
  )
}

export default ReportErrorModal
