import React, { lazy, Suspense } from "react";
import { useContext } from "react";
import { useRoutes } from "raviger";
import AppContainer from "../Components/AppContainer";
import { userContext } from "../utils/formUtils";
import Loading from "../common/Loading";
import Register from "../Components/Register";
import Home from "../Components/Home";
import Boards from "../Components/Boards";
import BoardDetail from "../Components/BoardDetail";

const Login = lazy(() => import("../Components/Login"));
const About = lazy(() => import("../Components/About"));
const FormList = lazy(() => import("../Components/FormList"));
const Preview = lazy(() => import("../Components/Preview"));

export default function AppRouter() {
  const currentUser = useContext(userContext);

  const routes = {
    "/": () =>
      currentUser.status === "NOT_AUTHENTICATED" ? <Login /> : <Home />,
    "/login": () => <Login />,
    "/register": () => <Register />,
    "/boards": () =>
      currentUser.status === "NOT_AUTHENTICATED" ? <Login /> : <Boards />,
    "/boards/:id": ({ id }: { id: string }) =>
      currentUser.status === "NOT_AUTHENTICATED" ? (
        <Login />
      ) : (
        <BoardDetail boardId={Number(id)} />
      ),
    "/about": () => <About />,
    "/forms": () => <FormList />,
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
