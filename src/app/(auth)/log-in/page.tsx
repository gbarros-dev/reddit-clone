'use client'

import { useSignUp } from '@clerk/nextjs'
import { toast } from 'sonner'

import GoogleLogo from '../../assets/logo/google-logo'

export default function LogIn() {
  const { signUp, isLoaded } = useSignUp()

  const handleSignUpWithGoogle = async () => {
    try {
      if (!isLoaded) {
        toast.error('Failed to sign up with Google')
        return null
      }

      await signUp.authenticateWithRedirect({
        strategy: 'oauth_google',
        redirectUrl: '/sso-callback',
        redirectUrlComplete: '/',
      })
    } catch (error) {
      console.error('Failed to sign up with Google:', error)
    }
  }

  return (
    <div className='grid min-h-full place-items-center'>
      <div>
        <h1 className='text-[28px] font-medium leading-10 text-gray-900'>Join the best community ever</h1>
        <h3 className='text-xl leading-8 text-gray-600'>Create an account today</h3>

        <button
          className='mt-7 flex items-center rounded-xl border border-gray-300 px-5 py-[14px]'
          onClick={() => handleSignUpWithGoogle()}
        >
          <GoogleLogo />
          <p className='ml-3 text-gray-700'>Continue with Google</p>
        </button>

        <div className='mt-7 flex'>
          <p className='text-gray-700'>Already have an account?</p>
          <button
            className='ml-1 font-medium leading-6 text-[#172554]'
            onClick={() => handleSignUpWithGoogle()}
          >
            Sign-in
          </button>
        </div>
      </div>
    </div>
  )
}
