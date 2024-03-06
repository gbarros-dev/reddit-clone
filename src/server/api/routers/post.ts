import { currentUser } from '@clerk/nextjs'
import { eq } from 'drizzle-orm'
import { z } from 'zod'

import { createTRPCRouter, protectedProcedure, publicProcedure } from '@/server/api/trpc'
import { postsTable } from '@/server/db/schema'
import { postFormSchema } from '@/validators/posts'

export const postRouter = createTRPCRouter({
  create: protectedProcedure.input(postFormSchema).mutation(async ({ ctx, input }) => {
    const user = await currentUser()
    const userFullName = user?.firstName + ' ' + user?.lastName

    await ctx.db.insert(postsTable).values({
      ...input,
      userId: ctx.auth.userId,
      userName: userFullName,
      userUsername: user!.username!,
    })
  }),
  getAll: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.query.postsTable.findMany({
      orderBy: (posts, { desc }) => [desc(posts.createdAt)],
    })
  }),
  getAllByUser: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.query.postsTable.findMany({
      where: eq(postsTable.userId, ctx.auth.userId),
      orderBy: (posts, { desc }) => [desc(posts.createdAt)],
    })
  }),
  getOne: protectedProcedure.input(z.object({ id: z.string() })).query(async ({ ctx, input }) => {
    return ctx.db.query.postsTable.findFirst({
      where: eq(postsTable.id, input.id),
    })
  }),
})
