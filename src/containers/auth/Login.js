import React, { useContext, useState } from "react";
import "./Login.scss";
import { useTranslation } from "react-i18next";
import { NavLink, useHistory } from "react-router-dom";
import PrivateLayout from "../../layout/PrivateLayout";
import img from "../../assets/img/space.png";
import { Button, Checkbox, Col, Form, Input, notification } from "antd";
import validator from "validator";
import {
  API_LOGIN,
  API_POST_PROGRESS,
  API_SAVE_USER,
} from "../../config/endpointApi";
import {
  HOME_PATH,
  USER_FORGOT_PASSWORD,
  USER_LIST_PATH,
} from "../../config/path";
import { postAxios } from "../../Http";
import { AUTH_TOKEN, E001, E002 } from "../../config/const";
import { saveAccessToken, saveUserInfo } from "../../config/function";
import ReactFacebookLogin from "react-facebook-login";
import { AppContext } from "../../context/AppContext";

const Login = () => {
  const { t } = useTranslation("login");
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const { setUserInfo } = useContext(AppContext);

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
        if (response?.data?.code === E001)
          notification.error({
            message: t("Tên đăng nhập hoặc mật khẩu không đúng."),
          });
        if (response?.data?.code === E002)
          notification.error({
            message: t("Mật khẩu không đúng."),
          });
      })
      .then(() => setLoading(false));
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
          message: response.data.message,
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
            <div className="LoginTitle">{t("btn_login")}</div>
            <Form.Item
              label={t("Tên đăng nhập")}
              name="username"
              rules={[
                {
                  required: true,
                  whitespace: true,
                  message: t("Đây là thông tin bắt buộc."),
                },
              ]}
            >
              <Input placeholder={t("Nhập tên đăng nhập...")} />
            </Form.Item>

            <Form.Item
              label={t("Mật khẩu")}
              name="password"
              rules={[
                {
                  required: true,
                  whitespace: true,
                  message: t("Đây là thông tin bắt buộc."),
                },
              ]}
            >
              <Input.Password placeholder={t("Nhập mật khẩu...")} />
            </Form.Item>
            <Form.Item className="rememberPassword-wrap">
              <Form.Item
                name="remember"
                valuePropName="checked"
                className="checkbox-rememberme"
              >
                <Checkbox>{t("Ghi nhớ mật khẩu")}</Checkbox>
              </Form.Item>
              {/* <NavLink className="login-form-forgot" to={USER_FORGOT_PASSWORD}>
                {t("Quên mật khẩu?")}
              </NavLink> */}
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="LoginButton"
                loading={loading}
              >
                {t("btn_login")}
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
                textButton={t("login_title")}
                render={(renderProps) => (
                  <Button onClick={renderProps.onClick}>
                    {t("login_title")}
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
