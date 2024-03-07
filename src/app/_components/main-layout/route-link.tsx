'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { cn } from '@/lib/utils'
import type { Section } from '@/types/sections'

type RouteLinkProps = {
  item: Section
}

export default function RouteLink({ item }: RouteLinkProps) {
  const pathname = usePathname()

  const Icon = item.icon
  const isHome = item.href === '/' && (pathname === '/' || pathname.includes('/post/'))
  const isCurent = item.href === pathname || isHome

  return (
    <Link
      href={item.href}
      className={cn(
        'stroke-color flex items-center space-x-4 rounded-xl px-4 py-3',
        'group transition-all hover:bg-gray-50 hover:text-indigo-600',
        isCurent ? 'bg-gray-50 text-indigo-600' : 'bg-transparent text-gray-600',
      )}
    >
      <Icon />
      <p
        className={cn(
          'transition-all group-hover:text-indigo-600',
          isCurent ? 'text-indigo-600' : 'text-gray-700',
        )}
      >
        {item.title}
      </p>
    </Link>
  )
}
