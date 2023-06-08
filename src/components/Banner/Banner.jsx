import React from "react";
import BannerImg from "../../assets/images/banner-img.png";

const Banner = () => {
  return (
    <section className="section-banner h-full md:h-screen">
      <div className="container px-10 py-10">
        <div className="flex flex-col-reverse md:flex md:flex-row justify-between items-center gap-10">
          <div className="banner-text w-full md:w-[60%] flex flex-col justify-center">
            <span className="uppercase text-[14px] text-slate-950 font-bold tracking-widest mb-3">
              Taskwave
            </span>
            <h1 className="text-3xl lg:text-6xl font-medium text-[#000000] tracking-wide md:leading-[65px] md:max-w-[90%] mb-8">
              Brilliant Dicisions <br /> for your work
            </h1>
            <p className="text-[#000000d4] text-[15px] font-extralight leading-[28px] mb-4">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. <br />{" "}
              Possimus cupiditate neque pariatur praesentium!
            </p>
          </div>
          <div className="banner-img w-full md:w-[40%]">
            <img src={BannerImg} alt="Banner Image" className="md:w-[78%]" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Banner;
