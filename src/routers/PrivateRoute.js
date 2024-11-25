import React from "react";
import { Route, Redirect } from "react-router-dom";
import NotFound from "../components/permission/NotFound";
import Unauthorized from "../components/permission/Unauthorized";
import { isLogin, getRole } from "../config/function";
import { DASHBOARD_PATH, ADMIN_PATH } from "../config/path"; 
import { ROLE_ADMIN } from "../config/const";

const PrivateRoute = ({
  component: Component,
  restricted,
  isAdmin,
  path,
  ...rest
}) => {
  const role = getRole(); 

  return (
    <Route
      {...rest}
      render={(props) => {
        // Kiểm tra nếu người dùng chưa đăng nhập
        if (!isLogin()) {
          return <Redirect to={DASHBOARD_PATH} />;
        }

        // Kiểm tra quyền truy cập cho Admin
        if (isAdmin && role !== ROLE_ADMIN) {
          return <Unauthorized />;
        }

        // Kiểm tra quyền truy cập cho User (không phải Admin)
        if (!isAdmin && role === ROLE_ADMIN) {
          return <Unauthorized />;
        }

        // Kiểm tra nếu role phù hợp và hiển thị component
        return <Component {...props} />;
      }}
    />
  );
};

export default PrivateRoute;
