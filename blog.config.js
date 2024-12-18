const BLOG = {
  title: '学冬 | Hugo Koo',
  author: 'Hugo Koo',
  email: 'i@xuedong.xyz',
  link: 'https://b.xuedong.xyz',
  description: '古学冬: 碎片/笔记/风暴/分享',
  lang: 'zh-CN', // ['en-US', 'zh-CN', 'zh-HK', 'zh-TW', 'ja-JP', 'es-ES']
  timezone: 'Asia/Singapore', // Your Notion posts' date will be interpreted as this timezone. See https://en.wikipedia.org/wiki/List_of_tz_database_time_zones for all options.
  appearance: 'dark', // ['light', 'dark', 'auto'],
  font: ['Noto Sans CJK SC', 'sans-serif'], // ['sans-serif', 'serif']
  lightBackground: '#B0E0E6', // use hex value, don't forget '#' e.g #fffefc
  darkBackground: '#083344', // use hex value, don't forget '#'
  path: '', // leave this empty unless you want to deploy Nobelium in a folder
  since: '', // If leave this empty, current year will be used.
  postsPerPage: 7,
  sortByDate: false,
  showAbout: true,
  showArchive: true,
  autoCollapsedNavBar: false, // The automatically collapsed navigation bar
  ogImageGenerateURL: 'https://og-image-craigary.vercel.app', // The link to generate OG image, don't end with a slash
  socialLink: ['https://x.com/hokdung_koo'],
  seo: {
    keywords: ['Blog', 'Website', 'xuedong', 'HugoKoo'],
    googleSiteVerification: '' // Remove the value or replace it with your own google site verification code
  },
  notionPageId: process.env.NOTION_PAGE_ID, // DO NOT CHANGE THIS！！！
  notionAccessToken: process.env.NOTION_ACCESS_TOKEN, // Useful if you prefer not to make your database public
  analytics: {
    provider: 'ga', // Currently we support Google Analytics and Ackee, please fill with 'ga' or 'ackee', leave it empty to disable it.
    ackeeConfig: {
      tracker: '', // e.g 'https://ackee.craigary.net/tracker.js'
      dataAckeeServer: '', // e.g https://ackee.craigary.net , don't end with a slash
      domainId: '' // e.g '0e2257a8-54d4-4847-91a1-0311ea48cc7b'
    },
    gaConfig: {
      measurementId: 'G-WFPG9PREKP' // e.g: G-XXXXXXXXXX
    }
  },
  comment: {
    // support provider: gitalk, utterances, cusdis
    provider: 'cusdis', // leave it empty if you don't need any comment plugin
    gitalkConfig: {
      repo: 'nobelium-gitalk', // The repository of store comments
      owner: 'hugo-koo',
      admin: ['hugo-koo'],
      clientID: 'Ov23litg3hu1J8Ccm4P4',
      clientSecret: 'c622f69d1d8f206a624cb323a84d6cc85ea3023a',
      distractionFreeMode: false
    },
    utterancesConfig: {
      repo: 'hugo-koo/nobelium-utterances'
    },
    cusdisConfig: {
      appId: 'b3a50538-ed91-4166-b6d6-953569d63f00', // data-app-id
      host: 'https://cusdis.com', // data-host, change this if you're using self-hosted version
      scriptSrc: 'https://cusdis.com/js/cusdis.es.js' // change this if you're using self-hosted version
    }
  },
  isProd: process.env.VERCEL_ENV === 'production', // distinguish between development and production environment (ref: https://vercel.com/docs/environment-variables#system-environment-variables)
  googleAdsenseId: process.env.GOOGLE_ADSENSE_ID || 'ca-pub-1848654824800692', // e.g. 'ca-pub-XXXXXXXXXXXXXXXX'
  adSlots: {
    inArticle: 'XXXXXXXXXX', // Your article ad slot ID
    sidebar: 'XXXXXXXXXX',   // Your sidebar ad slot ID
    footer: 'XXXXXXXXXX'     // Your footer ad slot ID
  }
}
// export default BLOG
module.exports = BLOG
