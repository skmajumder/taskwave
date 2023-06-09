import React, { useState } from "react";
import PageTitle from "../../components/PageTitle/PageTitle";
import { Link, useLocation, useNavigate } from "react-router-dom";
import GoogleLogin from "../../components/GoogleLogin/GoogleLogin";

import { ref, push, get, set } from "firebase/database";
import { db } from "../../firebase/firebase.config";
import useAuth from "../../hooks/useAuth";

const Login = () => {
  const { signIn, googleSignIn } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const handelPasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  /**
   * * To find active router location
   */
  const activeRouterLocation = useLocation();
  const navigate = useNavigate();

  const redirectLocation = activeRouterLocation?.state?.from?.pathname || "/";

  /**
   * * Store the user Login info and error message in state
   */

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [loginError, setLoginError] = useState("");

  const handleLoginEmail = (e) => {
    const form = e.target;
    const emailInput = form.value;
    setEmail(emailInput);
    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(emailInput)) {
      setEmailError(
        `${emailInput} is not a valid email, insert a valid email address`
      );
      return;
    } else {
      setEmailError("");
    }
  };

  const handleLoginPassword = (e) => {
    const form = e.target;
    const passwordInput = form.value;
    setPassword(passwordInput);
    if (passwordInput.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      return;
    } else if (
      !/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).*$/.test(
        passwordInput
      )
    ) {
      setPasswordError(
        "Password must be contain at least one uppercase, at least one number and at last one special symbol"
      );
      return;
    } else {
      setPasswordError("");
    }
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    const form = e.target;

    if (emailError) {
      form.email.focus();
      return;
    }
    if (passwordError) {
      form.password.focus();
      return;
    }

    const userEmail = form.email.value;
    const userPassword = form.password.value;

    // Login the user with email and password
    signIn(userEmail, userPassword)
      .then((userCredential) => {
        const loggedUser = userCredential.user;
        setEmail("");
        setPassword("");
        navigate(redirectLocation);
      })
      .catch((error) => {
        const loginErrorMessage = error.message;
        setLoginError(loginErrorMessage);
      });
  };

  const handleGoogleSignIn = () => {
    googleSignIn()
      .then((result) => {
        const user = result.user;
        const userId = user.uid;

        const userRef = ref(db, `users/${userId}`);
        get(userRef)
          .then((snapshot) => {
            if (snapshot.exists()) {
              navigate("/");
            } else {
              const userName = user.displayName || "";
              const userEmail = user.email || "";
              const userPhotoUrl = user.photoURL || "";

              const userData = {
                name: userName,
                email: userEmail,
                photoUrl: userPhotoUrl,
                admin: false,
              };

              set(ref(db, `users/${userId}`), userData)
                .then(() => {
                  navigate("/");
                })
                .catch((error) => {
                  setRegisterError(error.message);
                });
            }
          })
          .catch((error) => {
            setRegisterError(error.message);
          });
      })
      .catch((error) => {
        setRegisterError(error.message);
      });
  };

  return (
    <>
      <PageTitle pageTitle={"Sign In"} />
      <section className="section-login">
        <div className="container px-10">
          <div className="flex flex-col items-center justify-center min-h-screen">
            <div className="max-w-md w-full px-6 py-8 bg-gray-100 shadow-md rounded-md">
              <h2 className="text-3xl font-semibold text-center">Sign In</h2>
              {emailError && (
                <p className="text-red-600 text-center font-semibold mt-3">
                  {emailError}
                </p>
              )}
              {passwordError && (
                <p className="text-red-600 text-center font-semibold mt-3">
                  {passwordError}
                </p>
              )}
              {loginError && (
                <p className="text-red-600 text-center font-semibold mt-3">
                  {loginError}
                </p>
              )}
              <form onSubmit={handleLoginSubmit} className="mt-8 space-y-6">
                <div>
                  <label htmlFor="email" className="block font-medium">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={email}
                    onChange={handleLoginEmail}
                    autoComplete="email"
                    required
                    className={`mt-1 block p-4 w-full rounded-md shadow-sm ${
                      email
                        ? emailError
                          ? "input-error"
                          : "input-success"
                        : ""
                    }`}
                  />
                </div>
                <div>
                  <label htmlFor="password" className="block font-medium">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={handleLoginPassword}
                      autoComplete="current-password"
                      required
                      className={`mt-1 block p-4 w-full rounded-md shadow-sm ${
                        password
                          ? passwordError
                            ? "input-error"
                            : "input-success"
                          : ""
                      }`}
                    />
                    <button
                      type="button"
                      onClick={handelPasswordVisibility}
                      className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-transparent text-gray-500 focus:outline-none"
                    >
                      {showPassword ? (
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      ) : (
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17.606 17.606L12 12M12 12L6.394 6.394"
                          />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
                <div>
                  <button
                    type="submit"
                    className="w-full py-3 mt-4 font-medium text-white bg-indigo-500 rounded-md hover:bg-indigo-600 focus:outline-none focus:bg-indigo-600"
                  >
                    Sign In
                  </button>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <div className="text-sm">
                    <Link
                      to={"/reset-password"}
                      className="font-medium text-indigo-600 hover:text-indigo-500"
                    >
                      Forgot your password?
                    </Link>
                  </div>
                </div>
                <div className="mt-6">
                  <GoogleLogin handleGoogleSignIn={handleGoogleSignIn} />
                </div>
              </form>
              <div className="mt-6 text-center">
                <p className="text-sm">
                  Don't have an account?{" "}
                  <Link
                    to={"/register"}
                    className="font-medium text-indigo-600 hover:text-indigo-500"
                  >
                    Register here
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Login;
