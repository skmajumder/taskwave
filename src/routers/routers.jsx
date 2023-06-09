import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout/MainLayout";
import ErrorPage from "../pages/ErrorPage/ErrorPage";
import Home from "../pages/Home/Home";
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";
import ForgotPassword from "../pages/ForgotPassword/ForgotPassword";
import Tasks from "../pages/Task/Tasks";
import TaskLayout from "../layouts/TaskLayout/TaskLayout";
import PrivateRouter from "./PrivateRouter";
import TaskDetails from "../pages/Task/TaskDetails";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
      {
        path: "reset-password",
        element: <ForgotPassword />,
      },
    ],
  },
  {
    path: "task",
    element: <TaskLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/task",
        element: (
          <PrivateRouter>
            <Tasks />
          </PrivateRouter>
        ),
      },
      {
        path: ":id",
        element: (
          <PrivateRouter>
            <TaskDetails />
          </PrivateRouter>
        ),
      },
    ],
  },
]);

export default router;
