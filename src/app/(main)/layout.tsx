import MainLayoutBase from '@/components/main-layout'

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return <MainLayoutBase>{children}</MainLayoutBase>
}
