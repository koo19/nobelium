import { getAllPosts, getPostBlocks } from '@/lib/notion'
import { clientConfig } from '@/lib/server/config'
import ReactDOMServer from 'react-dom/server'
import { ConfigProvider } from '@/lib/config'
import NotionRenderer from '@/components/NotionRenderer'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const page = parseInt(req.query.page) || 1
  const posts = await getAllPosts({ includePages: false })

  const start = (page - 1) * clientConfig.postsPerPage
  const end = start + clientConfig.postsPerPage
  let postsToShow = posts.slice(start, end)

  // Setting up previews
  await Promise.all(postsToShow.map(async (post, index) => {
    if (!post.summary) {
      const blockMap = await getPostBlocks(post.id)
      const content = ReactDOMServer.renderToString(
        <ConfigProvider value={clientConfig}>
          <NotionRenderer recordMap={blockMap} />
        </ConfigProvider>
      )
      const regexExp = /(<).*?(>)/g
      const regexExp2 = /^(.*?)TEXTSPLITSIGN/g
      postsToShow[index].preview = content.replace(regexExp2, '').replace(regexExp, '').substring(0, 70) + '...'
    }
  }))

  res.status(200).json(postsToShow)
}
