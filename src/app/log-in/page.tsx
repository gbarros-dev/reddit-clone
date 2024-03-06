'use client'

import { SignInButton } from '@clerk/nextjs'

import GoogleLogo from '../assets/logo/google-logo'

export default function LogIn() {
  return (
    <div className='grid min-h-full place-items-center'>
      <div>
        <h1 className='text-[28px] font-medium leading-10 text-gray-900'>Join the best community ever</h1>
        <h3 className='text-xl leading-8 text-gray-600'>Create an account today</h3>

        <SignInButton afterSignInUrl='/' afterSignUpUrl='/'>
          <button className='mt-7 flex items-center rounded-xl border border-gray-300 px-5 py-[14px]'>
            <GoogleLogo />
            <p className='ml-3'>Continue with Google</p>
          </button>
        </SignInButton>

        <SignInButton afterSignInUrl='/' afterSignUpUrl='/'>
          <div className='mt-7 flex'>
            <p className='text-gray-700'>Already have an account?</p>
            <button className='ml-1'>Sign-in</button>
          </div>
        </SignInButton>
      </div>
    </div>
  )
}
