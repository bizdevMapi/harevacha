let scriptLoaded = false
let scriptLoading = false
const loadCallbacks: Array<() => void> = []

/**
 * טוען את ה-script של GovMap פעם אחת בלבד
 * @returns Promise שמתפרק כאשר ה-script נטען
 */
export function loadGovmapScript(): Promise<void> {
  return new Promise((resolve) => {
    if (scriptLoaded) {
      resolve()
      return
    }

    loadCallbacks.push(resolve)

    if (scriptLoading) {
      return
    }

    scriptLoading = true
    const scriptSrc = import.meta.env.VITE_GOVMAP_URL || 'https://govmap.gov.il/govmap/api/govmap.api.js'

    const existingScript = document.querySelector(`script[src="${scriptSrc}"]`)
    if (existingScript) {
      if (window.govmap) {
        scriptLoaded = true
        loadCallbacks.forEach((cb) => cb())
        loadCallbacks.length = 0
      } else {
        existingScript.addEventListener('load', () => {
          scriptLoaded = true
          loadCallbacks.forEach((cb) => cb())
          loadCallbacks.length = 0
        })
      }
      return
    }

    const script = document.createElement('script')
    script.src = scriptSrc
    script.async = true
    script.onload = () => {
      scriptLoaded = true
      loadCallbacks.forEach((cb) => cb())
      loadCallbacks.length = 0
    }
    script.onerror = () => {
      scriptLoading = false
      console.error('Failed to load GovMap script')
      loadCallbacks.forEach((cb) => cb())
      loadCallbacks.length = 0
    }
    document.body.appendChild(script)
  })
}
