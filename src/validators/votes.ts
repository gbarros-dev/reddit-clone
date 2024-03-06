import { type z } from 'zod'

import { voteSchema } from '@/server/db/schema'

export const voteFormSchema = voteSchema.pick({
  type: true,
  postId: true,
  commentId: true,
})
export type VoteFormSchema = z.infer<typeof voteFormSchema>
