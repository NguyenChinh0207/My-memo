import React, { useContext, useEffect, useState } from "react";
import "../CourseDetail.scss";
import { useTranslation } from "react-i18next";
import {
  Button,
  Divider,
  Form,
  Input,
  notification,
  Popconfirm,
  Table,
} from "antd";
import { useHistory, useParams } from "react-router-dom";
import { CaretDownOutlined, UploadOutlined } from "@ant-design/icons";
import { EXAM_DETAIL_PATH, EXAM_EDIT_PATH } from "../../../../config/path";
import { postAxios } from "../../../../Http";
import IconEdit from "../../../../common/Icon/IconEdit";
import { bindParams, handleDownload } from "../../../../config/function";
import * as xlsx from "xlsx";
import {
  API_EXAM_CREATE,
  API_EXAM_DELETE,
  API_EXAM_LIST,
} from "../../../../config/endpointApi";
import { CODE_ALREADY_EXIST, CODE_NOT_FOUND } from "../../../../config/const";

const QuestionExams = (props) => {
  const { t } = useTranslation("course");
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const { courseId } = useParams();
  const course = props.course;
  const [showForm, setShowForm] = useState(false);
  const [form] = Form.useForm();
  const [fileName, setFileName] = useState("");
  const [questions, setQuestions] = useState([]);
  const [exams, setExams] = useState([]);
  const [validate, setValidate] = useState(false);

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

  const onCell = (record, rowIndex) => {
    return {
      onClick: (event) => {
        history.push(
          bindParams(EXAM_DETAIL_PATH, {
            courseId: course._id,
            examId: record._id,
          })
        );
      },
    };
  };

  const columns = [
    {
      title: "#",
      dataIndex: "index",
      width: "5%",
      render: (value, data, index) => {
        return index + 1;
      },
      onCell,
    },
    {
      title: t("topic_name"),
      width: "25%",
      align: "left",
      ellipsis: "true",
      dataIndex: "name",
      onCell,
    },
    {
      title: t("anwser_time"),
      dataIndex: "time_answer",
      width: "20%",
      align: "left",
      render: (time_answer) => {
        return `${time_answer} ${t("minutes")}`;
      },
      onCell,
    },
    {
      title: t("questions_appear"),
      dataIndex: "questions_appear",
      width: "20%",
      align: "left",
      render: (questions_appear) => {
        return `${questions_appear}`;
      },
      onCell,
    },
    {
      title: t("actions"),
      dataIndex: "_id",
      width: "15%",
      align: "left",
      render: (_id) => {
        return (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "start",
            }}
          >
            <div
              style={{ display: "flex", alignItems: "center" }}
              onClick={() =>
                history.push(
                  bindParams(EXAM_EDIT_PATH, {
                    courseId: course._id,
                    examId: _id,
                  })
                )
              }
            >
              <IconEdit style={{ color: "grey", width: "40px" }} />
            </div>
            <Popconfirm
              title={t("confirm_delete_topic")}
              onConfirm={() => onClickDelete(_id)}
              okText={t("common:yes")}
              cancelText={t("common:no")}
            >
              <div className="RemoveBtn" />
            </Popconfirm>
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    setShowForm(false);
    loadExams();
    return () => {
      setValidate(false);
      setQuestions([]);
    };
  }, []);

  const loadExams = () => {
    setLoading(true);
    postAxios(API_EXAM_LIST, { courseId: course._id })
      .then((res) => {
        setExams(res?.data);
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
        if (arrQuestion.length === 0) {
          setValidate(true);
        } else {
          setValidate(false);
        }
        setQuestions(arrQuestion);
      };
      reader.readAsArrayBuffer(e.target.files[0]);
    }
  };

  const onClickDelete = (id) => {
    setLoading(true);
    postAxios(API_EXAM_DELETE, { id })
      .then((res) => {
        notification.success({
          message: t("delete_exam_success"),
        });
        loadExams();
      })
      .catch((error) => {
        const { response } = error;
        if (response?.data?.code === CODE_NOT_FOUND) {
          notification.error({
            message: `${t("topic_not_found")}`,
          });
          return;
        }
        notification.error({
          message: t("common:msg_please_try_again"),
        });
      })
      .finally(() => setLoading(false));
  };

  const onFinish = (data) => {
    setValidate(false);
    if (questions.length === 0) {
      setValidate(true);
      return;
    }
    if (!validate || questions.length > 0) {
      data.courseId = courseId;
      data.questions = questions;
      setLoading(true);
      postAxios(API_EXAM_CREATE, data)
        .then((res) => {
          notification.success({
            message: t("create_topic_success"),
          });
          setShowForm(false);
          setFileName("");
          setQuestions([]);
          form.resetFields(["name", "questions_appear", "time_answer"]);
          loadExams();
        })
        .catch((error) => {
          const { response } = error;
          if (response?.data?.code === CODE_ALREADY_EXIST) {
            notification.error({
              message: `${t("msg_topic_exist")}`,
            });
            return;
          }
          notification.error({
            message: t("common:msg_please_try_again"),
          });
        })
        .finally(() => setLoading(false));
    }
  };

  return (
    <div className="formQuestions">
      <div className="HeaderFormQuestion">
        <h3>{t("topic_list")}</h3>
        <div className="showCreate" onClick={() => setShowForm(!showForm)}>
          {t("common:create")}
          <CaretDownOutlined className="showCreateIcon" />
        </div>
      </div>
      <Divider />
      {showForm ? (
        <Form
          name="basic"
          onFinish={onFinish}
          className="FormCreate"
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
                    return Promise.reject(new Error(t("validate_required")));
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
                <p style={{ color: "red" }}>{t("validate_required")}</p>
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
              type="primary"
              htmlType="submit"
              className="CreateExam"
              loading={loading}
            >
              {t("common:create")}
            </Button>
          </Form.Item>
          <Divider />
        </Form>
      ) : (
        ""
      )}
      {!showForm && exams.length === 0 && (
        <div style={{ textAlign: "center", marginBottom: "10px" }}>
          {t("course:course_no_exam")}
        </div>
      )}
      <Table
        columns={columns}
        dataSource={exams}
        loading={loading}
        pagination={false}
      />
    </div>
  );
};

export default React.memo(QuestionExams);
