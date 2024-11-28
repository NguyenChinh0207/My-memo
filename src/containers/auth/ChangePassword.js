import React, { useContext, useEffect, useState } from "react";
import "./Login.scss";
import { useTranslation } from "react-i18next";
import { Button, Form, Input, Modal, notification } from "antd";
import { API_CHANGE_PASSWORD } from "../../config/endpointApi";
import { AppContext } from "../../context/AppContext";
import { CODE_NOT_FOUND, CODE_PASSWORD_NOT_CORRECT } from "../../config/const";
import { postAxios } from "../../Http";
import validator from "validator";

const ChangePassword = ({ triggerModal, onModalClose }) => {
  const { t } = useTranslation("auth");
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false); 
  const { user_info } = useContext(AppContext);

  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setIsModalOpen(triggerModal);
  }, [triggerModal]);

  const handleModalClose = () => {
    setIsModalOpen(false);
    if (onModalClose) onModalClose(); 
  };

  const onFinish = async (data) => {
    if (data?.newPassword !== data?.password_again) {
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
    try {
      if (onModalClose) onModalClose(); 
      await postAxios(API_CHANGE_PASSWORD, {
        userId: user_info._id,
        oldPassword: data.oldPassword,
        newPassword: data.newPassword,
      });

      notification.success({
        message: t("msg_mail_sent_code"),
      });
    } catch (error) {
      const { response } = error;
      if (response?.data?.code === CODE_NOT_FOUND) {
        notification.error({
          message: t("user_not_found"),
        });
      } else if (response?.data?.code === CODE_PASSWORD_NOT_CORRECT) {
        notification.error({
          message: t("pass"),
        })}
        else {
        notification.error({
          message: t("common:server_error"),
        });
      }
    } finally {
      setLoading(false); 
      setIsModalOpen(false);
    }
  };

  return (
    <>
      <Modal
        title={t("change_password_title")}
        open={isModalOpen}
        footer={null}
        onCancel={handleModalClose}
      >
        <Form
          form={form}
          name="basic"
          onFinish={onFinish}
          layout={"vertical"}
        >
          <Form.Item
            label={t("current_password")}
            name="oldPassword"
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
                      return Promise.reject(t("password_not_strong"));
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
            label={t("new_password")}
            name="newPassword"
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
                      return Promise.reject(t("password_not_strong"));
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
              {t("change_password_btn")}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default ChangePassword;
