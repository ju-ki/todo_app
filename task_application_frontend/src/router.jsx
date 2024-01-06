// eslint-disable-next-line import/no-extraneous-dependencies
import { createBrowserRouter } from "react-router-dom";
import TopPage from "./pages/TopPage";
import SignupPage from "./pages/auth/SignUpPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <TopPage />,
  },
  {
    path: "/signup",
    element: <SignupPage />,
  },
]);

export default router;
