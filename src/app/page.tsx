import { unstable_noStore as noStore } from 'next/cache'
import { redirect } from 'next/navigation'

export default function Home() {
  noStore()

  redirect('/feed')

  return null
}
