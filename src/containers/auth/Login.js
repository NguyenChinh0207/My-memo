import React, { useState } from "react";
import { GoogleOutlined } from "@ant-design/icons";
import "./Login.scss";
import { USER_FORGOT_PASSWORD } from "../../config/path";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import PrivateLayout from "../../layout/PrivateLayout";
import img from "../../assets/img/space.png";

const Login = () => {
  const { t } = useTranslation("login");

  const history = useHistory();

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(false);

  const [isInvalidEmailPassword, setIsInvalidEmailPassword] = useState(false);

  const onValuesChange = () => {
    if (isInvalidEmailPassword) {
      setIsInvalidEmailPassword(false);
    }
  };
  const loginClick = () => {
    let correct = true;
    if (this.state.email === "") {
      correct = false;
      this.setState({
        emailInputClasses: styles.Input + " " + styles.Error,
      });
    }
    if (this.state.password === "") {
      correct = false;
      this.setState({
        passwordInputClasses: styles.Input + " " + styles.Error,
      });
    }
    if (correct) {
      this.login();
    }
  };
  const onKeyDown = (event) => {
    if (event.key === "Enter") {
      loginClick();
    }
  };

  const onFinish = async (data) => {};

  return (
    <PrivateLayout breadcrumbs={[t("event:title")]}>
      <div className="Content">
        <div className="WhiteBox">
          <img className="imgLogin" src={img} alt="" />
          <div className="wrapLogin">
            <div className="LoginTitle">Đăng nhập</div>
            {errorMessage}
            <div className={"LoginTitle labelRequire"}>Họ tên:</div>
            <input
              name="email"
              // onChange={this.inputChange}
              className="emailInputClasses"
            />
            <div className={"LoginTitle labelRequire"}>Mật khẩu:</div>
            <input
              name="password"
              // onChange={this.inputChange}
              type="password"
              // className={this.state.passwordInputClasses}
              onKeyDown={onKeyDown}
            />
            <div onClick={loginClick} className="LoginButton">
              Đăng nhập
            </div>
          </div>
        </div>
      </div>
    </PrivateLayout>
  );
};

export default Login;
