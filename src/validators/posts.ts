import { type z } from 'zod'

import { postSchema } from '@/server/db/schema'

export const postFormSchema = postSchema.pick({
  title: true,
  content: true,
})
export type PostFormSchema = z.infer<typeof postFormSchema>
