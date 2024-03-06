import { and, eq, sql, sum } from 'drizzle-orm'
import { z } from 'zod'

import { votesTable } from '@/server/db/schema'
import { voteFormSchema } from '@/validators/votes'
import { createTRPCRouter, protectedProcedure, publicProcedure } from '../trpc'

export const voteRouter = createTRPCRouter({
  create: protectedProcedure.input(voteFormSchema).mutation(async ({ ctx, input }) => {
    const existentVoteQuery = ctx.db.select().from(votesTable)

    if (input.postId) {
      void existentVoteQuery.where(
        and(eq(votesTable.postId, input.postId), eq(votesTable.userId, ctx.auth.userId)),
      )
    } else if (input.commentId) {
      void existentVoteQuery.where(
        and(eq(votesTable.commentId, input.commentId), eq(votesTable.userId, ctx.auth.userId)),
      )
    }

    const existentVoteResult = await existentVoteQuery.execute()

    if (existentVoteResult?.length && existentVoteResult[0]?.id) {
      if (existentVoteResult[0].type === input.type) {
        await ctx.db.delete(votesTable).where(eq(votesTable.id, existentVoteResult[0].id))
      } else {
        await ctx.db
          .update(votesTable)
          .set({ type: input.type })
          .where(eq(votesTable.id, existentVoteResult[0].id))
      }
    } else {
      await ctx.db.insert(votesTable).values({
        ...input,
        userId: ctx.auth.userId,
      })
    }
  }),
  getAll: publicProcedure
    .input(z.object({ postId: z.string().optional(), commentId: z.string().optional() }))
    .query(async ({ ctx, input }) => {
      const query = ctx.db
        .select({
          totalVotes: sum(sql`CASE WHEN type = 'up' THEN 1 WHEN type = 'down' THEN -1 ELSE 0 END`),
        })
        .from(votesTable)

      if (input.postId) {
        void query.where(eq(votesTable.postId, input.postId))
      } else if (input.commentId) {
        void query.where(eq(votesTable.commentId, input.commentId))
      }

      const result = await query.execute()

      return {
        totalVotes: result[0]?.totalVotes ?? 0,
      }
    }),
  getByCurrentUser: protectedProcedure
    .input(z.object({ postId: z.string().optional(), commentId: z.string().optional() }))
    .query(async ({ ctx, input }) => {
      const query = ctx.db.select().from(votesTable)

      if (input.postId) {
        void query.where(and(eq(votesTable.postId, input.postId), eq(votesTable.userId, ctx.auth.userId)))
      } else if (input.commentId) {
        void query.where(
          and(eq(votesTable.commentId, input.commentId), eq(votesTable.userId, ctx.auth.userId)),
        )
      }

      const result = await query.execute()

      return result?.length ? result[0] : null
    }),
})
