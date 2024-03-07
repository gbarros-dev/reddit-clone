type MyPostsLayoutProps = {
  children: React.ReactNode
}

export const metadata = {
  title: `${process.env.appName} - My Posts`,
}

export default function MyPostsLayout({ children }: MyPostsLayoutProps) {
  return children
}
