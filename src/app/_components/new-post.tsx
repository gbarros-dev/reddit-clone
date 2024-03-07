'use client'

import Image from 'next/image'
import { useUser } from '@clerk/nextjs'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { api } from '@/trpc/react'
import { postFormSchema, type PostFormSchema } from '@/validators/posts'

type NewPostPops = {
  onRefresh: () => void
}

export default function NewPost({ onRefresh }: NewPostPops) {
  const { user } = useUser()

  const postMutation = api.post.create.useMutation()

  const form = useForm<PostFormSchema>({
    mode: 'onBlur',
    reValidateMode: 'onChange',
    resolver: zodResolver(postFormSchema),
    defaultValues: {
      title: '',
      content: '',
    },
  })

  const onSubmit = async (values: PostFormSchema) => {
    await postMutation.mutateAsync(values, {
      onSuccess: () => {
        onRefresh()
        toast.success('Post created!')
        form.reset()
      },
      onError: (error) => {
        console.log({ error })
        toast.error('Failed to create post', { description: error.message })
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
            src={user?.imageUrl ?? '/person-placeholder.png'}
            width={24}
            height={24}
            alt='person-placeholder'
            style={{ objectFit: 'contain' }}
            className='max-h-[24px] rounded-full'
            priority
          />
          <div className='ml-4 flex w-full flex-col'>
            <FormField
              control={form.control}
              name='title'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      className='mt-3'
                      placeholder='Title of your post'
                      {...field}
                      value={field?.value ?? ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='content'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      className='mt-3 border-b border-gray-200'
                      placeholder='Share your thoughts with the world!'
                      {...field}
                      value={field?.value ?? ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='mt-3 flex w-full flex-row-reverse'>
              <Button type='submit'>Post</Button>
            </div>
          </div>
        </div>
      </form>
    </Form>
  )
}
