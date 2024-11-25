import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory, useParams } from "react-router-dom";
import "./Exam.scss";
import PrivateLayout from "../../layout/PrivateLayout";
import Layout from "antd/lib/layout/layout";
import {
  Button,
  Divider,
  Form,
  Input,
  notification,
  Table,
  Tooltip,
} from "antd";
import { bindParams, handleDownload } from "../../config/function";
import * as xlsx from "xlsx";
import { UploadOutlined } from "@ant-design/icons";
import { postAxios } from "../../Http";
import { API_EXAM_DETAIL, API_EXAM_EDIT } from "../../config/endpointApi";
import { EXAM_DETAIL_PATH } from "../../config/path";

const ExamEdit = () => {
  const { t } = useTranslation("course");
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const { courseId, examId } = useParams();
  const [form] = Form.useForm();
  const [fileName, setFileName] = useState("");
  const [questions, setQuestions] = useState([]);
  const [validate, setValidate] = useState(false);
  const [exam, setExam] = useState({});

  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 8 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 16 },
    },
  };

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
      title: t("question"),
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
    loadExams();
    return () => {
      setValidate(false);
    };
  }, []);

  useEffect(() => {
    if (exam) {
      let examDetail = { ...exam };
      form.setFieldsValue(examDetail);
      setQuestions(exam.questions);
    }
  }, [exam, form]);

  const loadExams = () => {
    setLoading(true);
    postAxios(API_EXAM_DETAIL, { id: examId })
      .then((res) => {
        setExam(res?.data);
      })
      .catch((error) => {
        const { response } = error;
        notification.error({
          message: response?.data?.message
            ? `${t("common:server_error")}: ${response?.data?.message}`
            : t("common:msg_please_try_again"),
        });
      })
      .finally(() => setLoading(false));
  };

  const readUploadFile = (e) => {
    e.preventDefault();
    if (e.target.files) {
      setValidate(false);
      setFileName(e.target.files[0].name);
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = e.target.result;
        const workbook = xlsx.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json = xlsx.utils.sheet_to_json(worksheet);
        let arrQuestion = [];
        let question = {};
        json.map((element) => {
          question.content = element["Content"];
          question.answer = [
            element["Answer 1"],
            element["Answer 2"],
            element["Answer 3"],
            element["Answer 4"],
          ];
          question.correct = element["Correct"];
          arrQuestion.push(question);
          question = {};
        });
        if (arrQuestion.length === 0 && questions.length > 0) {
          setValidate(true);
        } else {
          setValidate(false);
        }
        setQuestions(arrQuestion);
      };
      reader.readAsArrayBuffer(e.target.files[0]);
    }
  };

  const onFinish = async (data) => {
    setValidate(false);
    if (questions.length === 0) {
      setValidate(true);
      return;
    }
    if (!validate || questions.length > 0) {
      data.id = examId;
      data.questions = questions;
      setLoading(true);
      postAxios(API_EXAM_EDIT, data)
        .then((res) => {
          notification.success({
            message: t("edit_topic_success"),
          });
          history.push(
            bindParams(EXAM_DETAIL_PATH, {
              courseId,
              examId,
            })
          );
        })
        .catch((error) => {
          const { response } = error;
          notification.error({
            message: response?.data?.message
              ? `${t("common:server_error")}: ${response?.data?.message}`
              : t("common:msg_please_try_again"),
          });
        })
        .finally(() => setLoading(false));
    }
  };

  return (
    <PrivateLayout>
      <Layout style={{ minWidth: "100vh" }} className="Exam">
        <div className="PageHead">
          <div className="PageHeadRow">
            <div className="Title">{t("edit_topic")}</div>
          </div>
        </div>
        <Form
          name="basic"
          onFinish={onFinish}
          className="formQuestionsEdit"
          form={form}
          {...formItemLayout}
        >
          <Form.Item
            label={t("topic_name")}
            name="name"
            rules={[
              {
                required: true,
                whitespace: true,
                message: t("common:validate_required"),
              },
            ]}
          >
            <Input placeholder={t("topic_name_placeholder")} />
          </Form.Item>
          <Form.Item
            label={t("questions_appear")}
            name="questions_appear"
            rules={[
              {
                required: true,
                validator: (_, value) => {
                  if (!value) {
                    return Promise.reject(
                      new Error(t("common:validate_required"))
                    );
                  }
                  if (Number(value) <= 0) {
                    return Promise.reject(
                      new Error(t("quantity_greater_validate"))
                    );
                  }
                  form.setFieldsValue({ questions_appear: Number(value) });
                  return Promise.resolve();
                },
              },
            ]}
          >
            <Input
              onKeyPress={(event) => {
                if (!/[0-9]/.test(event.key)) {
                  event.preventDefault();
                }
              }}
              placeholder={t("quantity_placeholder")}
            />
          </Form.Item>
          <Form.Item
            label={t("response_time")}
            name="time_answer"
            rules={[
              {
                validator(_, value) {
                  if (Number(value) <= 0) {
                    return Promise.reject(
                      new Error(t("quantity_greater_validate"))
                    );
                  }
                  form.setFieldsValue({ time_answer: Number(value) });
                  return Promise.resolve();
                },
              },
            ]}
          >
            <Input
              onKeyPress={(event) => {
                if (!/[0-9]/.test(event.key)) {
                  event.preventDefault();
                }
              }}
              placeholder={t("response_time_placeholder")}
            />
          </Form.Item>
          <Form.Item
            wrapperCol={{
              xs: { span: 24, offset: 0 },
              sm: { span: 16, offset: 8 },
            }}
          >
            <div className="ImportWrapper">
              <div style={{ display: "flex", alignItems: "center" }}>
                <Button type="default" className="ImportBtn">
                  <label htmlFor="upload-photo" className="label-upload">
                    <UploadOutlined size={24} style={{ marginRight: "3px" }} />
                    {t("upload_question_list")}
                  </label>
                </Button>
                <span style={{ marginLeft: "5px" }}>{fileName}</span>
              </div>
              <input
                type="file"
                name="upload"
                id="upload-photo"
                onChange={readUploadFile}
                style={{ display: "none" }}
                accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
              />
              {validate && (
                <p style={{ color: "red" }}>{t("common:validate_required")}</p>
              )}
              <a href={"#"} onClick={handleDownload}>
                {t("download_template")}
              </a>
            </div>
          </Form.Item>
          <Form.Item
            wrapperCol={{
              xs: { span: 24, offset: 0 },
              sm: { span: 16, offset: 8 },
            }}
          >
            <Button
              type="default"
              className="CreateExam"
              style={{ marginRight: "10px" }}
              onClick={() => history.goBack()}
            >
              {t("back")}
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              className="CreateExam"
              loading={loading}
            >
              {t("edit")}
            </Button>
          </Form.Item>
          <Divider />
          <p>{t("question_list")}</p>
          <Table columns={columns} dataSource={questions} />
        </Form>
      </Layout>
    </PrivateLayout>
  );
};

export default ExamEdit;
