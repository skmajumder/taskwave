import React from "react";

const GoogleLogin = ({ handleGoogleSignIn }) => {
  return (
    <>
      <button
        type="button"
        onClick={handleGoogleSignIn}
        className="flex items-center justify-center w-full py-3 font-medium text-white bg-[#02224d] rounded-md hover:bg-[#02234dea] focus:outline-none focus:bg-[#02234de9]"
      >
        <img
          src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
          alt="Google Logo"
          className="w-5 h-5 mr-2"
        />
        Continue with Google
      </button>
    </>
  );
};

export default GoogleLogin;
