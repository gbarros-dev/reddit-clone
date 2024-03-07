import { TRPCError } from '@trpc/server'
import { eq } from 'drizzle-orm'
import { z } from 'zod'

import { createTRPCRouter, protectedProcedure, publicProcedure } from '@/server/api/trpc'
import { postsTable } from '@/server/db/schema'
import { postFormSchema } from '@/validators/posts'

export const postRouter = createTRPCRouter({
  create: protectedProcedure.input(postFormSchema).mutation(async ({ ctx, input }) => {
    await ctx.db.insert(postsTable).values({
      ...input,
      userId: ctx.auth.userId,
    })
  }),
  getAll: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.query.postsTable.findMany({
      with: {
        user: true,
      },
      orderBy: (posts, { desc }) => [desc(posts.createdAt)],
    })
  }),
  getAllByUser: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.query.postsTable.findMany({
      where: eq(postsTable.userId, ctx.auth.userId),
      with: {
        user: true,
      },
      orderBy: (posts, { desc }) => [desc(posts.createdAt)],
    })
  }),
  getOne: protectedProcedure.input(z.object({ id: z.string() })).query(async ({ ctx, input }) => {
    const result = await ctx.db.query.postsTable.findFirst({
      where: eq(postsTable.id, input.id),
      with: {
        user: true,
      },
    })

    if (!result) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Post not found',
      })
    }

    return result
  }),
})
