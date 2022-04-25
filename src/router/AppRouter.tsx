import React, { lazy, Suspense } from "react";
import { useContext } from "react";
import { useRoutes } from "raviger";
import AppContainer from "../Components/AppContainer";
import { userContext } from "../utils/userUtils";
import Loading from "../common/Loading";

const Login = lazy(() => import("../Components/Login"));
const Register = lazy(() => import("../Components/Register"));
const Home = lazy(() => import("../Components/Home"));
const Boards = lazy(() => import("../Components/Boards"));
const BoardDetail = lazy(() => import("../Components/BoardDetail"));

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
  };

  let routeResult = useRoutes(routes);
  return (
    <AppContainer>
      <Suspense fallback={<Loading />}>{routeResult}</Suspense>
    </AppContainer>
  );
}
