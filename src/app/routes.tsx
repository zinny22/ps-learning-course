import { createBrowserRouter } from "react-router-dom";
import CoursePage from "../pages/CoursePage";
import WeeksPage from "../pages/WeeksPage";
import WeekDetailPage from "../pages/WeekDetailPage";
import ConceptPage from "../pages/ConceptPage";
import AllConceptsPage from "../pages/AllConceptsPage";
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
        path: "/weeks/:weekId/concepts",
        element: <ConceptPage />,
      },
      {
        path: "/concepts",
        element: <AllConceptsPage />,
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
