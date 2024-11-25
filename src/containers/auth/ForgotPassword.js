import React, { useEffect, useState } from "react";
import "./Login.scss";
import { useTranslation } from "react-i18next";
import { Button, Form, Input, Modal, notification } from "antd";
import { CODE_MAIL_NOT_MATCH, CODE_MAIL_NO_USER, CODE_NOT_FOUND } from "../../config/const";
import { API_GENERATE_CODE, API_VERIFY_CODE } from "../../config/endpointApi";
import { postAxios } from "../../Http";

const ForgotPassword = ({ triggerModal, onModalClose }) => {
  const { t } = useTranslation("auth");
  const [isModalMailOpen, setIsModalMailOpen] = useState(false);
  const [isModalCodeVerifyOpen, setIsModalCodeVerifyOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [flag, setFlag] = useState(false);

  const [loading, setLoading] = useState(false); // Thêm state loading

  useEffect(() => {
    setIsModalMailOpen(triggerModal);
  }, [triggerModal]);

  const handleModalClose = () => {
    setIsModalMailOpen(false);
    if (onModalClose) onModalClose(); // Gọi callback để đồng bộ trạng thái triggerModal
  };

  const handleModalCodeClose = () => {
    setIsModalCodeVerifyOpen(false);
  };

  const onFinish = async (data) => {
    setEmail(data.email);
    setLoading(true); // Bật trạng thái loading khi bắt đầu gửi email
    try {
      if (onModalClose) onModalClose(); // Đồng bộ trạng thái khi form gửi thành công
      await postAxios(API_GENERATE_CODE, { email: data.email });

      setFlag(true);

      notification.success({
        message: t("msg_mail_sent_code"),
      });
      setIsModalCodeVerifyOpen(true);
    } catch (error) {
      const { response } = error;
      if (response?.data?.code === CODE_NOT_FOUND) {
        notification.error({
          message: t("user_not_found"),
        });
      } else {
        notification.error({
          message: t("common:server_error"),
        });
      }
    } finally {
      setLoading(false); // Tắt trạng thái loading sau khi hoàn thành
      setIsModalMailOpen(false);

    }
  };

  const onSubmitCode = async (data) => {
    setLoading(true);
    try {
      await postAxios(API_VERIFY_CODE, { email: email, code: data.code });

      notification.success({
        message: t("msg_mail_sent_password"),
      });
      setIsModalCodeVerifyOpen(false);

    } catch (error) {
      const { response } = error;
      if (response?.data?.code === CODE_MAIL_NOT_MATCH) {
        notification.error({
          message: t("code_not_match"),
        });
      } else {
        notification.error({
          message: t("common:server_error"),
        });
      }
    } finally {
      setLoading(false); // Tắt trạng thái loading sau khi hoàn thành
    }
  };

  return (
    <>
      {!flag ? (
        <Modal
          title={t("forgot_password_title")}
          open={isModalMailOpen}
          onCancel={handleModalClose}
          footer={null}
        >
          <Form
            name="basic"
            style={{ maxWidth: 600 }}
            onFinish={onFinish}
            autoComplete="off"
          >
            <p>{t("forgot_password_content")}</p>
            <Form.Item
              label="Email"
              name="email"
              rules={[
                { type: "email", message: t("email_invalid") },
                {
                  required: true,
                  whitespace: true,
                  message: t("field_require"),
                },
              ]}
            >
              <Input placeholder={t("email_placeholder")} />
            </Form.Item>
            <Form.Item wrapperCol={{ offset: 10, span: 12 }}>
              <Button type="primary" htmlType="submit" loading={loading}>
                {t("send_mail")}
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      ) : (
        <Modal
          title={t("password_reset_authen_title")}
          open={isModalCodeVerifyOpen}
          onCancel={handleModalCodeClose}
          footer={null}
        >
          <Form
            name="basic"
            style={{ maxWidth: 600 }}
            onFinish={onSubmitCode}
            autoComplete="off"
          >
            <p>{t("password_reset_authen_content")}</p>
            <Form.Item
              label={t("code")}
              name="code"
              rules={[
                {
                  required: true,
                  whitespace: true,
                  message: t("field_require"),
                },
              ]}
            >
              <Input.Password />
            </Form.Item>
            <Form.Item wrapperCol={{ offset: 10, span: 12 }}>
              <Button type="primary" htmlType="submit" loading={loading}>
                {t("send_mail")}
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      )}
    </>
  );
};

export default ForgotPassword;
