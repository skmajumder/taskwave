import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthProvider";
import Logo from "../../assets/images/logo.png";

const Header = () => {
  const { user, logout } = useContext(AuthContext);

  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const handleToggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  const defaultUserAvatar = "";

  const navigate = useNavigate();

  const handleRedirectLogin = () => {
    navigate("/login");
  };

  return (
    <>
      <header className="bg-white p-4 py-3 sticky top-0">
        <div className="container px-10">
          <div className="flex items-center justify-between">
            <div className="w-3/12">
              <Link to={"/"}>
                <img src={Logo} alt="Logo" className="h-auto md:h-14" />
              </Link>
            </div>
            <nav className="w-6/12 hidden md:block">
              {/* Navigation menu */}
              <ul className="flex md:justify-start space-x-6 text-[16px] text-[#000] font-normal leading-6">
                <li>
                  <Link to={"/"}>Home</Link>
                </li>
                <li>
                  <Link to={"/"}>Feature</Link>
                </li>
                <li>
                  <Link to={"/"}>About</Link>
                </li>
              </ul>
            </nav>
            <div className="w-3/12 flex justify-start gap-0 md:gap-3">
              {user ? (
                <>
                  <div className="tooltip" data-tip={user?.displayName}>
                    <img
                      src={defaultUserAvatar}
                      alt="User Avatar"
                      className="h-8 rounded-full"
                    />
                  </div>
                  <button
                    onClick={logout}
                    className="btn btn-sm border-[#02224d] hidden md:block"
                  >
                    SignOut
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={handleRedirectLogin}
                    className="hidden md:block text-[#000]"
                  >
                    Log-in
                  </button>
                  <button className="hidden md:block btn bg-[#000] text-white px-8 rounded-sm ml-5">
                    Sign Up
                  </button>
                </>
              )}
            </div>
            <button
              className="block md:hidden"
              onClick={handleToggleMobileMenu}
              aria-label="Toggle mobile menu"
            >
              <svg
                className="w-6 h-6 fill-current text-[#000]"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <path
                  fillRule="evenodd"
                  d="M3 5h18a1 1 0 0 1 0 2H3a1 1 0 0 1 0-2zm0 6h18a1 1 0 0 1 0 2H3a1 1 0 1 1 0-2zm0 6h18a1 1 0 0 1 0 2H3a1 1 0 0 1 0-2z"
                />
              </svg>
            </button>
          </div>
          {isMobileMenuOpen && (
            <nav className="mt-2">
              <ul className="flex flex-col items-center space-y-4 text-[16px] text-[#000] font-normal leading-6">
                <li>
                  <Link to={"/"}>Home</Link>
                </li>
                <li>
                  <Link to={"/"}>Feature</Link>
                </li>
                <li>
                  <Link to={"/"}>About</Link>
                </li>
                {user ? (
                  <>
                    <li>
                      <button onClick={logout} className="btn btn-sm md:hidden">
                        SignOut
                      </button>
                    </li>
                  </>
                ) : (
                  <>
                    <li>
                      <button
                        onClick={handleRedirectLogin}
                        className="btn btn-sm md:hidden bg-[#000] text-white px-8 rounded-sm"
                      >
                        Sign In
                      </button>
                    </li>
                  </>
                )}
              </ul>
            </nav>
          )}
        </div>
      </header>
    </>
  );
};

export default Header;
