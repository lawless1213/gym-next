"use client";
import { useState } from "react";
import { Modal } from "@/app/ui/modal";
import LoginForm from "./loginForm";
import SignUpForm from "./signUpForm";

export default function LoginPage() {
  const [signUp, setSignUp] = useState(false);

  return (
    <Modal
      modal={{
        children: (
          <div className="flex flex-col gap-4">
            <div className="text-xl">Welcome to GYM, {signUp ? "register" :  "login"} with</div>

            {signUp ? <SignUpForm /> : <LoginForm />}

            <div
              className="text-xs text-dimmed hover:underline cursor-pointer self-start"
              onClick={() => setSignUp(!signUp)}>
              {signUp ? "Already have an account? Login" : "Don't have an account? Register"}
            </div>
          </div>
        ),
      }}
    />
  );
}
