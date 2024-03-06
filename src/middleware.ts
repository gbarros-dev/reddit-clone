import { authMiddleware } from '@clerk/nextjs'

export default authMiddleware({
  publicRoutes: ['/', '/log-in', '/api/trpc/post.getAll'],
  ignoredRoutes: ['/((?!api|trpc))(_next.*|.+.[w]+$)'],
})

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
}
