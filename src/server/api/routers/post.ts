import { TRPCError } from '@trpc/server'
import { eq, isNull } from 'drizzle-orm'
import { z } from 'zod'

import { createTRPCRouter, protectedProcedure, publicProcedure } from '@/server/api/trpc'
import { commentsTable, postsTable } from '@/server/db/schema'
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
  getOne: publicProcedure.input(z.object({ id: z.string() })).query(async ({ ctx, input }) => {
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
  getOneWithComments: publicProcedure.input(z.object({ id: z.string() })).query(async ({ ctx, input }) => {
    const postWithNestedComments = await ctx.db.query.postsTable.findFirst({
      columns: {
        id: true,
        title: true,
        content: true,
        createdAt: true,
        updatedAt: true,
        userId: true,
      },
      where: eq(postsTable.id, input.id),
      with: {
        comments: {
          where: isNull(commentsTable.commentId),
          with: {
            nestedComments: {
              with: {
                nestedComments: {
                  with: {
                    nestedComments: {
                      with: {
                        user: true,
                      },
                    },
                    user: true,
                  },
                },
                user: true,
              },
            },
            user: true,
          },
        },
        user: true,
      },
    })

    if (!postWithNestedComments) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Post not found',
      })
    }

    return postWithNestedComments
  }),
})
