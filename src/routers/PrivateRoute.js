import React from 'react'
import { Route, Redirect } from "react-router-dom";
import { isLogin } from "../config/function";
import {ADMIN_LOGIN, DASHBOARD_PATH } from "../config/path";

const PrivateRoute = ({ component: Component, restricted, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(props) =>
        !isLogin() ? (
          <Redirect to={DASHBOARD_PATH} />
        ) 
        :  <Component {...props} />
      }
    />
  );
};

export default PrivateRoute
