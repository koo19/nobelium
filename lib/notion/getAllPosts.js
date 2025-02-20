import { config as BLOG } from '@/lib/server/config'

import { idToUuid } from 'notion-utils'
import dayjs from '@/lib/dayjs'
import api from '@/lib/server/notion-api'
import getAllPageIds from './getAllPageIds'
import getPageProperties from './getPageProperties'
import filterPublishedPosts from './filterPublishedPosts'
import { clientConfig } from '@/lib/server/config'
import { getPostBlocks } from '@/lib/notion'
import ReactDOMServer from 'react-dom/server'
import { ConfigProvider } from '@/lib/config'
import NotionRenderer from '@/components/NotionRenderer'

/**
 * @param {{ includePages: boolean }} - false: posts only / true: include pages
 */
export async function getAllPosts ({ includePages = false }) {
  const id = idToUuid(process.env.NOTION_PAGE_ID)

  const response = await api.getPage(id)

  const collection = Object.values(response.collection)[0]?.value
  const collectionQuery = response.collection_query
  const block = response.block
  const schema = collection?.schema

  const rawMetadata = block[id].value

  // Check Type
  if (
    rawMetadata?.type !== 'collection_view_page' &&
    rawMetadata?.type !== 'collection_view'
  ) {
    console.log(`pageId "${id}" is not a database`)
    return null
  } else {
    // Construct Data
    const pageIds = getAllPageIds(collectionQuery)
    const data = []
    for (let i = 0; i < pageIds.length; i++) {
      const id = pageIds[i]
      const properties = (await getPageProperties(id, block, schema)) || null

      // Add fullwidth to properties
      properties.fullWidth = block[id].value?.format?.page_full_width ?? false
      // Convert date (with timezone) to unix milliseconds timestamp
      properties.date = properties.date?.start_date
        ? dayjs(properties.date.start_date).valueOf()
        : dayjs(block[id].value?.created_time).valueOf()

      data.push(properties)
    }

    // remove all the the items doesn't meet requirements
    const posts = filterPublishedPosts({ posts: data, includePages })

    // Sort by date
    if (BLOG.sortByDate) {
      posts.sort((a, b) => b.date - a.date)
    }

    // Add preview to posts if there is no summary
    await Promise.all(posts.map(async (post, index) => {
      if (!post.summary) {
        const blockMap = await getPostBlocks(post.id)
        const content = ReactDOMServer.renderToString(
          <ConfigProvider value={clientConfig}>
            <NotionRenderer recordMap={blockMap} />
          </ConfigProvider>
        )
        const regexExp = /(<).*?(>)/g
        const regexExp2 = /^(.*?)TEXTSPLITSIGN/g
        posts[index].preview = content.replace(regexExp2, '').replace(regexExp, '').substring(0, 70) + '...'
      }
    }))
    return posts
  }
}
