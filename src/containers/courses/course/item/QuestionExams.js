import React, { useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
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
  Popover,
  Select,
  Table,
} from "antd";
import { LANGUAGES } from "../../../../config/const";
import { AppContext } from "../../../../context/AppContext";
import { useHistory } from "react-router-dom";
import logoCourses from "../../../../assets/img/logoCourses.png";
import {
  CaretDownOutlined,
  EyeOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { API_COURSE_EDIT } from "../../../../config/endpointApi";
import { COURSE_DETAIL_PATH, EXAM_EDIT_PATH } from "../../../../config/path";
import { postAxios } from "../../../../Http";
import { bindParams } from "../../../../config/function";
import IconDelete from "../../../../common/Icon/IconDelete";
import IconEye from "../../../../common/Icon/IconEye";
import IconEdit from "../../../../common/Icon/IconEdit";

const QuestionExams = (props) => {
  const { t } = useTranslation("common");
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const { user_info } = useContext(AppContext);
  const course = props.course;
  const [showForm, setShowForm] = useState(false);
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
      title: t("Tên chủ đề"),
      width: "25%",
      align: "left",
      ellipsis: "true",
      dataIndex: "name",
    },
    {
      title: t("Thời gian trả lời"),
      dataIndex: "time_answer",
      width: "20%",
      align: "left",
      render: (time_answer) => {
        return `${time_answer} ${t("giây")}`;
      },
    },
    {
      title: t("Số câu hỏi xuất hiện"),
      dataIndex: "questions_appear",
      width: "20%",
      align: "left",
      render: (questions_appear) => {
        return `${questions_appear}`;
      },
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
            <div style={{display:"flex", alignItems:"center"}}
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
              <div className="RemoveBtn" onClick={() => onClickDelete(_id)} />
            </Popconfirm>
          </div>
        );
      },
    },
  ];

  const data = [
    {
      _id: 1,
      name: "test",
      time_answer: 60,
      questions_appear: 12,
    },
  ];

  useEffect(() => {
    setShowForm(false);
  }, []);

  const onClickDelete = (id) => {};

  const onFinish = (data) => {};

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
                message: t("Đây là thông tin bắt buộc."),
              },
            ]}
          >
            <Input type="number" placeholder={t("Nhập số lượng...")} />
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
              {t("Tạo mới")}
            </Button>
          </Form.Item>
          <Divider />
        </Form>
      ) : (
        ""
      )}
      {!showForm && data.length === 0 && (
        <div style={{ textAlign: "center" }}>
          {t("Khóa học này chưa có bộ câu hỏi nào")}
        </div>
      )}
      <Table
        columns={columns}
        dataSource={data}
        loading={loading}
        pagination={false}
      />
    </div>
  );
};

export default React.memo(QuestionExams);
