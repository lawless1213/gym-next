// app/login/page.tsx або pages/login.tsx
"use client";
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/app/lib/firebaseConfig";

export default function LoginPage() {
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
    <div className="flex flex-col items-center mt-10">
      <input
        type="email"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
        className="border p-2 mb-2"
      />
      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
        className="border p-2 mb-2"
      />
      <button onClick={handleLogin} className="bg-blue-500 text-white px-4 py-2">
        Login
      </button>
    </div>
  );
}
