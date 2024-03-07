/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { type NextRequest } from 'next/server'

export default async function handler(req: NextRequest): Promise<Response> {
  if (req.method === 'POST') {
    try {
      const userData = await req.json()

      console.log({ userData })

      // Respond back with success
      return new Response('OK', {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      })
    } catch (error) {
      // Handle any errors
      return new Response(JSON.stringify({ error: 'Failed to create user' }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      })
    }
  } else {
    // Method Not Allowed
    return new Response(null, { status: 405 })
  }
}
