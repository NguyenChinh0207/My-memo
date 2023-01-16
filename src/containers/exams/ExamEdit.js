import React, { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { NavLink, useHistory } from "react-router-dom";
import "./Exam.scss";
import PrivateLayout from "../../layout/PrivateLayout";
import {
  COURSES_PATH,
  COURSE_CREATE,
  COURSE_CREATE_PATH,
  COURSE_EDIT_PATH,
} from "../../config/path";
import Layout from "antd/lib/layout/layout";
import { postAxios } from "../../Http";
import { API_COURSE_CREATE, API_COURSE_LIST } from "../../config/endpointApi";
import {
  Button,
  Checkbox,
  Divider,
  Form,
  Input,
  notification,
  Select,
  Spin,
  Table,
  Tooltip,
} from "antd";
import { LANGUAGES } from "../../config/const";
import { AppContext } from "../../context/AppContext";
import { bindParams } from "../../config/function";

const ExamEdit = (props) => {
  const { t } = useTranslation("common");
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const { user_info } = useContext(AppContext);
  const languages = LANGUAGES;
  const { TextArea } = Input;
  const [value, setValue] = useState(false);
  const [form] = Form.useForm();

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
      title: t("Câu hỏi"),
      width: "20%",
      align: "left",
      ellipsis: "true",
      ellipsis: true,
      dataIndex: "name",
      render: (name) => {
        return (
          <Tooltip color={"#c5c4c4"}  title={name} placement="topLeft">
            {name}
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
      title: t("Câu trả lời 5"),
      dataIndex: "answer",
      width: "13%",
      ellipsis: true,
      align: "left",
      render: (answer) => {
        return (
          <Tooltip color={"#c5c4c4"} title={answer[4]} placement="topLeft">
            {answer[4]}
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

  const data = [
    {
      _id: 1,
      name: "1+1=?",
      answer: [0, 1, 2, 3, 4],
      correct: 2,
    },
  ];

  const onFinish = async (data) => {};

  return (
    <PrivateLayout>
      <Layout style={{ minWidth: "100vh" }} className="Exam">
        <div className="PageHead">
          <div className="PageHeadRow">
            <div className="Title">{t("Chỉnh sửa chủ đề")}</div>
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
            label={t("Tên chủ đề")}
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
                message: t("Đây là thông tin bắt buộc."),
              },
            ]}
          >
            <Input type="number" placeholder={t("Nhập số lượng")} />
          </Form.Item>
          <Form.Item label={t("Thời gian trả lời(giây)")} name="time_answer">
            <Input type="number" placeholder={t("Nhập thời gian trả lời")} />
          </Form.Item>
          <Form.Item
            wrapperCol={{
              xs: { span: 24, offset: 0 },
              sm: { span: 16, offset: 8 },
            }}
          >
            <div className="ImportWrapper">
              <Button type="default" className="ImportBtn">
                {t("Tải lên danh sách câu hỏi")}
              </Button>
              <a href={"#"}>{t("Tải template câu hỏi tại đây")}</a>
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
              {t("Chỉnh sửa")}
            </Button>
          </Form.Item>
          <Divider />
          <p>{t("Danh sách câu hỏi")}</p>
          <Table columns={columns} dataSource={data} />
        </Form>
      </Layout>
    </PrivateLayout>
  );
};

export default ExamEdit;
