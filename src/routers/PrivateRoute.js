import React from "react";
import { Route, Redirect } from "react-router-dom";
import NotFound from "../components/permission/NotFound";
import Unauthorized from "../components/permission/Unauthorized";
import { isLogin } from "../config/function";
import { DASHBOARD_PATH } from "../config/path";

const PrivateRoute = ({
  component: Component,
  restricted,
  isAdmin,
  path,
  ...rest
}) => {
// user
  return (
    <Route
      {...rest}
      render={(props) =>
        !isLogin() ? (
          <Redirect to={DASHBOARD_PATH} />
        ) : isAdmin ? (
          <Unauthorized />
        ) : path && !isAdmin ? (
          <Component {...props} />
        ) : (
          <NotFound />
        )
      }
    />
  );
};

export default PrivateRoute;
