import React, { useContext } from "react";
import Logo from "../../assets/images/logo.png";
import { Link } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthProvider";

const Footer = () => {
  const { user, logout } = useContext(AuthContext);
  return (
    <footer
      className="footer bg-[#f5f5f5]"
      data-aos="fade-up"
      data-aos-duration="1500"
    >
      <div className="container px-10 py-16">
        <div className="grid grid-cols-2 gap-x-4 gap-y-8 items-start md:grid-cols-5 md:gap-0">
          <div className="about col-span-2 md:col-span-2 flex flex-col gap-2">
            <div className="footer-logo">
              <img src={Logo} alt="Logo" className="h-16" />
            </div>
            <p className="text-[#000] w-[75%] mb-5 text-[17px] leading-[28px]">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ipsum,
              beatae!
            </p>
          </div>
          <div className="footer-menu">
            <h3 className="text-[28px] text-[#02224d] font-medium leading-6 mb-7">
              Quick Link
            </h3>
            <ul className="text-[#333333] text-[17px] space-y-5">
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
          </div>
          <div className="footer-menu">
            <h3 className="text-[28px] text-[#02224d] font-medium leading-6 mb-7">
              Information
            </h3>
            <ul className="text-[#333333] text-[17px] space-y-5">
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
          </div>
          <div className="footer-menu">
            <h3 className="text-[28px] text-[#02224d] font-medium leading-6 mb-7">
              Social
            </h3>
            <ul className="text-[#333333] text-[17px] space-y-5">
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
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
