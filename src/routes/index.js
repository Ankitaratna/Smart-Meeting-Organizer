import React, { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { routes } from "./routes";

const ApplicationRoutes = () => {
  return (
    <Suspense fallback={<div>loading...</div>}>
      <Routes>
        {routes.map(({ component: Component, ...route }, index) => (
          <Route element={<Component />} {...route} />
        ))}
      </Routes>
    </Suspense>
  );
};

export default ApplicationRoutes;
