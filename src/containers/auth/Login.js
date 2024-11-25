import React, { useContext, useState } from "react";
import "./Login.scss";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import PrivateLayout from "../../layout/PrivateLayout";
import img from "../../assets/img/space.png";
import { Button, Checkbox, Form, Input, notification } from "antd";

import {
  API_LOGIN,
  API_POST_PROGRESS,
  API_SAVE_USER,
} from "../../config/endpointApi";
import {
  HOME_PATH,
  USER_LIST_PATH,
} from "../../config/path";
import { postAxios } from "../../Http";
import { CODE_ERROR_EMAIL_PASSWORD_NOT_CORRECT, CODE_PASSWORD_NOT_CORRECT } from "../../config/const";
import { saveAccessToken, saveUserInfo } from "../../config/function";
import ReactFacebookLogin from "react-facebook-login";
import { AppContext } from "../../context/AppContext";
import ForgotPassword from "./ForgotPassword";

const Login = () => {
  const { t } = useTranslation("auth");
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const { setUserInfo } = useContext(AppContext);
  const [isForgotPasswordModalOpen, setIsForgotPasswordModalOpen] =
    useState(false);

  const handleForgotPasswordClick = () => {
    setIsForgotPasswordModalOpen((prev) => !prev);
  };
  const handleModalClose = () => {
    setIsForgotPasswordModalOpen(false); 
  };

  const onFinish = async (data) => {
    setLoading(true);
    postAxios(API_LOGIN, data)
      .then((res) => {
        saveAccessToken(res?.accessToken);
        saveUserInfo(res?.data);
        setUserInfo(res?.data);
        localStorage.setItem("roleId", res?.data.role);
        if (res?.data?.role === 1) {
          history.push(USER_LIST_PATH);
        } else history.push(HOME_PATH);
      })
      .catch((error) => {
        const { response } = error;
        if (response?.data?.code === CODE_ERROR_EMAIL_PASSWORD_NOT_CORRECT)
          notification.error({
            message: t("input_user_password_incorrect"),
          });
        if (response?.data?.code === CODE_PASSWORD_NOT_CORRECT)
          notification.error({
            message: t("password_invalid"),
          });
      })
      .finally(() => setLoading(false));
  };

  const responseFacebook = (response) => {
    postAxios(API_SAVE_USER, response)
      .then((res) => {
        saveAccessToken(res?.accessToken);
        saveUserInfo(res?.data);
        setUserInfo(res?.data);
        localStorage.setItem("roleId", 0);
        if (res?.data?._id) {
          postAxios(API_POST_PROGRESS, {
            progress: "{}",
            userId: res.data._id,
          });
        }
        history.push(HOME_PATH);
      })
      .catch((error) => {
        const { response } = error;
        notification.error({
          message: response?.data?.message,
        });
      });
  };

  return (
    <PrivateLayout>
      <div className="Content-login">
        <div className="WhiteBox">
          <img className="imgLogin" src={img} alt="" />
          <Form
            className="wrapLogin"
            name="basic"
            onFinish={onFinish}
            layout={"vertical"}
          >
            <div className="LoginTitle">{t("login_title")}</div>
            <Form.Item
              label={t("user_name")}
              name="username"
              rules={[
                {
                  required: true,
                  whitespace: true,
                  message: t("field_require"),
                },
              ]}
            >
              <Input placeholder={t("username_placeholder")} />
            </Form.Item>

            <Form.Item
              label={t("password")}
              name="password"
              rules={[
                {
                  required: true,
                  whitespace: true,
                  message: t("field_require"),
                },
              ]}
            >
              <Input.Password placeholder={t("password_placeholder")} />
            </Form.Item>
            <Form.Item className="rememberPassword-wrap">
              <Form.Item
                name="remember"
                valuePropName="checked"
                className="checkbox-rememberme"
              >
                <Checkbox>{t("remember_me")}</Checkbox>
              </Form.Item>
              <a
                onClick={handleForgotPasswordClick}
                className="login-form-forgot"
                href="#"
              >
                {t("forgot_password")}
              </a>
              <ForgotPassword triggerModal={isForgotPasswordModalOpen} onModalClose={handleModalClose} />
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="LoginButton"
                loading={loading}
              >
                {t("login_btn")}
              </Button>
            </Form.Item>
            <Form.Item>
              <ReactFacebookLogin
                appId="906729733674195"
                autoLoad={false}
                fields="name,email,picture"
                callback={responseFacebook}
                cssClass="my-facebook-button-class"
                icon="fa-facebook"
                textButton={t("login_with_fb_btn")}
                render={(renderProps) => (
                  <Button onClick={renderProps.onClick}>
                    {t("login_with_fb_btn")}
                  </Button>
                )}
              />
            </Form.Item>
          </Form>
        </div>
      </div>
    </PrivateLayout>
  );
};

export default Login;
