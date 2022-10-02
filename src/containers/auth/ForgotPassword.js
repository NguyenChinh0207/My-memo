import React, { useState } from "react";
import "./Login.scss";
import { useTranslation } from "react-i18next";

const ForgotPassword = () => {
  const { t } = useTranslation("forgotPassword");

  const [loading, setLoading] = useState(false);

  const [isInvalidEmail, setIsInvalidEmail] = useState(false);

  const [success, setSuccess] = useState(false);

  const onValuesChange = () => {
    if (isInvalidEmail) {
      setIsInvalidEmail(false);
    }
  };

  const onFinish = async (data) => {};

  return (
    <div className="main">
      <p className="sign" align="center">
        FORGOT PASSWORD
      </p>
      <form className="form1" />
      <input
        className="un "
        type="text"
        align="center"
        placeholder="Email"
      />
      <a className="submit-login btn-send" align="center">
        Send email
      </a>
    </div>
  );
};

export default ForgotPassword;
