import React, { useContext, useEffect, useState } from "react";
import "./Exam.scss";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { notification, Spin } from "antd";
import { AppContext } from "../../context/AppContext";

const ExamOnline = () => {
  const { t } = useTranslation("common");
  const history = useHistory();
  const { user_info } = useContext(AppContext);
  const [loading, setLoading] = useState(false);

  useEffect(() => {}, []);

  return <div></div>;
};

export default React.memo(ExamOnline);
