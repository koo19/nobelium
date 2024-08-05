import { config } from '@/lib/server/config'

import Container from '@/components/Container'
import BlogPost from '@/components/BlogPost'
import Pagination from '@/components/Pagination'
import { getAllPosts } from '@/lib/notion'
import ReactDOMServer from 'react-dom/server'
import { ConfigProvider } from '@/lib/config'
import NotionRenderer from '@/components/NotionRenderer'
const Page = ({ postsToShow, page, showNext }) => {
  return (
    <Container>
      {postsToShow &&
        postsToShow.map(post => <BlogPost key={post.id} post={post} />)}
      <Pagination page={page} showNext={showNext} />
    </Container>
  )
}
export async function getStaticProps(context) {
  const { page } = context.params // Get Current Page No.
  const posts = await getAllPosts({ includePages: false })
  let postsToShow = posts.slice(
    config.postsPerPage * (page - 1),
    config.postsPerPage * page
  )
  const totalPosts = posts.length
  const showNext = page * config.postsPerPage < totalPosts
  // Setting up previews.
  await Promise.all(postsToShow.map(async (post, index) => {
    // Only run without summary
    if (!post.summary) {
      const blockMap = await getPostBlocks(post.id);
      const content = ReactDOMServer.renderToString(
        <ConfigProvider value={clientConfig}>
          <NotionRenderer recordMap={blockMap} />
        </ConfigProvider>
      )
      const regexExp = /(<).*?(>)/g
      const regexExp2 = /^(.*?)summary/g
      postsToShow[index].preview = content.replace(regexExp, '').replace(regexExp2, '').substring(0, 70) + '...';
    }
  }));
  return {
    props: {
      page, // current page is 1
      postsToShow,
      showNext
    },
    revalidate: 1
  }
}

// export async function getStaticProps (context) {
//   const { page } = context.params // Get Current Page No.
//   const posts = await getAllPosts({ includePages: false })
//   const postsToShow = posts.slice(
//     config.postsPerPage * (page - 1),
//     config.postsPerPage * page
//   )
//   const totalPosts = posts.length
//   const showNext = page * config.postsPerPage < totalPosts
//   return {
//     props: {
//       page, // Current Page
//       postsToShow,
//       showNext
//     },
//     revalidate: 1
//   }
// }

export async function getStaticPaths () {
  const posts = await getAllPosts({ includePages: false })
  const totalPosts = posts.length
  const totalPages = Math.ceil(totalPosts / config.postsPerPage)
  return {
    // remove first page, we 're not gonna handle that.
    paths: Array.from({ length: totalPages - 1 }, (_, i) => ({
      params: { page: '' + (i + 2) }
    })),
    fallback: true
  }
}

export default Page
