import { type z } from 'zod'

import { commentSchema } from '@/server/db/schema'

export const commentFormSchema = commentSchema.pick({
  content: true,
  postId: true,
  commentId: true,
})
export type CommentFormSchema = z.infer<typeof commentFormSchema>
