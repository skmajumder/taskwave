import React, { createContext, useEffect, useState } from "react";
import { app } from "../firebase/firebase.config";
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";
export const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  /**
   * * Authentication (Email Authentication & Google Authentication)
   */
  const auth = getAuth(app);
  const googleProvider = new GoogleAuthProvider();

  /**
   * * Create a new user using Email & password (Register)
   */
  const signUp = (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };

  /**
   * * User login user using Email & password (Login)
   */
  const signIn = (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };

  /**
   * * User Authentication using Google Account Authentication
   */
  const googleSignIn = () => {
    setLoading(true);
    return signInWithPopup(auth, googleProvider);
  };

  /**
   * * User Logout
   */
  const logout = () => {
    setLoading(true);
    return signOut(auth);
  };

  /**
   * * Reset user password who forget their passwords
   */
  const resetPassword = (email) => {
    setLoading(true);
    sendPasswordResetEmail(auth, email);
  };

  /**
   * * Observe the user current status. Check user is login or logged out
   */
  useEffect(() => {
    const unSubscribe = onAuthStateChanged(auth, (loggedUser) => {
      setUser(loggedUser);
      setLoading(false);
    });
    return () => unSubscribe();
  }, []);

  const authInfo = {
    user,
    loading,
    signUp,
    signIn,
    googleSignIn,
    logout,
    resetPassword,
  };

  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
