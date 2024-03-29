'use client'

import { Fragment } from 'react'
import { unstable_noStore as noStore } from 'next/cache'
import { useAuth } from '@clerk/nextjs'

import { Separator } from '@/components/ui/separator'
import { api } from '@/trpc/react'
import NewPost from '../../_components/new-post'
import PostView from '../../_components/post'
import PostEmptyState from '../../_components/post-empty-state'

export default function Home() {
  noStore()
  const { userId } = useAuth()

  const postsQuery = api.post.getAll.useQuery()

  return (
    <div>
      {userId ? <NewPost onRefresh={postsQuery.refetch} /> : null}

      {postsQuery.data?.length ? (
        postsQuery.data.map((post) => (
          <Fragment key={post.id}>
            <PostView post={post} />

            <Separator className='my-10' />
          </Fragment>
        ))
      ) : (
        <PostEmptyState />
      )}
    </div>
  )
}
