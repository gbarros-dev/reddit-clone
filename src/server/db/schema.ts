import { createId } from '@paralleldrive/cuid2'
import { relations, sql, type InferSelectModel } from 'drizzle-orm'
import { mysqlTableCreator, text, timestamp, varchar } from 'drizzle-orm/mysql-core'
import { createSelectSchema } from 'drizzle-zod'

export const createTable = mysqlTableCreator((name) => `reddit-clone_${name}`)

// posts

export const postsTable = createTable('posts', {
  id: varchar('id', { length: 36 }).$defaultFn(createId).primaryKey(),
  title: text('title'),
  content: text('content').notNull(),
  userId: varchar('user_id', { length: 36 }).notNull(),
  userName: text('user_name').notNull(),
  userUsername: text('user_username').notNull(),
  createdAt: timestamp('created_at')
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp('updatedAt').onUpdateNow(),
})

export const postTableRelations = relations(postsTable, ({ many }) => ({
  comments: many(commentsTable),
}))

export type Post = InferSelectModel<typeof postsTable>

export const postSchema = createSelectSchema(postsTable)

// comments

export const commentsTable = createTable('comments', {
  id: varchar('id', { length: 36 }).$defaultFn(createId).primaryKey(),
  content: text('content').notNull(),
  postId: varchar('post_id', { length: 36 }).notNull(),
  commentId: varchar('comment_id', { length: 36 }),
  userId: varchar('user_id', { length: 36 }).notNull(),
  userName: text('user_name').notNull(),
  userUsername: text('user_username').notNull(),
  createdAt: timestamp('created_at')
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp('updatedAt').onUpdateNow(),
})

export const commentsTableRelations = relations(commentsTable, ({ one }) => ({
  post: one(postsTable, {
    fields: [commentsTable.postId],
    references: [postsTable.id],
  }),
}))

export type Comment = InferSelectModel<typeof commentsTable>

export const commentSchema = createSelectSchema(commentsTable)

// votes

export const votesTable = createTable('votes', {
  id: varchar('id', { length: 36 }).$defaultFn(createId).primaryKey(),
  type: text('type', { enum: ['up', 'down'] }).notNull(),
  postId: varchar('post_id', { length: 36 }),
  commentId: varchar('comment_id', { length: 36 }),
  userId: varchar('user_id', { length: 36 }).notNull(),
  createdAt: timestamp('created_at')
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp('updatedAt').onUpdateNow(),
})

export type Vote = InferSelectModel<typeof votesTable>

export const voteSchema = createSelectSchema(votesTable)
