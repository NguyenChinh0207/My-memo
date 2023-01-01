import React, { lazy, Suspense } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import RouteLoader from "../common/loader/RouteLoader";
import PublicRoute from "./PublicRoute";
import PrivateRoute from "./PrivateRoute";
import routes from "./routes";
import NotFound from "./../components/permission/NotFound";

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<RouteLoader />}>
        <Switch>
          {routes.map((route, key) => {
            const { path, exact, component, isPrivate, restricted } = route;
            const props = {
              key,
              path,
              exact,
              component: lazy(
                () =>
                  new Promise((resolve) =>
                    setTimeout(() => resolve(component), 200)
                  )
              ),
            };
            return isPrivate ? (
              <PrivateRoute {...props} />
            ) : (
              <PublicRoute restricted={restricted} {...props} />
            );
          })}
          <Route component={NotFound} isPublicRoute />
        </Switch>
      </Suspense>
    </BrowserRouter>
  );
};

export default AppRouter;
