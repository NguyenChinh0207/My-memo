import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import {getRole, isLogin} from "../config/function";
import NotFound from '../components/permission/NotFound';
import { HOME_PATH } from '../config/path';

const PublicRoute = ({component: Component, restricted, path, ...rest}) => {
  // const role = getRole()
      return (
        // restricted = false meaning public route
        // restricted = true meaning restricted route
        <Route
          {...rest}
          render={(props) =>
            isLogin() && restricted ? (
              <Redirect to={HOME_PATH} />
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
