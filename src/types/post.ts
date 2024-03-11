import { type PostBase, type User } from '@/server/db/schema'
import { type Comment } from './comment'

export type Post = PostBase & {
  comments?: Comment[]
  user: User
}
