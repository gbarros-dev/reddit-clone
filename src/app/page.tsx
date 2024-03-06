'use client'

import { unstable_noStore as noStore } from 'next/cache'
import { useAuth } from '@clerk/nextjs'

import { Separator } from '@/components/ui/separator'
import { api } from '@/trpc/react'
import NewPost from './_components/new-post'
import Post from './_components/post'

export default function Home() {
  noStore()
  const { userId } = useAuth()

  const postsQuery = api.post.getAll.useQuery()

  return (
    <div>
      {userId ? <NewPost onRefresh={postsQuery.refetch} /> : null}

      {postsQuery.data?.map((post) => (
        <>
          <Post key={post.id} post={post} />

          <Separator className='my-10' />
        </>
      ))}
    </div>
  )
}
