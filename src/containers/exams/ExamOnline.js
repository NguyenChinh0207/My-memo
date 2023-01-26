import React, { useContext, useEffect, useState } from "react";
import "./Exam.scss";
import { useHistory, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { notification, Spin } from "antd";
import { AppContext } from "../../context/AppContext";
import ExamHeader from "../../components/exam/ExamHeader";
import { API_EXAM_LIST } from "../../config/endpointApi";
import { postAxios } from "../../Http";

const ExamOnline = () => {
  const { t } = useTranslation("common");
  const history = useHistory();
  const { courseId } = useParams();
  const { user_info } = useContext(AppContext);
  const [loading, setLoading] = useState(false);
  const [exams, setExams] = useState([]);

  useEffect(() => {
    loadExams();
  }, []);

  const loadExams = () => {
    setLoading(true);
    postAxios(API_EXAM_LIST, { courseId })
      .then((res) => {
        setExams(res?.data);
      })
      .catch((error) => {
        notification.error({
          message: t("Đã có lỗi xảy ra, vui lòng thử lại sau."),
        });
      })
      .then(() => setLoading(false));
  };

  return (
    <div>
      <ExamHeader />
    </div>
  );
};

export default React.memo(ExamOnline);
