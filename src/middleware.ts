import { authMiddleware } from '@clerk/nextjs'

export default authMiddleware({
  publicRoutes: [
    '/',
    '/feed(.*)',
    '/my-posts',
    '/log-in',
    '/sso-callback',
    '/(api|trpc)(.*)',
    '/api/webhooks(.*)',
  ],
})

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
}
