"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { User } from "firebase/auth";
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  sendEmailVerification, 
  updatePassword, 
  verifyBeforeUpdateEmail, 
  deleteUser, 
  reauthenticateWithCredential, 
  EmailAuthProvider, 
  GoogleAuthProvider, 
  GithubAuthProvider, 
  signInWithPopup 
} from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/lib/config/firebaseConfig";
import { deleteUserData } from "@/lib/actions/user";
import { subscribe } from "diagnostics_channel";

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithGithub: () => Promise<void>;
  logout: () => Promise<void>;
  sendVerificationEmail: () => Promise<void>;
  checkEmailVerified: () => Promise<boolean>;
  changePassword: (newPassword: string, currentPassword?: string) => Promise<void>;
  changeEmail: (newEmail: string, currentPassword?: string) => Promise<void>;
  deleteAccount: (password?: string) => Promise<void>;
  reauthenticate: (password: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// Допоміжна функція для ініціалізації документа в Firestore
async function ensureUserDoc(user: User) {
  const userRef = doc(db, "users", user.uid);
  const userSnap = await getDoc(userRef);

  // Створюємо базовий документ тільки якщо його ще немає
  if (!userSnap.exists()) {
    await setDoc(userRef, {
      displayName: user.displayName || "",
      avatarUrl: user.photoURL || "",
      createdAt: serverTimestamp(),
      subscribed: {
        type: null,
        freeAiTries: 5,
      },
    }, { merge: true });
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(auth.currentUser);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const login = async (email: string, password: string) => {
    const res = await signInWithEmailAndPassword(auth, email, password);
    if (res.user) await ensureUserDoc(res.user);
  };

  const signup = async (email: string, password: string) => {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    if (res.user) await ensureUserDoc(res.user);
  };

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const res = await signInWithPopup(auth, provider);
    if (res.user) await ensureUserDoc(res.user);
  };

  const loginWithGithub = async () => {
    const provider = new GithubAuthProvider();
    const res = await signInWithPopup(auth, provider);
    if (res.user) await ensureUserDoc(res.user);
  };

  const logout = async () => {
    await signOut(auth);
  };

  const reauthenticate = async (password: string) => {
    const currentUser = auth.currentUser;
    if (!currentUser || !currentUser.email) {
      throw new Error("Користувач не авторизований");
    }
    const credential = EmailAuthProvider.credential(currentUser.email, password);
    await reauthenticateWithCredential(currentUser, credential);
  };

  const sendVerificationEmail = async () => {
    if (!auth.currentUser) throw new Error("Користувач не авторизований");
    await sendEmailVerification(auth.currentUser);
  };

  const checkEmailVerified = async (): Promise<boolean> => {
    if (!auth.currentUser) return false;
    await auth.currentUser.reload();
    const updatedUser = auth.currentUser;
    setUser(updatedUser);
    return updatedUser.emailVerified;
  };

  const changePassword = async (newPassword: string, currentPassword?: string) => {
    if (!auth.currentUser) throw new Error("Користувач не авторизований");

    if (currentPassword && currentPassword === newPassword) {
      const error = new Error("Новий пароль не може збігатися з поточним");
      (error as any).code = "auth/same-password";
      throw error;
    }

    if (currentPassword) {
      await reauthenticate(currentPassword);
    }
    await updatePassword(auth.currentUser, newPassword);
  };

  const changeEmail = async (newEmail: string, currentPassword?: string) => {
    if (!auth.currentUser) throw new Error("No user");

    if (currentPassword) {
      await reauthenticate(currentPassword);
    }

    const baseUrl = typeof window !== "undefined" ? window.location.origin : "";

    const actionCodeSettings = {
      url: `${baseUrl}/auth/action`,
      handleCodeInApp: true,
    };

    await verifyBeforeUpdateEmail(auth.currentUser, newEmail, actionCodeSettings);
  };

  const deleteAccount = async (password?: string) => {
    const currentUser = auth.currentUser;
    if (!currentUser) throw new Error("Користувач не авторизований");

    if (password) {
      await reauthenticate(password);
    }

    const userId = currentUser.uid;

    await deleteUserData(userId);
    await deleteUser(currentUser);
  };

  const value = useMemo(
    () => ({
      user,
      loading,
      login,
      signup,
      loginWithGoogle,
      loginWithGithub,
      logout,
      sendVerificationEmail,
      checkEmailVerified,
      changePassword,
      changeEmail,
      deleteAccount,
      reauthenticate,
    }),
    [user, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}