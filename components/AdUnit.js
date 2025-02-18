import { useEffect } from 'react'
import { useConfig } from '@/lib/config'

const AdUnit = ({ slot, orientation = 'horizontal' }) => {
  const BLOG = useConfig()

  if (!BLOG.googleAdsenseId || !slot) return null

  // 根据方向设置广告样式，例如横幅广告为 728×90，纵幅广告为 300×600
  const adStyle =
    orientation === 'vertical'
      ? { display: 'block', width: '300px', height: '600px' }
      : { display: 'block', width: '728px', height: '90px' }

  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({})
    } catch (error) {
      console.error('Adsense error', error)
    }
  }, [])

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
