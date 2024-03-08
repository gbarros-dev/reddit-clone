'use client'

import { api } from '@/trpc/react'
import Post from '../../_components/post'
import PostEmptyState from '../../_components/post-empty-state'

export default function MyPosts() {
  const myPostsQuery = api.post.getAllByUser.useQuery()

  return (
    <div>
      {myPostsQuery.data?.length ? (
        myPostsQuery.data.map((post) => <Post key={post.id} post={post} />)
      ) : (
        <PostEmptyState />
      )}
    </div>
  )
}
