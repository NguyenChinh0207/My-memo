import React, { useState } from "react";
import "./Login.scss";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import PrivateLayout from "../../layout/PrivateLayout";
import img from "../../assets/img/space.png";
import { Button, Form, Input, notification } from "antd";
import validator from "validator";
import { API_POST_PROGRESS, API_REGISTER } from "../../config/endpointApi";
import { postAxios } from "../../Http";
import { USER_LOGIN } from "../../config/path";
import { CODE_EMAIL_ALREADY, CODE_USERNAME_ALREADY } from "../../config/const";

const Signup = () => {
  const { t } = useTranslation("auth");

  const history = useHistory();
  const [form] = Form.useForm();

  const [loading, setLoading] = useState(false);

  const onFinish = async (data) => {
    if (data?.password !== data?.password_again) {
      form.setFields([
        {
          name: "password_again",
          errors: [t("password_not_matched")],
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
    setLoading(true);
    postAxios(API_REGISTER, data)
      .then((res) => {
        if (res?.data?._id) {
          postAxios(API_POST_PROGRESS, {
            progress: "{}",
            userId: res?.data?._id,
          });
        }
        notification.success({
          message: t("register_success"),
        });
        history.push(USER_LOGIN);
      })
      .catch((error) => {
        const { response } = error;
        if (response?.data?.code === CODE_USERNAME_ALREADY)
          notification.error({
            message: t("username_taken"),
          });
        if (response?.data?.code === CODE_EMAIL_ALREADY)
          notification.error({
            message: t("email_taken"),
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
            form={form}
            className="wrapLogin"
            name="basic"
            onFinish={onFinish}
            layout={"vertical"}
          >
            <div className="LoginTitle">{t("register_title")}</div>
            <Form.Item
              label={t("fullname")}
              name="fullname"
              rules={[
                {
                  required: true,
                  whitespace: true,
                  message: t("field_require"),
                },
              ]}
            >
              <Input placeholder={t("fullname_placeholder")} />
            </Form.Item>

            <Form.Item
              label={t("user_name")}
              name="username"
              // extra={t("Tên đăng nhập tối đa 12 kí tự")}
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
              label="Email"
              name="email"
              rules={[
                {
                  type: "email",
                  message: t("email_invalid"),
                },
                {
                  required: true,
                  whitespace: true,
                  message: t("field_require"),
                },
              ]}
            >
              <Input placeholder={t("email_placeholder")} />
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
                        return Promise.reject("password_not_strong");
                      }
                    }
                    return Promise.resolve();
                  },
                },
              ]}
            >
              <Input.Password placeholder={t("password_placeholder")} />
            </Form.Item>

            <Form.Item
              label={t("password_again")}
              name="password_again"
              rules={[
                {
                  required: true,
                  whitespace: true,
                  message: t("field_require"),
                },
              ]}
            >
              <Input.Password placeholder={t("password_again_placeholder")} />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="LoginButton"
                loading={loading}
              >
                {t("register_btn")}
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </PrivateLayout>
  );
};

export default Signup;
