'use client'

import { useState } from 'react'
import SignUpForm from './signUpForm'
import LoginForm from './loginForm'
import { ModalWrapper } from '../modal-wrapper'
import { useTranslations } from 'next-intl'
import { Button } from '../../common/buttons/button'


export function AuthModal() {
  const t = useTranslations("auth");
  const [isSignUp, setIsSignUp] = useState(false);

  return (
    <ModalWrapper modalType="auth" title={isSignUp ? t('modal.registerTab') : t('modal.loginTab')}>
      <div className="flex flex-col gap-4">

        {isSignUp ? <SignUpForm /> : <LoginForm />}

        <Button
          variant="link"
          className="text-xs text-zinc-400 hover:underline cursor-pointer self-start"
          onClick={() => setIsSignUp(!isSignUp)}
        >
          {isSignUp ? t('modal.alreadyHaveAccount') : t('modal.dontHaveAccount')}
        </Button>
      </div>
    </ModalWrapper>
  )
}