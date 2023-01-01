import React, { useState } from "react";
import "./Login.scss";
import { useTranslation } from "react-i18next";
import { NavLink, useHistory } from "react-router-dom";
import PrivateLayout from "../../layout/PrivateLayout";
import img from "../../assets/img/space.png";
import { Button, Checkbox, Col, Form, Input, notification } from "antd";
import validator from "validator";
import { API_LOGIN } from "../../config/endpointApi";
import { HOME_PATH, USER_FORGOT_PASSWORD } from "../../config/path";
import { postAxios } from "../../Http";
import { AUTH_TOKEN, E001, E002 } from "../../config/const";
import { saveAccessToken, saveUserInfo } from "../../config/function";

const Login = () => {
  const { t } = useTranslation("login");
  const history = useHistory();
  const [loading, setLoading] = useState(false);

  const onFinish = async (data) => {
    setLoading(true);
    postAxios(API_LOGIN, data)
      .then((res) => {
        saveAccessToken(res?.accessToken);
        saveUserInfo(res?.data);
        history.push(HOME_PATH);
      })
      .catch((error) => {
        const { response } = error;
        if (response?.data?.code === E001)
          notification.error({
            message: t("Tên đăng nhập hoặc mật khẩu không đúng."),
          });
      })
      .then(() => setLoading(false));
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
                {
                  validator(_, value) {
                    if (value.trim()) {
                      if (
                        validator.isStrongPassword(value, {
                          minLength: 8,
                          minLowercase: 1,
                          minUppercase: 1,
                          minNumbers: 1,
                          minSymbols: 1,
                        })
                      ) {
                        return Promise.resolve();
                      } else {
                        return Promise.reject("Mật khẩu chưa đủ mạnh.");
                      }
                    }
                    return Promise.resolve();
                  },
                },
              ]}
            >
              <Input.Password placeholder={t("Nhập mật khẩu...")} />
            </Form.Item>
            <Form.Item className="rememberPassword-wrap">
              <Form.Item name="remember" valuePropName="checked" className="checkbox-rememberme">
                <Checkbox>{t("Ghi nhớ mật khẩu")}</Checkbox>
              </Form.Item>
              <NavLink className="login-form-forgot" to={USER_FORGOT_PASSWORD}>
                {t("Quên mật khẩu?")}
              </NavLink>
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
          </Form>
        </div>
      </div>
    </PrivateLayout>
  );
};

export default Login;
