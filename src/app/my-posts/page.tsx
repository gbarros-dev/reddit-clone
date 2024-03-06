'use client'

import { api } from '@/trpc/react'
import Post from '../_components/post'

export default function MyPosts() {
  const myPostsQuery = api.post.getAllByUser.useQuery()

  return <div>{myPostsQuery.data?.map((post) => <Post key={post.id} post={post} />)}</div>
}
