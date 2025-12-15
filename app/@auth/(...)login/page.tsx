"use client";
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/app/lib/firebaseConfig";
import { Modal } from "@/app/ui/modal";

export default function LoginPage() {
  const [signUp, setSignUp] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("Logged in!");
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <Modal
      modal={{
        children: (
          <div className="flex flex-col gap-4">
            <div className="text-xl">Welcome to GYM, {signUp ? "login" : "register"} with</div>
            <div className="flex flex-col items-center">
              <input
                type="email"
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)}
                className="border p-2 mb-2 w-full"
              />
              <input
                type="password"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
                className="border p-2 mb-2 w-full"
              />
            </div>
            <div className="flex gap-4 items-center justify-between">
              <div
                className="text-xs text-dimmed hover:underline cursor-pointer"
                onClick={() => setSignUp(!signUp)}>
                {signUp ? "Already have an account? Login" : "Don't have an account? Register"}
              </div>
              <button
                onClick={handleLogin}
                className="bg-blue-500 text-white px-4 py-2">
                Login
              </button>
            </div>
          </div>
        ),
      }}
    />
  );
}
