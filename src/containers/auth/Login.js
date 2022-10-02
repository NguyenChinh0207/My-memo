import React, { useState } from "react";
import { GoogleOutlined } from "@ant-design/icons";
import "./Login.scss";
import { USER_FORGOT_PASSWORD } from "../../config/path";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";

const Login = () => {
  const { t } = useTranslation("login");

  const history = useHistory();

  const [loading, setLoading] = useState(false);

  const [isInvalidEmailPassword, setIsInvalidEmailPassword] = useState(false);

  const onValuesChange = () => {
    if (isInvalidEmailPassword) {
      setIsInvalidEmailPassword(false);
    }
  };

  const onFinish = async (data) => {};

  return (
    <div className="main">
      <p className="sign" align="center">
        Sign in
      </p>
      <form className="form1" />
      <input
        className="un "
        type="text"
        align="center"
        placeholder="Username"
      />
      <input
        className="pass"
        type="password"
        align="center"
        placeholder="Password"
      />
      <div className="btn-login-group">
        <div className="btn-login">
          <a className="submit-login" align="center">
            Sign in
          </a>
          <p className="forgot" align="center">
            <NavLink to={USER_FORGOT_PASSWORD}>Forgot Password?</NavLink>
          </p>
        </div>
        <a className="submit-login login-google" align="center">
          <GoogleOutlined />
          Sign in with Google
        </a>
      </div>
    </div>
  );
};

export default Login;
