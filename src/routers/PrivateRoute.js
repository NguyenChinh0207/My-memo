import React from 'react'
import { Route, Redirect } from "react-router-dom";
import { isLogin } from "../config/function";
import {ADMIN_LOGIN } from "../config/path";

const PrivateRoute = ({ component: Component, restricted, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(props) =>
        !isLogin() ? (
          <Redirect to={ADMIN_LOGIN} />
        ) 
        :  <Component {...props} />
      }
    />
  );
};

export default PrivateRoute
