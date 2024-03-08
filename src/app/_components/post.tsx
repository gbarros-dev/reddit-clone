import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@clerk/nextjs'
import { DateTime } from 'luxon'
import { toast } from 'sonner'

import { cn } from '@/lib/utils'
import { api } from '@/trpc/react'
import { type Post } from '@/types/post'
import ChevronDownIcon from '../assets/icons/chevron-down-icon'
import ChevronUpIcon from '../assets/icons/chevron-up-icon'

type PostProps = {
  post: Post
}

export default function PostView({ post }: PostProps) {
  const { userId } = useAuth()
  const router = useRouter()

  const postMinutesDiff = parseInt(
    DateTime.fromJSDate(post.createdAt).diffNow().toFormat('m').replace('-', ''),
  )
  const postHoursDiff = parseInt(DateTime.fromJSDate(post.createdAt).diffNow().toFormat('h').replace('-', ''))

  const votesQuery = api.vote.getAll.useQuery({ postId: post.id })
  const totalVotes = votesQuery.data?.totalVotes ?? 0

  const currentUserVote = api.vote.getByCurrentUser.useQuery(
    { postId: post.id },
    { enabled: !!userId, cacheTime: 0 },
  )

  const createVoteMutation = api.vote.create.useMutation({
    onSuccess: () => {
      void votesQuery.refetch()
      void currentUserVote.refetch()
    },
    onError: (error) => {
      toast.error('An error occurred while voting', { description: error.message })
    },
  })

  const onVote = (type: 'up' | 'down') => {
    if (!userId) {
      router.push('/log-in')
    } else {
      createVoteMutation.mutate({ postId: post.id, commentId: null, type })
    }
  }

  return (
    <div className='mb-10 flex'>
      {/* votes */}
      <div className='flex w-fit flex-col items-center'>
        <button
          className={cn(
            'stroke-color border-none transition-all hover:text-indigo-600',
            currentUserVote.data?.type === 'up' && 'text-indigo-600',
          )}
          disabled={createVoteMutation.isLoading}
          onClick={(e) => {
            e.preventDefault()
            onVote('up')
          }}
        >
          <ChevronUpIcon />
        </button>
        <p>{totalVotes}</p>
        <button
          className={cn(
            'stroke-color border-none transition-all hover:text-indigo-600',
            currentUserVote.data?.type === 'down' && 'text-indigo-600',
          )}
          disabled={createVoteMutation.isLoading}
          onClick={(e) => {
            e.preventDefault()
            onVote('down')
          }}
        >
          <ChevronDownIcon />
        </button>
      </div>
      {/* post */}
      <Link href={`/feed/${post.id}`}>
        <div className='ml-4'>
          <div className='flex items-center'>
            <Image
              src={post.user.profileImageUrl ?? '/person-placeholder.png'}
              width={24}
              height={24}
              alt='person-placeholder'
              style={{ objectFit: 'contain' }}
              className='max-h-[24px] rounded-full'
              priority
            />
            {/* post - createdBy, createdAt */}
            <h3 className='ml-2 text-sm leading-5 text-gray-600'>
              Posted by {post.user.username}{' '}
              {postMinutesDiff >= 60 ? `${postHoursDiff} hour ago` : `${postMinutesDiff} minutes ago`}
            </h3>
          </div>
          {/* post - title */}
          <h2 className='mt-[6px] font-medium leading-[14px] text-gray-900'>{post.title}</h2>
          {/* post - content */}
          <p className='mt-[6px] text-sm leading-5 text-gray-700'>{post.content}</p>
        </div>
      </Link>
    </div>
  )
}
