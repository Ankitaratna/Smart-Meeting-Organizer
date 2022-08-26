import React, { lazy } from "react";

const HomePage = lazy(() => import("../Home/index"));

const NoMatch = () => {
  return <div>404</div>;
};
export const routes = [
  {
    path: "/",
    component: HomePage,
    isPrivate: false,
    exact: true,
  },

  {
    path: "/:notFound",
    component: NoMatch,
  },
];
