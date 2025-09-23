import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
  updateProfile,
  User,
} from "firebase/auth";

import { auth, googleProvider } from "../lib/firebase";

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  signInWithUsername: (username: string, password: string) => Promise<void>;
  registerWithUsername: (username: string, password: string, displayName?: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  usernameFromEmail: (email?: string | null) => string;
  usernameToEmail: (username: string) => string;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const USERNAME_DOMAIN = import.meta.env.VITE_AUTH_USERNAME_DOMAIN ?? "inventory.local";

const normalizeIdentifier = (identifier: string) => identifier.trim().toLowerCase();

const usernameToEmail = (identifier: string) => {
  const normalized = normalizeIdentifier(identifier);
  return normalized.includes("@") ? normalized : `${normalized}@${USERNAME_DOMAIN}`;
};

const emailToUsername = (email?: string | null) => {
  if (!email) return "";
  const [username] = email.split("@");
  return username;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithUsername = useCallback(async (username: string, password: string) => {
    await signInWithEmailAndPassword(auth, usernameToEmail(username), password);
  }, []);

  const registerWithUsername = useCallback(
    async (username: string, password: string, displayName?: string) => {
      const credential = await createUserWithEmailAndPassword(
        auth,
        usernameToEmail(username),
        password
      );
      const profileName = displayName?.trim() || username;
      if (profileName && credential.user) {
        await updateProfile(credential.user, { displayName: profileName });
      }
    },
    []
  );

  const signInWithGoogle = useCallback(async () => {
    await signInWithPopup(auth, googleProvider);
  }, []);

  const signOut = useCallback(async () => {
    await firebaseSignOut(auth);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      signInWithUsername,
      registerWithUsername,
      signInWithGoogle,
      signOut,
      usernameFromEmail: emailToUsername,
      usernameToEmail,
    }),
    [loading, registerWithUsername, signInWithGoogle, signInWithUsername, signOut, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth harus digunakan di dalam AuthProvider");
  }

  return context;
};
