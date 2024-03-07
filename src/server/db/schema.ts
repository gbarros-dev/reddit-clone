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
  createdAt: timestamp('created_at')
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp('updatedAt').onUpdateNow(),
})

export const postTableRelations = relations(postsTable, ({ one, many }) => ({
  comments: many(commentsTable),
  user: one(usersTable, {
    fields: [postsTable.userId],
    references: [usersTable.id],
  }),
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
  user: one(usersTable, {
    fields: [commentsTable.userId],
    references: [usersTable.id],
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

// users

export const usersTable = createTable('users', {
  id: varchar('id', { length: 32 }).primaryKey(),
  username: text('username').notNull(),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  profileImageUrl: text('profile_image_url').notNull(),
  createdAt: timestamp('created_at')
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
})

export type User = InferSelectModel<typeof usersTable>

export const userSchema = createSelectSchema(usersTable)
