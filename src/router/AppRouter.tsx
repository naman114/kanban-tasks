import React, { lazy, Suspense } from "react";
import { useContext } from "react";
import { useRoutes } from "raviger";
import AppContainer from "../Components/AppContainer";
import { userContext } from "../utils/formUtils";
import Loading from "../common/Loading";
import Register from "../Components/Register";
import Home from "../Components/Home";
import Boards from "../Components/Boards";

const Login = lazy(() => import("../Components/Login"));
const About = lazy(() => import("../Components/About"));
const FormList = lazy(() => import("../Components/FormList"));
const UserForm = lazy(() => import("../Components/UserForm"));
const Preview = lazy(() => import("../Components/Preview"));

export default function AppRouter() {
  const currentUser = useContext(userContext);

  const routes = {
    "/": () =>
      currentUser.status === "NOT_AUTHENTICATED" ? <Login /> : <Home />,
    "/login": () => <Login />,
    "/register": () => <Register />,
    "/boards": () => <Boards />,
    "/about": () => <About />,
    "/forms": () => <FormList />,
    "/forms/:id": ({ id }: { id: string }) =>
      currentUser.status === "NOT_AUTHENTICATED" ? (
        <Login />
      ) : (
        <UserForm formId={Number(id)} />
      ),
    "/preview/:id": ({ id }: { id: string }) =>
      currentUser.status === "NOT_AUTHENTICATED" ? (
        <Login />
      ) : (
        <Preview formId={Number(id)} />
      ),
  };

  let routeResult = useRoutes(routes);
  return (
    <AppContainer>
      <Suspense fallback={<Loading />}>{routeResult}</Suspense>
    </AppContainer>
  );
}
