import { useConfig } from '@/lib/config'

const AdUnit = ({ slot }) => {
  const BLOG = useConfig()

  if (!BLOG.googleAdsenseId || !slot) return null

  return (
    <div className="ad-container my-8">
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={BLOG.googleAdsenseId}
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
      <script>
        (adsbygoogle = window.adsbygoogle || []).push({});
      </script>
    </div>
  )
}

export default AdUnit
