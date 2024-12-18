// Import required styles
import 'prismjs/themes/prism-tomorrow.css'
import 'react-notion-x/src/styles.css'
import 'katex/dist/katex.min.css'
import App from 'next/app'
import '@/styles/globals.css'
import '@/styles/notion.css'

// Dynamic imports for performance optimization
import dynamic from 'next/dynamic'
import loadLocale from '@/assets/i18n'

// Import providers for global context management
import { ConfigProvider } from '@/lib/config'
import { LocaleProvider } from '@/lib/locale'
import { prepareDayjs } from '@/lib/dayjs'
import { ThemeProvider } from '@/lib/theme'
import Scripts from '@/components/Scripts'

// Dynamically import analytics components with client-side only rendering
const Ackee = dynamic(() => import('@/components/Ackee'), { ssr: false })
const Gtag = dynamic(() => import('@/components/Gtag'), { ssr: false })

// Main App component that wraps all pages
export default function MyApp ({ Component, pageProps, config, locale }) {
  return (
    // Provide global configuration through React Context
    <ConfigProvider value={config}>
      {/* Load global scripts (analytics, ads, etc) */}
      <Scripts />
      {/* Provide localization context */}
      <LocaleProvider value={locale}>
        {/* Provide theme context */}
        <ThemeProvider>
          <>
            {/* Conditionally render Ackee analytics in production */}
            {process.env.VERCEL_ENV === 'production' && config?.analytics?.provider === 'ackee' && (
              <Ackee
                ackeeServerUrl={config.analytics.ackeeConfig.dataAckeeServer}
                ackeeDomainId={config.analytics.ackeeConfig.domainId}
              />
            )}
            {/* Conditionally render Google analytics in production */}
            {process.env.VERCEL_ENV === 'production' && config?.analytics?.provider === 'ga' && <Gtag />}
            {/* Render the current page component */}
            <Component {...pageProps} />
          </>
        </ThemeProvider>
      </LocaleProvider>
    </ConfigProvider>
  )
}

// Get initial props for the app (runs on both server and client)
MyApp.getInitialProps = async ctx => {
  // Load config differently based on environment
  const config = typeof window === 'object'
    // On client: fetch from API
    ? await fetch('/api/config').then(res => res.json())
    // On server: import directly
    : await import('@/lib/server/config').then(module => module.clientConfig)

  // Configure dayjs with timezone from config
  prepareDayjs(config.timezone)

  return {
    // Get default Next.js App props
    ...App.getInitialProps(ctx),
    // Pass config to app
    config,
    // Load localization based on config language
    locale: await loadLocale('basic', config.lang)
  }
}
