import React from "react";
import PageTitle from "../../components/PageTitle/PageTitle";
import Header from "../../components/Header/Header";
import { Outlet } from "react-router-dom";
import Footer from "../../components/Footer/Footer";
import { Sugar } from "react-preloaders";

const TaskLayout = () => {
  return (
    <>
      <PageTitle pageTitle={"Task"} />
      <Header />
      <main className="min-h-[calc(100vh-120px)]">
        <Outlet />
      </main>
      <Footer />
      <Sugar />
    </>
  );
};

export default TaskLayout;
