import { type CommentBase, type User } from '@/server/db/schema'

export type Comment = CommentBase & {
  user: User
}
