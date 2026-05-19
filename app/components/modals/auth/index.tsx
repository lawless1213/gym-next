'use client'

import { useState } from 'react'
import SignUpForm from './signUpForm'
import LoginForm from './loginForm'
import { ModalWrapper } from '../modal-wrapper'


export function AuthModal() {
  const [isSignUp, setIsSignUp] = useState(false);

  return (
    <ModalWrapper modalType="auth" title={isSignUp ? 'Sign Up' : 'Auth'}>
      <div className="flex flex-col gap-4">

        {isSignUp ? <SignUpForm /> : <LoginForm />}

        <button
          className="text-xs text-zinc-400 hover:underline cursor-pointer self-start"
          onClick={() => setIsSignUp(!isSignUp)}
        >
          {isSignUp ? 'Already have an account? Login' : "Don't have an account? Register"}
        </button>
      </div>
    </ModalWrapper>
  )
}