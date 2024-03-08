export const metadata = {
  title: `${process.env.appName} - Log In`,
}

export default function LogInLayout({ children }: { children: React.ReactNode }) {
  return <div className='h-screen'>{children}</div>
}
