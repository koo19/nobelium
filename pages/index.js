import { clientConfig } from '@/lib/server/config'

import Container from '@/components/Container'
import BlogPost from '@/components/BlogPost'
import Pagination from '@/components/Pagination'
import { getAllPosts, getPostBlocks } from '@/lib/notion'
import { useConfig } from '@/lib/config'
// import ReactDOMServer from 'react-dom/server'
// import { ConfigProvider } from '@/lib/config'
// import NotionRenderer from '@/components/NotionRenderer'

// export async function getStaticProps() {
//   const posts = await getAllPosts({ includePages: false })
//   let postsToShow = posts.slice(0, clientConfig.postsPerPage)
//   const totalPosts = posts.length
//   const showNext = totalPosts > clientConfig.postsPerPage
//   // Setting up previews.
//   await Promise.all(postsToShow.map(async (post, index) => {
//     // Only run without summary
//     if (!post.summary) {
//       const blockMap = await getPostBlocks(post.id);
//       const content = ReactDOMServer.renderToString(
//         <ConfigProvider value={clientConfig}>
//           <NotionRenderer recordMap={blockMap} />
//         </ConfigProvider>
//       )
//       const regexExp = /(<).*?(>)/g
//       const regexExp2 = /^(.*?)summary/g
//       postsToShow[index].preview = content.replace(regexExp, '').replace(regexExp2, '').substring(0, 70) + '...';
//     }
//   }));
//   return {
//     props: {
//       page: 1, // current page is 1
//       postsToShow,
//       showNext
//     },
//     revalidate: 1
//   }
// }

export default function Blog({ postsToShow, page, showNext }) {
  const { title, description } = useConfig()

  return (
    <Container title={title} description={description}>
      {postsToShow.map(post => (
        <BlogPost key={post.id} post={post} />
      ))}
      {showNext && <Pagination page={page} showNext={showNext} />}
    </Container>
  )
}
