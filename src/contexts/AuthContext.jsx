import { createContext, useContext, useEffect, useState } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  updateProfile,
} from "firebase/auth";
import { doc, getDoc, onSnapshot, setDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../firebase";
import { isAdminEmail } from "../lib/admin";
import { isValidEmail, normalizeEmail } from "../lib/parentEmail";

const AuthContext = createContext(null);
const googleProvider = new GoogleAuthProvider();

function userRole(email) {
  return isAdminEmail(email) ? "admin" : "student";
}

async function ensureUserDoc(user) {
  const ref = doc(db, "users", user.uid);
  const snap = await getDoc(ref);
  const role = userRole(user.email);
  if (!snap.exists()) {
    await setDoc(ref, {
      email: user.email || "",
      displayName: user.displayName || "",
      photoURL: user.photoURL || "",
      role,
      createdAt: serverTimestamp(),
      progress: { pythonChapter1: false },
      tokens: 0,
      ownedItems: ["bg-default"],
      equipped: { background: "bg-default", decorations: [] },
      loginStreak: 0,
      lastLoginDate: null,
      bestLoginStreak: 0,
      parentEmail: "",
    });
    return;
  }
  const data = snap.data() || {};
  if (data.role !== role || data.email !== (user.email || "")) {
    await setDoc(
      ref,
      {
        email: user.email || data.email || "",
        role,
      },
      { merge: true }
    );
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [parentEmail, setParentEmail] = useState("");

  useEffect(() => {
    let unsubProfile = () => {};
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      unsubProfile();
      unsubProfile = () => {};
      setUser(currentUser);
      if (currentUser) {
        try {
          await ensureUserDoc(currentUser);
        } catch (err) {
          console.error("Failed to sync user profile", err);
        }
        unsubProfile = onSnapshot(
          doc(db, "users", currentUser.uid),
          (snap) => {
            setParentEmail(String(snap.data()?.parentEmail || ""));
          },
          () => {
            setParentEmail("");
          },
        );
      } else {
        setParentEmail("");
      }
      setLoading(false);
    });
    return () => {
      unsubProfile();
      unsubscribe();
    };
  }, []);

  const login = async (email, password) => {
    const credential = await signInWithEmailAndPassword(auth, email, password);
    await ensureUserDoc(credential.user);
    return credential;
  };

  const loginWithGoogle = async () => {
    const credential = await signInWithPopup(auth, googleProvider);
    await ensureUserDoc(credential.user);
    return credential;
  };

  const register = async (email, password, displayName, parentEmailValue = "") => {
    const credential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    if (displayName) {
      await updateProfile(credential.user, { displayName });
    }
    await setDoc(doc(db, "users", credential.user.uid), {
      email,
      displayName: displayName || "",
      photoURL: "",
      role: userRole(email),
      createdAt: serverTimestamp(),
      progress: { pythonChapter1: false },
      tokens: 0,
      ownedItems: ["bg-default"],
      equipped: { background: "bg-default", decorations: [] },
      loginStreak: 0,
      lastLoginDate: null,
      bestLoginStreak: 0,
      parentEmail: isValidEmail(parentEmailValue)
        ? normalizeEmail(parentEmailValue)
        : "",
    });
    return credential;
  };

  const logout = () => signOut(auth);

  const saveParentEmail = async (value) => {
    if (!user) throw new Error("Please sign in first");
    const next = normalizeEmail(value);
    if (next && !isValidEmail(next)) {
      throw new Error("invalid-parent-email");
    }
    await updateDoc(doc(db, "users", user.uid), { parentEmail: next });
    setParentEmail(next);
    return next;
  };

  const isAdmin = isAdminEmail(user?.email);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAdmin,
        parentEmail,
        login,
        loginWithGoogle,
        register,
        saveParentEmail,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
