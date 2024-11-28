import React from "react";
import { Route, Redirect } from "react-router-dom";
import Unauthorized from "../components/permission/Unauthorized";
import { isLogin, getRole } from "../config/function";
import { DASHBOARD_PATH } from "../config/path"; 
import { ROLE_ADMIN } from "../config/const";

const PrivateRoute = ({
  component: Component,
  restricted,
  isAdmin,
  path,
  ...rest
}) => {
  const role = getRole(); // Get the role of the logged-in user.

  return (
    <Route
      {...rest}
      render={(props) => {
        if (!isLogin()) {
          return <Redirect to={DASHBOARD_PATH} />;
        }

        if (isAdmin && role !== ROLE_ADMIN) {
          return <Unauthorized />;
        }

        // if (!isAdmin && role === ROLE_ADMIN) {
        //   return <Unauthorized />;
        // }

        return <Component {...props} />;
      }}
    />
  );
};

export default PrivateRoute;
