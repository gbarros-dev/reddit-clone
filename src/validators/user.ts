import { type z } from 'zod'

import { userSchema } from '@/server/db/schema'

export const userFormSchema = userSchema.pick({
  id: true,
  username: true,
  firstName: true,
  lastName: true,
  profileImageUrl: true,
})
export type UserFormSchema = z.infer<typeof userFormSchema>
