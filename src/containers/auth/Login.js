import React, { useState } from "react";
import "./Login.scss";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import PrivateLayout from "../../layout/PrivateLayout";
import img from "../../assets/img/space.png";
import { Button, Col, Form, Input, Row } from "antd";
import validator from "validator";

const Login = () => {
  const { t } = useTranslation("login");
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const onFinish = async (data) => {};

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

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="LoginButton"
                // loading={true}
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
