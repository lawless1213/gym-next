"use client";
import { Button } from "@/app/ui/buttons/button";
import { useState } from "react";
// import { signInWithEmailAndPassword } from "firebase/auth";
// import { auth } from "@/app/lib/firebaseConfig";

export default function SignUpForm() {
  // const [email, setEmail] = useState("");
  // const [password, setPassword] = useState("");

  const handleLogin = async () => {
    // try {
    //   await signInWithEmailAndPassword(auth, email, password);
    //   alert("Logged in!");
    // } catch (err: any) {
    //   alert(err.message);
    // }
  };

  return (
    <>
      {/* <div className="flex flex-col items-center">
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
      </div> */}
      <Button
        button={{
          label: "Register",
          big: true,
          onClick: handleLogin,
        }}
      />
    </>
  );
}
