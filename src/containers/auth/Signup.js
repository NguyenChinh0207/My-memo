import React, { useState } from "react";
import "./Login.scss";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import PrivateLayout from "../../layout/PrivateLayout";
import img from "../../assets/img/space.png";
import { Button, Form, Input } from "antd";
import validator from "validator";

const Signup = () => {
  const { t } = useTranslation("login");

  const history = useHistory();
  const [form] = Form.useForm();

  const [loading, setLoading] = useState(false);
  const onFinish = async (data) => {
    if (data.password !== data.password_again) {
      form.setFields([
        {
          name: "password_again",
          errors: [t("Mật khẩu không khớp!")],
        },
      ]);
      return;
    } else {
      form.setFields([
        {
          name: "password_again",
          errors: [],
        },
      ]);
    }
  };

  return (
    <PrivateLayout>
      <div className="Content-login">
        <div className="WhiteBox">
          <img className="imgLogin" src={img} alt="" />
          <Form
            form={form}
            className="wrapLogin"
            name="basic"
            onFinish={onFinish}
            layout={"vertical"}
          >
            <div className="LoginTitle">{t("btn_signup")}</div>
            <Form.Item
              label={t("Họ và tên")}
              name="fullname"
              rules={[
                {
                  required: true,
                  whitespace: true,
                  message: t("Đây là thông tin bắt buộc."),
                },
              ]}
            >
              <Input placeholder={t("Nhập họ và tên...")} />
            </Form.Item>

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
              label="Email"
              name="email"
              rules={[
                {
                  type: "email",
                  message: t("Email không đúng định dạng!"),
                },
                {
                  required: true,
                  whitespace: true,
                  message: t("Đây là thông tin bắt buộc."),
                },
              ]}
            >
              <Input placeholder={t("Nhập email...")} />
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

            <Form.Item
              label={t("Nhập lại mật khẩu")}
              name="password_again"
              rules={[
                {
                  required: true,
                  whitespace: true,
                  message: t("Đây là thông tin bắt buộc."),
                },
              ]}
            >
              <Input.Password placeholder={t("Nhập lại mật khẩu...")} />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="LoginButton"
                // loading={true}
              >
                {t("btn_signup")}
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </PrivateLayout>
  );
};

export default Signup;
