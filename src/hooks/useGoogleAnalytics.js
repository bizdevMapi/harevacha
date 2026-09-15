import { useEffect } from 'react'

export function useGoogleAnalytics() {
  useEffect(() => {
    const gaId = import.meta.env.VITE_GOOGLE_ANALYTICS_ID

    // Only load GA if ID is configured and not the placeholder
    if (!gaId || gaId === 'G-XXXXXXXXXX') {
      console.warn('Google Analytics ID not configured')
      return
    }

    // Load gtag script
    const script = document.createElement('script')
    script.async = true
    script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`
    document.head.appendChild(script)

    // Initialize gtag
    window.dataLayer = window.dataLayer || []
    function gtag() {
      // eslint-disable-next-line prefer-rest-params
      window.dataLayer.push(arguments)
    }
    window.gtag = gtag
    gtag('js', new Date())
    gtag('config', gaId)
  }, [])
}
