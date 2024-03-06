'use client'

import { useEffect } from 'react'
import Image from 'next/image'
import { useParams } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { api } from '@/trpc/react'
import { commentFormSchema, type CommentFormSchema } from '@/validators/comments'

type NewCommentPops = {
  parentCommentId?: string
  onSuccess: () => void
}

export default function NewComment({ parentCommentId, onSuccess }: NewCommentPops) {
  const { postId } = useParams()

  const commentMutation = api.comment.create.useMutation()

  const form = useForm<CommentFormSchema>({
    mode: 'onBlur',
    reValidateMode: 'onChange',
    resolver: zodResolver(commentFormSchema),
    defaultValues: {
      content: '',
      postId: '',
      commentId: null,
    },
  })

  useEffect(() => {
    if (postId) {
      form.setValue('postId', postId as string)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postId])

  useEffect(() => {
    if (parentCommentId) {
      form.setValue('commentId', parentCommentId)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parentCommentId])

  const onSubmit = async (values: CommentFormSchema) => {
    await commentMutation.mutateAsync(values, {
      onSuccess: () => {
        onSuccess()
        toast.success('Comment created!')
        form.reset()
      },
      onError: (error) => {
        console.log({ error })
        toast.error('Failed to create comment', { description: error.message })
      },
    })
  }

  return (
    <Form {...form}>
      <form
        className='shadow-custom mb-10 min-h-[149px] rounded-xl border border-gray-200'
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className='flex p-4'>
          <Image
            src='/person-placeholder.png'
            width={24}
            height={24}
            alt='person-placeholder'
            style={{ objectFit: 'contain' }}
            className='max-h-[24px]'
            priority
          />
          <div className='ml-4 flex w-full flex-col'>
            <FormField
              control={form.control}
              name='content'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      className='mt-3 border-b border-gray-200'
                      placeholder='Comment your thoughts'
                      {...field}
                      value={field?.value ?? ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className='mt-3 flex w-full flex-row-reverse'>
              <Button type='submit'>Comment</Button>
            </div>
          </div>
        </div>
      </form>
    </Form>
  )
}
