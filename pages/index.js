import { useEffect, useState } from 'react'
import { clientConfig } from '@/lib/server/config'
import Container from '@/components/Container'
import BlogPost from '@/components/BlogPost'
import { getAllPosts } from '@/lib/notion'
import { useConfig } from '@/lib/config'
import useInfiniteScroll from '@/lib/useInfiniteScroll'
import AdUnit from '@/components/AdUnit'
import useWindowWidth from '@/hooks/useWindowWidth'

export async function getStaticProps() {
  const posts = await getAllPosts({ includePages: false })
  let postsToShow = posts.slice(0, clientConfig.postsPerPage)
  const totalPosts = posts.length

  return {
    props: {
      initialPosts: postsToShow,
      totalPosts,
    },
    revalidate: 1
  }
}

export default function Blog({ initialPosts, totalPosts }) {
  const { title, description, postsPerPage } = useConfig()
  const [posts, setPosts] = useState(initialPosts)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(totalPosts > postsPerPage)
  const width = useWindowWidth()

  const loadMore = async () => {
    if (loading) return
    setLoading(true)

    const nextPage = page + 1
    const res = await fetch(`/api/posts?page=${nextPage}`)
    const newPosts = await res.json()

    if (newPosts.length) {
      setPosts(prev => [...prev, ...newPosts])
      setPage(nextPage)
      setHasMore(newPosts.length === postsPerPage)
    } else {
      setHasMore(false)
    }

    setLoading(false)
  }

  const [infiniteRef] = useInfiniteScroll({
    loading,
    hasMore,
    onLoadMore: loadMore,
    rootMargin: '0px 0px 400px 0px',
  })

  return (
    <>
      <Container title={title} description={description}>
        {posts.map(post => (
          <BlogPost key={post.id} post={post} />
        ))}

        {hasMore && (
          <div ref={infiniteRef} className="flex justify-center py-10">
            {loading ? (
              <div className="loader" />
            ) : (
              <div className="h-10" /> // Spacer for infinite scroll trigger
            )}
          </div>
        )}
      </Container>
      {width > 768 ? (
        <div style={{
          position: 'fixed',
          top: '100px',
          right: '20px',
          zIndex: 1000
        }}>
          <AdUnit orientation="vertical" />
        </div>
      ) : (
        <div style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          textAlign: 'center'
        }}>
          <AdUnit orientation="horizontal" />
        </div>
      )}
    </>
  )
}
