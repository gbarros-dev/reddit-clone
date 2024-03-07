'use client'

import { useCallback, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { toast } from 'sonner'

import { Separator } from '@/components/ui/separator'
import { api } from '@/trpc/react'
import CommentView from '../../_components/comment'
import CommentInput from '../../_components/new-comment'
import Post from '../../_components/post'
import ArrowLeftIcon from '../../assets/icons/arrow-left-icon'

export default function PostDetails() {
  const { postId } = useParams()
  const router = useRouter()

  const postsQuery = api.post.getOne.useQuery({ id: postId as string })
  const commentsQuery = api.comment.getAllByPost.useQuery({ postId: postId as string })

  const onShowPostQueryError = useCallback(
    async (error: string) => {
      if (postsQuery.error) {
        toast.error(error)
      }
    },
    [postsQuery.error],
  )

  useEffect(() => {
    if (postsQuery.error) {
      void onShowPostQueryError(postsQuery.error.message)
    }
  }, [onShowPostQueryError, postsQuery.error])

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
        {postsQuery.data ? <Post post={postsQuery.data} /> : ''}

        <CommentInput
          onSuccess={() => {
            void postsQuery.refetch()
            void commentsQuery.refetch()
          }}
        />

        <Separator className='my-10' />

        <div>
          <h3 className='text-sm font-medium leading-5 text-gray-800'>All comments</h3>

          {commentsQuery.data?.map((comment) => (
            <CommentView key={comment.id} comment={comment} parentComment />
          ))}
        </div>
      </div>
    </div>
  )
}
