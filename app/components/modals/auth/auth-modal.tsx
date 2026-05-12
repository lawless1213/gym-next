// components/modals/auth-modal.tsx
'use client'
import { useState } from 'react'
import { useModal } from '@/app/lib/modal/modal-store'
import SignUpForm from './signUpForm'
import LoginForm from './loginForm'
import { ModalWrapper } from '../modal-wrapper'


export function AuthModal() {
  const { type, close } = useModal();
  const [isSignUp, setIsSignUp] = useState(false);
  const isOpen = type === 'auth';

  return (
    <ModalWrapper modalType="auth">
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