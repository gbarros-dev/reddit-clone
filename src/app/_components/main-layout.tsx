import { auth, currentUser, UserButton } from '@clerk/nextjs'

import CommentTextIcon from '@/app/assets/icons/comment-text-icon'
import HomeIcon from '@/app/assets/icons/home-icon'
import LogInIcon from '@/app/assets/icons/log-in-icon'
import type { Sections } from '@/types/sections'
import RouteLink from './route-link'

const baseNavItems: Sections = [
  {
    id: 'home',
    title: 'Home',
    icon: HomeIcon,
    href: '/',
  },
]

const signedOutNavItems: Sections = [
  ...baseNavItems,
  {
    id: 'login',
    title: 'Login',
    icon: LogInIcon,
    href: '/log-in',
  },
]

const signedInNavItems: Sections = [
  ...baseNavItems,
  {
    id: 'my-posts',
    title: 'My posts',
    href: '/my-posts',
    icon: CommentTextIcon,
  },
]

type MainLayoutProps = {
  children: React.ReactNode
}

export default async function MainLayout({ children }: MainLayoutProps) {
  const { userId } = auth()

  const user = await currentUser()

  return (
    <div className='flex h-screen overflow-hidden'>
      {/* navbar */}
      <nav className='flex w-full max-w-[277px] flex-col justify-between border-r border-gray-200 py-6 pl-4 pr-5'>
        <ul className='space-y-1'>
          {(userId ? signedInNavItems : signedOutNavItems).map((item) => (
            <RouteLink key={item.id} item={item} />
          ))}
        </ul>
        <div className='flex items-center pl-4'>
          <UserButton afterSignOutUrl='/' />
          <p className='ml-4 font-medium text-gray-700'>
            {user?.firstName} {user?.lastName}
          </p>
        </div>
      </nav>

      {/* main content */}
      <main className='h-full flex-1 overflow-y-auto pb-[23px] pl-[143px] pr-[420px] pt-10'>
        <div className='flex h-full flex-col items-center'>
          <div className='w-full max-w-[600px]'>{children}</div>
        </div>
      </main>
    </div>
  )
}
