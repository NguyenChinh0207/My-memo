import React, { useContext, useEffect, useState } from "react";
import "../CourseDetail.scss";
import { useTranslation } from "react-i18next";
import {
  Button,
  Checkbox,
  Divider,
  Form,
  Image,
  Input,
  InputNumber,
  notification,
  Popconfirm,
  Table,
} from "antd";
import { AppContext } from "../../../../context/AppContext";
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
import { CODE_ALREADY_EXIST } from "../../../../config/const";

const QuestionExams = (props) => {
  const { t } = useTranslation("common");
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
      title: t("Tên chủ đề"),
      width: "25%",
      align: "left",
      ellipsis: "true",
      dataIndex: "name",
      onCell,
    },
    {
      title: t("Thời gian trả lời"),
      dataIndex: "time_answer",
      width: "20%",
      align: "left",
      render: (time_answer) => {
        return `${time_answer} ${t("giây")}`;
      },
      onCell,
    },
    {
      title: t("Số câu hỏi xuất hiện"),
      dataIndex: "questions_appear",
      width: "20%",
      align: "left",
      render: (questions_appear) => {
        return `${questions_appear}`;
      },
      onCell,
    },
    {
      title: t("Hành động"),
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
              title={t("Bạn có chắc chắn muốn xóa bộ câu hỏi này?")}
              onConfirm={() => onClickDelete(_id)}
              okText={t("Có")}
              cancelText={t("Không")}
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
        console.log("in data", res?.data);
        setExams(res?.data);
      })
      .catch((error) => {
        notification.error({
          message: t("Đã có lỗi xảy ra, vui lòng thử lại sau."),
        });
      })
      .then(() => setLoading(false));
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
        loadExams();
      })
      .catch((error) => {
        const { response } = error;
        if (response?.data?.code === CODE_ALREADY_EXIST) {
          notification.error({
            message: `${t("Chủ đề")} ${t("không tồn tại")}`,
          });
          return;
        }
        notification.error({
          message: t("Đã có lỗi xảy ra, vui lòng thử lại sau."),
        });
      })
      .then(() => setLoading(false));
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
            message: t("Tạo mới thành công."),
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
              message: `${t("Tên chủ đề")} ${t("đã tồn tại")}`,
            });
            return;
          }
          notification.error({
            message: t("Đã có lỗi xảy ra, vui lòng thử lại sau."),
          });
        })
        .then(() => setLoading(false));
    }
  };

  return (
    <div className="formQuestions">
      <div className="HeaderFormQuestion">
        <h3>{t("Danh sách các chủ đề")}</h3>
        <div className="showCreate" onClick={() => setShowForm(!showForm)}>
          {t("Tạo mới")}
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
            label={t("Tên chủ đề ")}
            name="name"
            rules={[
              {
                required: true,
                whitespace: true,
                message: t("Đây là thông tin bắt buộc."),
              },
            ]}
          >
            <Input placeholder={t("Nhập tên chủ đề...")} />
          </Form.Item>
          <Form.Item
            label={t("Số lượng câu hỏi xuất hiện")}
            name="questions_appear"
            rules={[
              {
                required: true,
                validator: (_, value) => {
                  if (!value) {
                    return Promise.reject(
                      new Error(t("Đây là thông tin bắt buộc."))
                    );
                  }
                  if (Number(value) <= 0) {
                    return Promise.reject(
                      new Error(t("Số lượng phải lớn hơn 0"))
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
              placeholder={t("Nhập số lượng")}
            />
          </Form.Item>
          <Form.Item
            label={t("Thời gian trả lời(giây)")}
            name="time_answer"
            rules={[
              {
                validator(_, value) {
                  if (Number(value) <= 0) {
                    return Promise.reject(
                      new Error(t("Số lượng phải lớn hơn 0"))
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
              placeholder={t("Nhập thời gian trả lời")}
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
                    {t("Tải lên danh sách câu hỏi")}
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
                <p style={{ color: "red" }}>{t("Đây là thông tin bắt buộc")}</p>
              )}
              <a href={"#"} onClick={handleDownload}>
                {t("Tải template câu hỏi tại đây")}
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
              {t("Tạo mới")}
            </Button>
          </Form.Item>
          <Divider />
        </Form>
      ) : (
        ""
      )}
      {!showForm && exams.length === 0 && (
        <div style={{ textAlign: "center", marginBottom: "10px" }}>
          {t("Khóa học này chưa có chủ đề trắc nghiệm nào")}
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
