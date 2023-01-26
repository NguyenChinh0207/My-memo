import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory, useParams } from "react-router-dom";
import "./Exam.scss";
import PrivateLayout from "../../layout/PrivateLayout";
import Layout from "antd/lib/layout/layout";
import { Button, Divider, Form, notification, Table, Tooltip } from "antd";
import { postAxios } from "../../Http";
import { API_EXAM_DETAIL } from "../../config/endpointApi";
import { bindParams } from "../../config/function";
import { COURSE_EDIT_PATH, EXAM_EDIT_PATH } from "../../config/path";

const ExamDetail = () => {
  const { t } = useTranslation("common");
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const { examId, courseId } = useParams();
  const [form] = Form.useForm();
  const [questions, setQuestions] = useState([]);
  const [exam, setExam] = useState({});

  const columns = [
    {
      title: "#",
      dataIndex: "index",
      width: "5%",
      render: (value, data, index) => {
        return index + 1;
      },
    },
    {
      title: t("Câu hỏi"),
      width: "20%",
      align: "left",
      ellipsis: "true",
      ellipsis: true,
      dataIndex: "content",
      render: (content) => {
        return (
          <Tooltip color={"#c5c4c4"} title={content} placement="topLeft">
            {content}
          </Tooltip>
        );
      },
    },
    {
      title: t("Câu trả lời 1"),
      dataIndex: "answer",
      width: "13%",
      ellipsis: true,
      align: "left",
      render: (answer) => {
        return (
          <Tooltip color={"#c5c4c4"} title={answer[0]} placement="topLeft">
            {answer[0]}
          </Tooltip>
        );
      },
    },
    {
      title: t("Câu trả lời 2"),
      dataIndex: "answer",
      width: "13%",
      ellipsis: true,
      align: "left",
      render: (answer) => {
        return (
          <Tooltip color={"#c5c4c4"} title={answer[1]} placement="topLeft">
            {answer[1]}
          </Tooltip>
        );
      },
    },
    {
      title: t("Câu trả lời 3"),
      dataIndex: "answer",
      width: "13%",
      ellipsis: true,
      align: "left",
      render: (answer) => {
        return (
          <Tooltip color={"#c5c4c4"} title={answer[2]} placement="topLeft">
            {answer[2]}
          </Tooltip>
        );
      },
    },
    {
      title: t("Câu trả lời 4"),
      dataIndex: "answer",
      width: "13%",
      ellipsis: true,
      align: "left",
      render: (answer) => {
        return (
          <Tooltip color={"#c5c4c4"} title={answer[3]} placement="topLeft">
            {answer[3]}
          </Tooltip>
        );
      },
    },
    {
      title: t("Đáp án"),
      dataIndex: "correct",
      width: "10%",
      ellipsis: true,
      align: "left",
      render: (correct) => {
        return (
          <Tooltip color={"#c5c4c4"} title={correct} placement="topLeft">
            {correct}
          </Tooltip>
        );
      },
    },
  ];

  useEffect(() => {
    loadExams();
  }, []);

  const loadExams = () => {
    setLoading(true);
    postAxios(API_EXAM_DETAIL, { id: examId })
      .then((res) => {
        setExam(res?.data);
        setQuestions(res?.data?.questions);
      })
      .catch((error) => {
        notification.error({
          message: t("Đã có lỗi xảy ra, vui lòng thử lại sau."),
        });
      })
      .then(() => setLoading(false));
  };

  return (
    <PrivateLayout>
      <Layout style={{ minWidth: "100vh" }} className="Exam">
        <div className="PageHead">
          <div className="PageHeadRow">
            <div className="Title">{t("Chi tiết chủ đề")}</div>
          </div>
        </div>
        {exam && (
          <div className="formQuestionsEdit">
            <div>
              <div className="labelName">
                {`${t("Tên chủ đề")}:`}
                <span className="valueName">{exam?.name}</span>
              </div>
              <div className="label-wrap">
                <div className="labelName">
                  {`${t("Số lượng câu hỏi xuất hiện")}:`}
                  <span className="valueName">{exam?.questions_appear}</span>
                </div>
                <div className="labelName">
                  {`${t("Thời gian trả lời(giây)")}:`}
                  <span className="valueName">{exam?.time_answer}</span>
                </div>
              </div>
            </div>
            <Divider />
            <p>{t("Danh sách câu hỏi")}</p>
            <Table columns={columns} dataSource={questions} />
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <Button
                type="default"
                className="CreateExam"
                style={{ marginRight: "10px" }}
                onClick={() =>
                  history.push(
                    bindParams(COURSE_EDIT_PATH, {
                      courseId,
                    })
                  )
                }
              >
                {t("Quay lại")}
              </Button>
              <Button
                type="primary"
                onClick={() =>
                  history.push(
                    bindParams(EXAM_EDIT_PATH, {
                      courseId,
                      examId,
                    })
                  )
                }
                className="ExamEdit"
                loading={loading}
              >
                {t("Chỉnh sửa chủ đề")}
              </Button>
            </div>
          </div>
        )}
      </Layout>
    </PrivateLayout>
  );
};

export default ExamDetail;
