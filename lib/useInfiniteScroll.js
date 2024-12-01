import { useEffect, useCallback, useRef } from 'react'

export default function useInfiniteScroll({
  loading,
  hasMore,
  onLoadMore,
  rootMargin = '0px 0px 200px 0px',
}) {
  const observer = useRef()
  const loadMoreRef = useCallback(
    node => {
      if (loading) return
      if (observer.current) observer.current.disconnect()

      observer.current = new IntersectionObserver(
        entries => {
          if (entries[0].isIntersecting && hasMore) {
            onLoadMore()
          }
        },
        { rootMargin }
      )

      if (node) observer.current.observe(node)
    },
    [loading, hasMore, onLoadMore, rootMargin]
  )

  useEffect(() => {
    return () => {
      if (observer.current) {
        observer.current.disconnect()
      }
    }
  }, [])

  return [loadMoreRef]
}
