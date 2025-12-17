import { createBrowserRouter } from "react-router-dom";
import CoursePage from "../pages/CoursePage";
import WeeksPage from "../pages/WeeksPage";
import WeekDetailPage from "../pages/WeekDetailPage";
import ProblemsPage from "../pages/ProblemsPage";
import ProblemDetailPage from "../pages/ProblemDetailPage";
import Layout from "../components/Layout";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <CoursePage />,
      },
      {
        path: "/weeks",
        element: <WeeksPage />,
      },
      {
        path: "/weeks/:weekId",
        element: <WeekDetailPage />,
      },
      {
        path: "/problems",
        element: <ProblemsPage />,
      },
      {
        path: "/problems/:problemId",
        element: <ProblemDetailPage />,
      },
    ],
  },
]);
