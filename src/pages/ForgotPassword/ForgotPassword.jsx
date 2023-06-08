import React, { useContext, useState } from "react";
import PageTitle from "../../components/PageTitle/PageTitle";
import { AuthContext } from "../../contexts/AuthProvider";
import Swal from "sweetalert2";

const ForgotPassword = () => {
  const { resetPassword } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [resetError, setResetError] = useState("");

  const [resetSent, setResetSent] = useState(false);

  const handleResetEmail = (e) => {
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

  const handlePasswordReset = (e) => {
    e.preventDefault();
    const form = e.target;
    if (emailError) {
      form.email.focus();
      return;
    }
    const userEmail = form.email.value;
    resetPassword(userEmail)
      .then(() => {
        Swal.fire(
          "Done!",
          `Password reset email sent to ${userEmail}`,
          "success"
        );
        setResetSent(true);
      })
      .catch((error) => {
        const passwordResetError = error.message;
        setResetError(passwordResetError);
      });
  };

  return (
    <>
      <PageTitle pageTitle={"Password Reset"} />
      {!resetSent ? (
        <section className="section-login">
          <div className="container px-10">
            <div className="flex flex-col items-center justify-center min-h-screen">
              <div className="max-w-md w-full px-6 py-8 bg-gray-100 shadow-md rounded-md">
                <h2 className="text-3xl font-semibold text-center">
                  Reset Password
                </h2>
                {emailError && (
                  <p className="text-red-600 text-center font-semibold mt-3">
                    {emailError}
                  </p>
                )}
                {resetError && (
                  <p className="text-red-600 text-center font-semibold mt-3">
                    {resetError}
                  </p>
                )}
                <form onSubmit={handlePasswordReset} className="mt-8 space-y-6">
                  <div>
                    <label htmlFor="email" className="block font-medium">
                      Email
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={email}
                      onChange={handleResetEmail}
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
                    <button
                      type="submit"
                      className="w-full py-3 mt-4 font-medium text-white bg-indigo-500 rounded-md hover:bg-indigo-600 focus:outline-none focus:bg-indigo-600"
                    >
                      Reset
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>
      ) : (
        <section className="flex justify-center items-center">
          <div>
            <h2 className="text-3xl font-semibold text-center">
              Password Reset Email Sent
            </h2>
            <p className="text-center mt-4">
              Please check your email for further instructions to reset your
              password.
            </p>
          </div>
        </section>
      )}
    </>
  );
};

export default ForgotPassword;
