import React from "react";
import { Route, Redirect } from "react-router-dom";
import { getRole, isLogin } from "../config/function";
import NotFound from "../components/permission/NotFound";
import Unauthorized from "../components/permission/Unauthorized";
import { ADMIN_PATH, HOME_PATH } from "../config/path";
import { ROLE_ADMIN } from "../config/const";

const PublicRoute = ({
  component: Component,
  restricted,
  path,
  isAdmin,
  ...rest
}) => {
  // Lấy role từ localStorage và chuyển nó thành int
  const role = getRole();

  // Kiểm tra điều kiện và xác định hành động cần thực hiện
  return (
    <Route
      {...rest}
      render={(props) => {
        // Nếu người dùng đã đăng nhập và đang cố truy cập vào trang restricted
        if (isLogin() && restricted) {
          // Điều hướng người dùng về trang home nếu restricted là true
          if(role == ROLE_ADMIN){
            return <Redirect to={ADMIN_PATH} />;
          } else{
            return <Redirect to={HOME_PATH} />;
          }
        }

        // Kiểm tra nếu là trang admin nhưng role không phải ADMIN
        if (isAdmin && role !== ROLE_ADMIN) {
          // Nếu người dùng không có quyền admin, chuyển đến trang Unauthorized
          return <Unauthorized />;
        }

        // Nếu không có lỗi gì, render component chính
        if (path) {
          return <Component {...props} />;
        }

        // Nếu không có path hợp lệ, render trang NotFound
        return <NotFound />;
      }}
    />
  );
};

export default PublicRoute;
