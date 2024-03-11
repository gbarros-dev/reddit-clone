'use client'

import { useCallback, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '@clerk/nextjs'
import { toast } from 'sonner'

import { Separator } from '@/components/ui/separator'
import { api } from '@/trpc/react'
import CommentView from '../../../_components/comment'
import CommentInput from '../../../_components/new-comment'
import PostComponent from '../../../_components/post'
import ArrowLeftIcon from '../../../assets/icons/arrow-left-icon'

export default function PostDetails() {
  const { postId } = useParams()
  const router = useRouter()
  const { userId } = useAuth()

  const newPostsQuery = api.post.getOneWithComments.useQuery({ id: postId as string })

  const onShowPostQueryError = useCallback(
    async (error: string) => {
      if (newPostsQuery.error) {
        toast.error(error)
      }
    },
    [newPostsQuery.error],
  )

  useEffect(() => {
    if (newPostsQuery.error) {
      void onShowPostQueryError(newPostsQuery.error.message)
    }
  }, [onShowPostQueryError, newPostsQuery.error])

  return (
    <div className='w-full'>
      <button
        className='flex items-center justify-start'
        onClick={(e) => {
          e.preventDefault()
          router.back()
        }}
      >
        <ArrowLeftIcon />
        <p className='ml-4'>Back to posts</p>
      </button>

      <div className='mt-6'>
        {newPostsQuery.data ? <PostComponent post={newPostsQuery.data} /> : ''}

        {userId ? (
          <CommentInput
            onSuccess={() => {
              void newPostsQuery.refetch()
              // void commentsQuery.refetch()
            }}
          />
        ) : null}

        <Separator className='my-10' />

        <div>
          <h3 className='text-sm font-medium leading-5 text-gray-800'>All comments</h3>

          {newPostsQuery.data?.comments?.map((comment) => (
            <CommentView key={comment.id} comment={comment} parentComment onRefresh={newPostsQuery.refetch} />
          ))}
        </div>
      </div>
    </div>
  )
}
