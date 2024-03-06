import { currentUser } from '@clerk/nextjs'
import { and, desc, eq, sql } from 'drizzle-orm'
import { z } from 'zod'

import { commentsTable } from '@/server/db/schema'
import { commentFormSchema } from '@/validators/comments'
import { createTRPCRouter, protectedProcedure } from '../trpc'

export const commentRouter = createTRPCRouter({
  create: protectedProcedure.input(commentFormSchema).mutation(async ({ ctx, input }) => {
    const user = await currentUser()
    const userFullName = user?.firstName + ' ' + user?.lastName

    await ctx.db.insert(commentsTable).values({
      ...input,
      userId: ctx.auth.userId,
      userName: userFullName,
      userUsername: user!.username!,
    })
  }),
  getAllByPost: protectedProcedure.input(z.object({ postId: z.string() })).query(({ ctx, input }) => {
    return ctx.db.query.commentsTable.findMany({
      where: and(eq(commentsTable.postId, input.postId), sql`${commentsTable.commentId} IS NULL`),
      orderBy: desc(commentsTable.createdAt),
    })
  }),
  getAllByComment: protectedProcedure.input(z.object({ commentId: z.string() })).query(({ ctx, input }) => {
    return ctx.db.query.commentsTable.findMany({
      where: eq(commentsTable.commentId, input.commentId),
      orderBy: desc(commentsTable.createdAt),
    })
  }),
})
