import React from "react";
import PageTitle from "../../components/PageTitle/PageTitle";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import { Outlet } from "react-router-dom";
import { Sugar } from "react-preloaders";

const MainLayout = () => {
  return (
    <>
      <PageTitle pageTitle={"Home"} />
      <Header />
      <main className="min-h-[calc(100vh-120px)]">
        <Outlet />
      </main>
      <Footer />
      
    </>
  );
};

export default MainLayout;
