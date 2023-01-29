import React, { useEffect } from "react";
import { Route, Redirect } from "react-router-dom";
import { getRole, isLogin } from "../config/function";
import NotFound from "../components/permission/NotFound";
import { HOME_PATH, USER_LIST_PATH } from "../config/path";
import { ROLE_ADMIN } from "../config/const";
import Unauthorized from "../components/permission/Unauthorized";

const PublicRoute = ({
  component: Component,
  restricted,
  path,
  isAdmin,
  ...rest
}) => {
  const role = getRole();
  return (
    // restricted = false meaning public route
    // restricted = true meaning restricted route
    <Route
      {...rest}
      render={(props) =>
        isLogin() && restricted ? (
          <Redirect to={HOME_PATH} />
        ) : !isLogin() && isAdmin ? (
          <Unauthorized />
        ) : path ? (
          <Component {...props} />
        ) : (
          <NotFound isPublicRoute />
        )
      }
    />
  );
};

export default PublicRoute;
