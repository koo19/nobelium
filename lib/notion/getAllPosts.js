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
export async function getAllPosts({ includePages = false }) {
  const id = idToUuid(process.env.NOTION_PAGE_ID)
  const response = await api.getPage(id)
  const collection = Object.values(response.collection)[0]?.value
  const block = response.block
  const schema = collection?.schema

  const rawMetadata = block[id].value
  if (rawMetadata?.type !== 'collection_view_page' && rawMetadata?.type !== 'collection_view') {
    console.log(`pageId "${id}" is not a database`)
    return null
  }

  // Get all page IDs
  const pageIds = getAllPageIds(response.collection_query)

  // Fetch all pages properties in parallel
  const data = await Promise.all(
    pageIds.map(async (pageId) => {
      const properties = await getPageProperties(pageId, block, schema)
      if (!properties) return null

      return {
        ...properties,
        fullWidth: block[pageId].value?.format?.page_full_width ?? false,
        date: properties.date?.start_date
          ? dayjs(properties.date.start_date).valueOf()
          : dayjs(block[pageId].value?.created_time).valueOf()
      }
    })
  ).then(results => results.filter(Boolean))

  // Filter and sort posts
  const posts = filterPublishedPosts({ posts: data, includePages })
  if (BLOG.sortByDate) {
    posts.sort((a, b) => b.date - a.date)
  }

  // Generate previews in parallel for posts without summaries
  const postsWithPreviews = await Promise.all(
    posts.map(async post => {
      if (post.summary) return post

      const blockMap = await getPostBlocks(post.id)
      const content = ReactDOMServer.renderToString(
        <ConfigProvider value={clientConfig}>
          <NotionRenderer recordMap={blockMap} />
        </ConfigProvider>
      )

      // Extract first image from figure tags, iframes, or markdown images
      const firstImage = content.match(/<img.*?src="(.*?)".*?>/)?.[1]
        ?? content.match(/!\[.*?\]\((.*?)\)/)?.[1]
        ?? null
      return {
        ...post,
        preview: content
          .replace(/^(.*?)TEXTSPLITSIGN/g, '')
          // Remove all HTML tags and their contents
          .replace(/<[^>]*>/g, ' ')
          // Remove extra whitespace
          .replace(/\s+/g, ' ')
          .trim()
          .substring(0, 70) + '...',
        firstImage
      }
    })
  )

  return postsWithPreviews
}
