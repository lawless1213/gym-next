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
  updateEmail,
  deleteUser,
} from "firebase/auth";
import { auth } from "@/lib/config/firebaseConfig";

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  // Нові функції:
  sendVerificationEmail: () => Promise<void>;
  checkEmailVerified: () => Promise<boolean>;
  changePassword: (newPassword: string) => Promise<void>;
  changeEmail: (newEmail: string) => Promise<void>;
  deleteAccount: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(auth.currentUser);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signup = async (email: string, password: string) => {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    // Автоматично надсилаємо лист підтвердження при реєстрації
    if (res.user) {
      await sendEmailVerification(res.user);
    }
  };

  const logout = async () => {
    await signOut(auth);
  };

  // 1. Надіслати лист для підтвердження пошти
  const sendVerificationEmail = async () => {
    if (!auth.currentUser) throw new Error("Користувач не авторизований");
    await sendEmailVerification(auth.currentUser);
  };

  // 2. Перевірити status підтвердження пошти (оновлює стан user)
  const checkEmailVerified = async (): Promise<boolean> => {
    if (!auth.currentUser) return false;
    // Оновлюємо дані користувача з сервера Firebase
    await auth.currentUser.reload();
    const updatedUser = auth.currentUser;
    setUser(updatedUser); // оновлюємо стан у React
    return updatedUser.emailVerified;
  };

  // 3. Зміна паролю
  const changePassword = async (newPassword: string) => {
    if (!auth.currentUser) throw new Error("Користувач не авторизований");
    await updatePassword(auth.currentUser, newPassword);
  };

  // 4. Зміна пошти
  const changeEmail = async (newEmail: string) => {
    if (!auth.currentUser) throw new Error("Користувач не авторизований");
    await updateEmail(auth.currentUser, newEmail);
    // За бажанням: одразу надіслати підтвердження на нову пошту
    await sendEmailVerification(auth.currentUser);
  };

  // 5. Видалення акаунту
  const deleteAccount = async () => {
    if (!auth.currentUser) throw new Error("Користувач не авторизований");
    await deleteUser(auth.currentUser);
  };

  const value = useMemo(
    () => ({
      user,
      loading,
      login,
      signup,
      logout,
      sendVerificationEmail,
      checkEmailVerified,
      changePassword,
      changeEmail,
      deleteAccount,
    }),
    [user, loading]
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