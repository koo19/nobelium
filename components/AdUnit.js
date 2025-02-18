import { useEffect } from 'react'
import { useConfig } from '@/lib/config'

const AdUnit = ({ slot, orientation = 'horizontal' }) => {
  const BLOG = useConfig()

  useEffect(() => {
    if (!BLOG.googleAdsenseId || !slot) return

    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({})
    } catch (error) {
      console.error('Adsense error', error)
    }
  }, [BLOG.googleAdsenseId, slot])

  if (!BLOG.googleAdsenseId || !slot) return null

  const adStyle =
    orientation === 'vertical'
      ? { display: 'block', width: '300px', height: '600px' }
      : { display: 'block', width: '728px', height: '90px' }

  return (
    <div className="ad-container my-8">
      <ins
        className="adsbygoogle"
        style={adStyle}
        data-ad-client={BLOG.googleAdsenseId}
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  )
}

export default AdUnit
