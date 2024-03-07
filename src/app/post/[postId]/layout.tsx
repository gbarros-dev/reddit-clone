type PostDetailsProps = {
  children: React.ReactNode
}

export const metadata = {
  title: `${process.env.appName} - Post`,
}

export default function PostDetails({ children }: PostDetailsProps) {
  return children
}
