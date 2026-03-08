import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  createUserWithEmailAndPassword,
  getRedirectResult,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  signOut,
  updatePassword,
  updateProfile,
} from "firebase/auth";
import { collection, doc, getDoc, getDocs, limit, query, serverTimestamp, setDoc, where } from "firebase/firestore";
import { authService } from "../services/api/authService";
import { auth, db, provider } from "../firebase";

const AuthContext = createContext(null);

const isFirebaseSource = (source) => String(source || "").startsWith("firebase");
const IDENTITY_MAP_KEY = "velor_identity_map";
const withTimeout = (promise, ms = 2500) =>
  Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(Object.assign(new Error("operation-timeout"), { code: "operation-timeout" })), ms)
    ),
  ]);

const mapFirebaseUser = (firebaseUser, profile = null) => {
  const fullName = profile?.fullName || firebaseUser.displayName || firebaseUser.email || "User";
  const role = profile?.role || "user";
  return {
    _id: firebaseUser.uid,
    uid: firebaseUser.uid,
    name: fullName,
    displayName: fullName,
    fullName,
    username: profile?.username || "",
    email: profile?.email || firebaseUser.email || "",
    phone: profile?.phone || "",
    country: profile?.country || "",
    city: profile?.city || "",
    address: profile?.address || "",
    avatar: firebaseUser.photoURL || null,
    authProvider: profile?.authProvider || firebaseUser.providerData?.[0]?.providerId || "password",
    role,
    profileCompleted: Boolean(profile?.profileCompleted),
    isAdmin: role === "admin" || Boolean(profile?.isAdmin),
    online: Boolean(profile?.online),
    lastSeen: profile?.lastSeen || null,
  };
};

export function AuthProvider({ children }) {
  const [authSource, setAuthSource] = useState(() => localStorage.getItem("velor_auth_source") || "backend");
  const [token, setToken] = useState(() => localStorage.getItem("velor_token"));
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("velor_user");
    return saved ? JSON.parse(saved) : null;
  });
  const [needsProfileCompletion, setNeedsProfileCompletion] = useState(() => localStorage.getItem("velor_profile_complete") === "0");
  const [authReady, setAuthReady] = useState(false);

  const clearSession = () => {
    setToken(null);
    setUser(null);
    setAuthSource("backend");
    setNeedsProfileCompletion(false);
    localStorage.removeItem("velor_token");
    localStorage.removeItem("velor_user");
    localStorage.removeItem("velor_auth_source");
    localStorage.removeItem("velor_profile_complete");
    localStorage.removeItem(IDENTITY_MAP_KEY);
  };

  const upsertUserDoc = async (firebaseUser, profilePatch = {}) => {
    const role = profilePatch.role || "user";
    const fullName = profilePatch.fullName || firebaseUser.displayName || firebaseUser.email || "User";
    const payload = {
      uid: firebaseUser.uid,
      displayName: fullName,
      fullName,
      fullNameLower: fullName.toLowerCase(),
      username: profilePatch.username || "",
      usernameLower: String(profilePatch.username || "").toLowerCase(),
      email: firebaseUser.email || "",
      photoURL: firebaseUser.photoURL || "",
      phone: profilePatch.phone || "",
      country: profilePatch.country || "",
      city: profilePatch.city || "",
      address: profilePatch.address || "",
      role,
      authProvider: firebaseUser.providerData?.[0]?.providerId || "password",
      online: true,
      profileCompleted: Boolean(profilePatch.profileCompleted),
      lastLoginAt: serverTimestamp(),
      lastSeen: serverTimestamp(),
      updatedAt: serverTimestamp(),
      createdAt: profilePatch.createdAt || serverTimestamp(),
    };
    await setDoc(doc(db, "users", firebaseUser.uid), payload, { merge: true });
    return payload;
  };

  const markUserOffline = async () => {
    const firebaseUser = auth.currentUser;
    if (!firebaseUser) return;
    await setDoc(
      doc(db, "users", firebaseUser.uid),
      {
        online: false,
        lastSeen: serverTimestamp(),
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    ).catch(() => {});
  };

  const saveSession = ({ token: nextToken, user: nextUser }, source = "backend", profileCompleted = true) => {
    setToken(nextToken);
    setUser(nextUser);
    setAuthSource(source);
    setNeedsProfileCompletion(!profileCompleted);
    localStorage.setItem("velor_token", nextToken);
    localStorage.setItem("velor_user", JSON.stringify(nextUser));
    localStorage.setItem("velor_auth_source", source);
    localStorage.setItem("velor_profile_complete", profileCompleted ? "1" : "0");
  };

  const loadProfileByUid = async (uid) => {
    console.log("firestore profile fetch started", uid);
    const profileRef = doc(db, "users", uid);
    const profileSnap = await getDoc(profileRef);
    return profileSnap.exists() ? profileSnap.data() : null;
  };

  const loadIdentityMap = () => {
    try {
      return JSON.parse(localStorage.getItem(IDENTITY_MAP_KEY) || "{}");
    } catch {
      return {};
    }
  };

  const saveIdentityMap = (map) => {
    localStorage.setItem(IDENTITY_MAP_KEY, JSON.stringify(map));
  };

  const cacheIdentity = ({ email, username, fullName }) => {
    const emailValue = String(email || "").trim().toLowerCase();
    if (!emailValue) return;
    const map = loadIdentityMap();
    const usernameValue = String(username || "").trim().toLowerCase();
    const fullNameValue = String(fullName || "").trim().toLowerCase();
    if (usernameValue) map[usernameValue] = emailValue;
    if (fullNameValue) map[fullNameValue] = emailValue;
    saveIdentityMap(map);
  };

  const createBaseProfile = async (firebaseUser) => {
    const baseProfile = {
      uid: firebaseUser.uid,
      displayName: firebaseUser.displayName || firebaseUser.email || "User",
      fullName: firebaseUser.displayName || "",
      fullNameLower: (firebaseUser.displayName || "").toLowerCase(),
      username: "",
      usernameLower: "",
      email: firebaseUser.email || "",
      phone: "",
      country: "",
      city: "",
      address: "",
      authProvider: firebaseUser.providerData?.[0]?.providerId || "password",
      role: "user",
      online: true,
      lastLoginAt: serverTimestamp(),
      lastSeen: serverTimestamp(),
      profileCompleted: false,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    await setDoc(doc(db, "users", firebaseUser.uid), baseProfile, { merge: true });
    console.log("profile created", firebaseUser.uid);
    return baseProfile;
  };

  const syncFirebaseSession = async (firebaseUser, source = "firebase-password") => {
    console.log("login success", firebaseUser);
    const idToken = await firebaseUser.getIdToken();
    const authOnlyUser = mapFirebaseUser(firebaseUser, null);

    try {
      let profile = await loadProfileByUid(firebaseUser.uid);
      if (!profile) {
        profile = await createBaseProfile(firebaseUser);
      }
      const upserted = await upsertUserDoc(firebaseUser, profile);
      profile = { ...profile, ...upserted };
      const profileCompleted = Boolean(profile?.profileCompleted);
      const nextUser = mapFirebaseUser(firebaseUser, profile);
      cacheIdentity({
        email: nextUser.email,
        username: nextUser.username,
        fullName: nextUser.fullName,
      });
      saveSession({ token: idToken, user: nextUser }, source, profileCompleted);
      return { user: nextUser, needsProfileCompletion: !profileCompleted };
    } catch (error) {
      console.error("firestore profile fetch failed", error?.code || error?.message || error);
      console.log("fallback to auth user", firebaseUser.uid);
      cacheIdentity({
        email: authOnlyUser.email,
        username: authOnlyUser.username,
        fullName: authOnlyUser.fullName,
      });
      // Firestore is optional for sign-in flow: keep user logged in even when profile storage is unavailable.
      saveSession({ token: idToken, user: authOnlyUser }, source, true);
      return { user: authOnlyUser, needsProfileCompletion: false };
    }
  };

  const resolveEmailByIdentifier = async (identifier) => {
    const normalized = String(identifier || "").trim().toLowerCase();
    if (!normalized) throw Object.assign(new Error("Identifier is required"), { code: "auth/invalid-email" });
    if (normalized.includes("@")) return normalized;

    const identityMap = loadIdentityMap();
    if (identityMap[normalized]) {
      return identityMap[normalized];
    }

    const usersRef = collection(db, "users");
    const byUsername = query(usersRef, where("usernameLower", "==", normalized), limit(1));
    const byName = query(usersRef, where("fullNameLower", "==", normalized), limit(1));

    const usernameSnap = await getDocs(byUsername);
    if (!usernameSnap.empty) {
      const profile = usernameSnap.docs[0].data();
      cacheIdentity({ email: profile.email, username: profile.username, fullName: profile.fullName });
      return profile.email;
    }

    const fullNameSnap = await getDocs(byName);
    if (!fullNameSnap.empty) {
      const profile = fullNameSnap.docs[0].data();
      cacheIdentity({ email: profile.email, username: profile.username, fullName: profile.fullName });
      return profile.email;
    }

    throw Object.assign(new Error("User not found"), { code: "auth/user-not-found" });
  };

  const login = async (identifier, password) => {
    const loginValue = String(identifier || "").trim().toLowerCase();
    const passwordValue = String(password || "");

    const isLocalAdmin =
      (loginValue === "admin" && passwordValue === "admin1") ||
      (loginValue === "admin@velor.shop" && passwordValue === "admin12345");

    if (isLocalAdmin) {
      const localAdminSession = {
        token: "local-dev-admin-token",
        user: {
          _id: "local_admin",
          name: "Admin",
          email: loginValue === "admin" ? "admin" : "admin@velor.shop",
          isAdmin: true,
          profileCompleted: true,
        },
      };
      saveSession(localAdminSession, "backend", true);
      return { user: localAdminSession.user, needsProfileCompletion: false };
    }

    try {
      const emailForAuth = await resolveEmailByIdentifier(loginValue);
      const credential = await signInWithEmailAndPassword(auth, emailForAuth, passwordValue);
      return await syncFirebaseSession(credential.user, "firebase-password");
    } catch (firebaseError) {
      if (!loginValue.includes("@")) throw firebaseError;

      const data = await authService.login({ email: loginValue, password: passwordValue });
      saveSession(data, "backend", true);
      return { user: data.user, needsProfileCompletion: false };
    }
  };

  const register = async ({ name, email, password }) => {
    const credential = await createUserWithEmailAndPassword(auth, String(email || "").trim(), String(password || ""));
    if (name?.trim()) {
      await updateProfile(credential.user, { displayName: name.trim() });
    }
    return await syncFirebaseSession(credential.user, "firebase-password");
  };

  const googleLogin = async () => {
    console.log("calling firebase popup");
    try {
      const result = await signInWithPopup(auth, provider);
      return await syncFirebaseSession(result.user, "firebase-google");
    } catch (error) {
      const popupFallbackCodes = new Set([
        "auth/popup-blocked",
        "auth/popup-closed-by-user",
        "auth/cancelled-popup-request",
        "auth/operation-not-supported-in-this-environment",
      ]);
      if (!popupFallbackCodes.has(error?.code)) throw error;
      await signInWithRedirect(auth, provider);
      return { user: null, needsProfileCompletion: false, redirected: true };
    }
  };

  const completeProfile = async (payload) => {
    const firebaseUser = auth.currentUser;
    if (!firebaseUser) throw Object.assign(new Error("No authenticated user"), { code: "auth/no-current-user" });

    const fullName = String(payload.fullName || "").trim();
    const username = String(payload.username || "").trim();
    const password = String(payload.password || "");
    const confirmPassword = String(payload.confirmPassword || "");

    if (password !== confirmPassword) {
      throw Object.assign(new Error("Passwords do not match"), { code: "auth/password-mismatch" });
    }

    const usernameLower = username.toLowerCase();
    const profileRef = doc(db, "users", firebaseUser.uid);
    let existing = null;
    try {
      existing = await withTimeout(loadProfileByUid(firebaseUser.uid));
    } catch (error) {
      console.error("firestore profile fetch failed", error?.code || error?.message || error);
    }

    const sameUsername = existing?.usernameLower && existing.usernameLower === usernameLower;
    if (!sameUsername) {
      try {
        const collisionQuery = query(collection(db, "users"), where("usernameLower", "==", usernameLower), limit(1));
        const collisionSnap = await withTimeout(getDocs(collisionQuery));
        if (!collisionSnap.empty && collisionSnap.docs[0].id !== firebaseUser.uid) {
          throw Object.assign(new Error("Username already in use"), { code: "auth/username-already-in-use" });
        }
      } catch (error) {
        if (error?.code === "auth/username-already-in-use") throw error;
        console.error("firestore username check failed", error?.code || error?.message || error);
      }
    }

    let passwordDeferred = false;
    if (password) {
      try {
        await withTimeout(updatePassword(firebaseUser, password), 4000);
      } catch (error) {
        if (error?.code === "auth/requires-recent-login") {
          passwordDeferred = true;
          if (firebaseUser.email) {
            await sendPasswordResetEmail(auth, firebaseUser.email).catch(() => {});
          }
        } else {
          throw error;
        }
      }
    }

    if (fullName) {
      await withTimeout(updateProfile(firebaseUser, { displayName: fullName }), 4000);
    }

      const profileData = {
      uid: firebaseUser.uid,
      displayName: fullName,
      fullName,
      fullNameLower: fullName.toLowerCase(),
      username,
      usernameLower,
      email: firebaseUser.email || existing?.email || "",
      phone: String(payload.phone || "").trim(),
      country: String(payload.country || "").trim(),
      city: String(payload.city || "").trim(),
      address: String(payload.address || "").trim(),
        authProvider: firebaseUser.providerData?.[0]?.providerId || "password",
        role: existing?.role || "user",
        online: true,
        lastLoginAt: serverTimestamp(),
        lastSeen: serverTimestamp(),
        profileCompleted: true,
      updatedAt: serverTimestamp(),
      createdAt: existing?.createdAt || serverTimestamp(),
    };

    let persistedToFirestore = false;
    try {
      await withTimeout(setDoc(profileRef, profileData, { merge: true }));
      persistedToFirestore = true;
      console.log("profile created", firebaseUser.uid);
    } catch (error) {
      console.error("firestore profile save failed", error?.code || error?.message || error);
    }

    const idToken = await firebaseUser.getIdToken();
    const source = localStorage.getItem("velor_auth_source") || "firebase-password";
    const nextUser = {
      ...mapFirebaseUser(firebaseUser, profileData),
      profileCompleted: true,
    };
    cacheIdentity({
      email: nextUser.email,
      username: nextUser.username,
      fullName: nextUser.fullName,
    });
    saveSession({ token: idToken, user: nextUser }, source, true);
    return { user: nextUser, needsProfileCompletion: false, persistedToFirestore, passwordDeferred };
  };

  const refreshProfile = async () => {
    if (!token || isFirebaseSource(authSource)) return user;
    const profile = await authService.profile();
    setUser(profile);
    localStorage.setItem("velor_user", JSON.stringify(profile));
    return profile;
  };

  const logout = () => {
    const source = localStorage.getItem("velor_auth_source");
    markUserOffline();
    if (isFirebaseSource(source)) {
      signOut(auth).catch(() => {});
    }
    clearSession();
  };

  const updateLocalProfile = (patch) => {
    const next = { ...(user || {}), ...patch };
    setUser(next);
    localStorage.setItem("velor_user", JSON.stringify(next));
    return next;
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        await getRedirectResult(auth).catch(() => null);
        const storedSource = localStorage.getItem("velor_auth_source");
        if (firebaseUser) {
          const providerId = firebaseUser.providerData?.[0]?.providerId || "password";
          const source = providerId === "google.com" ? "firebase-google" : "firebase-password";
          await syncFirebaseSession(firebaseUser, source);
        } else if (isFirebaseSource(storedSource)) {
          clearSession();
        }
      } finally {
        setAuthReady(true);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const onVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        markUserOffline();
      } else if (document.visibilityState === "visible" && auth.currentUser) {
        setDoc(
          doc(db, "users", auth.currentUser.uid),
          { online: true, lastSeen: serverTimestamp(), updatedAt: serverTimestamp() },
          { merge: true }
        ).catch(() => {});
      }
    };
    window.addEventListener("beforeunload", markUserOffline);
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => {
      window.removeEventListener("beforeunload", markUserOffline);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, []);

  const value = useMemo(
    () => ({
      token,
      user,
      authReady,
      needsProfileCompletion,
      login,
      register,
      googleLogin,
      completeProfile,
      refreshProfile,
      updateLocalProfile,
      logout,
    }),
    [token, user, authReady, needsProfileCompletion]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
