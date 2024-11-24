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
  const { t } = useTranslation("course");
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
      title: t("course:question"),
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
      title: t("answer1"),
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
      title: t("answer2"),
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
      title: t("answer3"),
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
      title: t("answer4"),
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
      title: t("correct_answer"),
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
    loadExam();
  }, []);

  const loadExam = () => {
    setLoading(true);
    postAxios(API_EXAM_DETAIL, { id: examId })
      .then((res) => {
        setExam(res?.data);
        setQuestions(res?.data?.questions);
      })
      .catch((error) => {
        const { response } = error;
        notification.error({
          message: response?.data?.message
            ? `${t("common:server_error")}: ${response?.data?.message}`
            : t("common:msg_please_try_again"),
        });
      })
      .then(() => setLoading(false));
  };

  return (
    <PrivateLayout>
      <Layout style={{ minWidth: "100vh" }} className="Exam">
        <div className="PageHead">
          <div className="PageHeadRow">
            <div className="Title">{t("topic_detail")}</div>
          </div>
        </div>
        {exam && (
          <div className="formQuestionsEdit">
            <div>
              <div className="labelName">
                {`${t("topic_name")}:`}
                <span className="valueName">{exam?.name}</span>
              </div>
              <div className="label-wrap">
                <div className="labelName">
                  {`${t("questions_appear")}:`}
                  <span className="valueName">{exam?.questions_appear}</span>
                </div>
                <div className="labelName">
                  {`${t("response_time")}:`}
                  <span className="valueName">{exam?.time_answer}</span>
                </div>
              </div>
            </div>
            <Divider />
            <p>{t("question_list")}</p>
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
                {t("back")}
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
                {t("edit_topic")}
              </Button>
            </div>
          </div>
        )}
      </Layout>
    </PrivateLayout>
  );
};

export default ExamDetail;
