import { usersTable } from '@/server/db/schema'
import { userFormSchema } from '@/validators/user'
import { createTRPCRouter, publicProcedure } from '../trpc'

export const userRouter = createTRPCRouter({
  create: publicProcedure.input(userFormSchema).mutation(async ({ ctx, input }) => {
    await ctx.db.insert(usersTable).values({
      ...input,
    })
  }),
})
