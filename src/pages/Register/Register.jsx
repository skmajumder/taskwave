import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PageTitle from "../../components/PageTitle/PageTitle";
import GoogleLogin from "../../components/GoogleLogin/GoogleLogin";
import Swal from "sweetalert2";
import { updateProfile } from "firebase/auth";
import useAuth from "../../hooks/useAuth";

import { ref, push, get, set } from "firebase/database";
import { db } from "../../firebase/firebase.config.js";

const Register = () => {
  const { signUp, googleSignIn, logout } = useAuth();

  //   Show password on click
  const [showPassword, setShowPassword] = useState(false);
  const handelPasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const navigate = useNavigate();

  //   Check url is valid or not
  const validateURL = (url) => {
    try {
      new URL(url);
      return true;
    } catch (error) {
      return false;
    }
  };

  // Store the user register info and error message in state

  //   For user Name
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState("");

  //   For user Email
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  //   For user Password
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  //   For user Photo
  const [photo, setPhoto] = useState("");
  const [photoError, setPhotoError] = useState("");

  // Show error message for Register
  const [registerError, setRegisterError] = useState("");

  const handleUserName = (e) => {
    const form = e.target;
    const nameInput = form.value;
    setName(nameInput);
    if (nameInput.length < 3) {
      setNameError("Name must be above 2 characters");
      return;
    } else {
      setNameError("");
    }
  };

  const handleUserEmail = (e) => {
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

  const handleUserPassword = (e) => {
    const form = e.target;
    const passwordInput = form.value;
    setPassword(passwordInput);
    if (passwordInput.length < 6) {
      setPasswordError("Password must be at least 6 characters or longer.");
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

  const handleUserPhoto = (e) => {
    const form = e.target;
    const photoInput = form.value;
    setPhoto(photoInput);

    if (photoInput.length < 0) {
      setPhotoError("Empty field not allowed");
      return;
    } else if (!validateURL(photoInput)) {
      setPhotoError(
        "Enter valid URL. E.g. https://www.example.com or https://example.com"
      );
      return;
    } else {
      setPhotoError("");
    }
  };

  const handleUpdateUser = (user, name, photoUrl) => {
    updateProfile(user, {
      displayName: name,
      photoURL: photoUrl,
    })
      .then(() => {})
      .catch((error) => {
        const errorMessage = error.message;
        setRegisterError(errorMessage);
      });
  };

  const handleSignUp = (e) => {
    e.preventDefault();
    const form = e.target;

    if (nameError) {
      form.name.focus();
      return;
    }
    if (emailError) {
      form.email.focus();
      return;
    }
    if (passwordError) {
      form.password.focus();
      return;
    }
    if (photoError) {
      form.photoUrl.focus();
      return;
    }

    const userName = form.name.value;
    const userEmail = form.email.value;
    const userPassword = form.password.value;
    const userPhotoUrl = form.photoUrl.value;

    // Create user with email and password
    signUp(userEmail, userPassword)
      .then((userCredential) => {
        const user = userCredential.user;
        Swal.fire("Successfully!", "User SignUp Successfully", "success");

        // * Store user data in the Firebase Realtime Database
        const usersRef = ref(db, "users");
        push(usersRef, {
          name: userName,
          email: userEmail,
          photoUrl: userPhotoUrl,
          admin: false,
        });

        // Set user name and photo
        handleUpdateUser(user, userName, userPhotoUrl);
        setName("");
        setEmail("");
        setPassword("");
        setPhoto("");
        logout();
        navigate("/login");
      })
      .catch((error) => {
        const registerErrorMessage = error.message;
        setRegisterError(registerErrorMessage);
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
      <PageTitle pageTitle={"Sign Up"} />
      <section className="section-register">
        <div className="container px-10">
          <div className="flex flex-col items-center justify-center min-h-screen mb-8">
            <div className="max-w-md w-full px-6 py-8 bg-gray-100 shadow-md rounded-md">
              <h2 className="text-3xl font-semibold text-center">Sign Up</h2>
              {nameError && (
                <p className="text-red-600 text-center font-semibold mt-3">
                  {nameError}
                </p>
              )}
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
              {photoError && (
                <p className="text-red-600 text-center font-semibold mt-3">
                  {photoError}
                </p>
              )}
              {registerError && (
                <p className="text-red-600 text-center font-semibold mt-3">
                  {registerError}
                </p>
              )}
              <form onSubmit={handleSignUp} className="mt-8 space-y-6">
                <div>
                  <label htmlFor="name" className="block font-medium">
                    Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={name}
                    onChange={handleUserName}
                    autoComplete="name"
                    required
                    className={`mt-1 block p-4 w-full rounded-md shadow-sm ${
                      name ? (nameError ? "input-error" : "input-success") : ""
                    }`}
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block font-medium">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={email}
                    onChange={handleUserEmail}
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
                      onChange={handleUserPassword}
                      autoComplete="new-password"
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
                  <label htmlFor="photoUrl" className="block font-medium">
                    Photo URL
                  </label>
                  <input
                    id="photoUrl"
                    name="photoUrl"
                    type="url"
                    value={photo}
                    onChange={handleUserPhoto}
                    autoComplete="photo"
                    className={`mt-1 block p-4 w-full rounded-md shadow-sm ${
                      photo
                        ? photoError
                          ? "input-error"
                          : "input-success"
                        : ""
                    }`}
                  />
                </div>
                <div>
                  <button
                    type="submit"
                    className="w-full py-3 mt-4 font-medium text-white bg-indigo-500 rounded-md hover:bg-indigo-600 focus:outline-none focus:bg-indigo-600"
                  >
                    Register
                  </button>
                </div>
                <div className="mt-6">
                  <GoogleLogin handleGoogleSignIn={handleGoogleSignIn} />
                </div>
              </form>
              <div className="mt-6 text-center">
                <p className="text-sm">
                  Already have an account?{" "}
                  <Link
                    to={"/login"}
                    className="font-medium text-indigo-600 hover:text-indigo-500"
                  >
                    Login here
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

export default Register;
