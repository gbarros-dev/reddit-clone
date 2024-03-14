/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { headers } from 'next/headers'

import { env } from '@/env'
import { db } from '@/server/db'
import { usersTable } from '@/server/db/schema'

export async function POST(req: Request) {
  // You can find this in the Clerk Dashboard -> Webhooks -> choose the webhook
  const WEBHOOK_SECRET = env.CLERK_SECRET_KEY

  if (!WEBHOOK_SECRET) {
    throw new Error('Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local')
  }

  // Get the headers
  const headerPayload = headers()
  const svix_id = headerPayload.get('svix-id')
  const svix_timestamp = headerPayload.get('svix-timestamp')
  const svix_signature = headerPayload.get('svix-signature')

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occured -- no svix headers', {
      status: 400,
    })
  }

  // Get the body
  const payload = await req.json()
  const userData = payload.data

  await db.insert(usersTable).values({
    id: userData.id,
    firstName: userData.first_name,
    lastName: userData.last_name,
    username: userData.username,
    profileImageUrl: userData.image_url,
  })

  return new Response('', { status: 200 })
}
