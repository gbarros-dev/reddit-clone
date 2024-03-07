import { useState } from 'react'
import Image from 'next/image'
import { useAuth } from '@clerk/nextjs'
import { DateTime } from 'luxon'
import { toast } from 'sonner'

import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import { api } from '@/trpc/react'
import { type Comment } from '@/types/comment'
import ChevronDownIcon from '../assets/icons/chevron-down-icon'
import ChevronUpIcon from '../assets/icons/chevron-up-icon'
import CommentIcon from '../assets/icons/comment-icon'
import NewComment from './new-comment'

type CommentViewProps = {
  comment: Comment
  parentComment?: boolean
}

export default function CommentView({ comment, parentComment = false }: CommentViewProps) {
  const { userId } = useAuth()

  const [isReplyActive, setIsReplyActive] = useState<boolean>(false)

  const commentMinutesDiff = parseInt(
    DateTime.fromJSDate(comment.createdAt).diffNow().toFormat('m').replace('-', ''),
  )
  const commentHoursDiff = parseInt(
    DateTime.fromJSDate(comment.createdAt).diffNow().toFormat('h').replace('-', ''),
  )

  const commentsQuery = api.comment.getAllByComment.useQuery({ commentId: comment.id })

  const votesQuery = api.vote.getAll.useQuery({ commentId: comment.id })
  const totalVotes = votesQuery.data?.totalVotes ?? 0

  const currentUserVote = api.vote.getByCurrentUser.useQuery({ commentId: comment.id }, { enabled: !!userId })

  const createVoteMutation = api.vote.create.useMutation({
    onSuccess: () => {
      void votesQuery.refetch()
      void currentUserVote.refetch()
    },
    onError: (error) => {
      toast.error('An error occurred while voting', { description: error.message })
    },
  })

  return (
    <div className='mt-6'>
      <div className='flex items-center'>
        <Image
          src={comment.user.profileImageUrl ?? '/person-placeholder.png'}
          width={24}
          height={24}
          alt='person-placeholder'
          style={{ objectFit: 'contain' }}
          className='max-h-[24px] rounded-full'
          priority
        />
        <h3 className='ml-2 text-sm text-gray-600'>
          {comment.user.username}{' '}
          {commentMinutesDiff >= 60 ? `${commentHoursDiff} hour ago` : `${commentMinutesDiff} minutes ago`}
        </h3>
      </div>
      <p className='mt-3 text-sm leading-5 text-gray-800'>{comment.content}</p>
      <div className='mt-3 flex'>
        <div className='flex items-center text-gray-600'>
          <button
            className={cn(
              'stroke-color border-none transition-all hover:text-indigo-600',
              currentUserVote.data?.type === 'up' && 'text-indigo-600',
            )}
            onClick={(e) => {
              e.preventDefault()
              createVoteMutation.mutate({ commentId: comment.id, postId: null, type: 'up' })
            }}
          >
            <ChevronUpIcon />
          </button>
          <p className='mx-2'>{totalVotes}</p>
          <button
            className={cn(
              'stroke-color border-none transition-all hover:text-indigo-600',
              currentUserVote.data?.type === 'down' && 'text-indigo-600',
            )}
            onClick={(e) => {
              e.preventDefault()
              createVoteMutation.mutate({ commentId: comment.id, postId: null, type: 'down' })
            }}
          >
            <ChevronDownIcon />
          </button>
        </div>
        <button
          className={cn(
            'stroke-color ml-4 flex items-center transition-all hover:text-indigo-600',
            isReplyActive ? 'text-indigo-600' : 'text-gray-600',
          )}
          type='button'
          onClick={(e) => {
            e.preventDefault()

            setIsReplyActive(!isReplyActive)
          }}
        >
          <CommentIcon />
          <span className='ml-2'>Reply</span>
        </button>
      </div>

      {isReplyActive ? (
        <div className='mt-6'>
          <NewComment
            parentCommentId={comment.id}
            onSuccess={() => {
              void commentsQuery.refetch()
              setIsReplyActive(false)
            }}
          />
        </div>
      ) : null}

      {commentsQuery.data?.length ? (
        <>
          <div className='ml-8'>
            {commentsQuery.data?.map((comment) => <CommentView key={comment.id} comment={comment} />)}
          </div>
          {parentComment ? <Separator className='my-6' /> : null}
        </>
      ) : null}
    </div>
  )
}
