import { type PostBase, type User } from '@/server/db/schema'

export type Post = PostBase & {
  user: User
}
