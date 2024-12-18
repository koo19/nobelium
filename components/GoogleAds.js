import Script from 'next/script'
import { useConfig } from '@/lib/config'

const GoogleAds = () => {
  const BLOG = useConfig()

  if (!BLOG.googleAdsenseId) return null

  return (
    <>
      <Script
        async
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${BLOG.googleAdsenseId}`}
        crossOrigin="anonymous"
        strategy="afterInteractive"
      />
    </>
  )
}

export default GoogleAds
