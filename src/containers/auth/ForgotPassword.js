import React, { useState } from "react";
import "./Login.scss";
import { useTranslation } from "react-i18next";

const ForgotPassword = () => {
  const { t } = useTranslation("auth");

  const [loading, setLoading] = useState(false);

  const onFinish = async (data) => {};

  return (
    <div className="main">
      <p className="sign" align="center">
        {t("forgot_password_title")}
      </p>
      <form className="form1" />
      <input
        className="un "
        type="text"
        align="center"
        placeholder={t("email_placeholder")}
      />
      <a className="submit-login btn-send" align="center">
        {t("send_mail")}
      </a>
    </div>
  );
};

export default ForgotPassword;
