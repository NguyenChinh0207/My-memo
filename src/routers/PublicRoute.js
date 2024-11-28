import React from "react";
import { Route, Redirect } from "react-router-dom";
import { getRole, isLogin } from "../config/function";
import NotFound from "../components/permission/NotFound";
import Unauthorized from "../components/permission/Unauthorized";
import { ADMIN_PATH, ADMIN_USER_LIST_PATH, HOME_PATH } from "../config/path";
import { ROLE_ADMIN } from "../config/const";

const PublicRoute = ({
  component: Component,
  restricted,
  path,
  isAdmin,
  ...rest
}) => {
  const role = getRole();// Get the role of the logged-in user.

  return (
    <Route
      {...rest}
      render={(props) => {
        if (isLogin() && restricted) {
          if(role == ROLE_ADMIN){
            return <Redirect to={ADMIN_USER_LIST_PATH} />;
          } else{
            return <Redirect to={HOME_PATH} />;
          }
        }

        if (isAdmin && role !== ROLE_ADMIN) {
          return <Unauthorized />;
        }

        if (path) {
          return <Component {...props} />;
        }

        return <NotFound />;
      }}
    />
  );
};

export default PublicRoute;
