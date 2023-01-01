import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { NavLink, useHistory } from "react-router-dom";
import "./Courses.scss";
import PrivateLayout from "../../layout/PrivateLayout";
import {
  COURSES_PATH,
  COURSE_CREATE,
  COURSE_CREATE_PATH,
} from "../../config/path";
import Layout from "antd/lib/layout/layout";
import { postAxios } from "../../Http";
import { API_COURSE_CREATE, API_COURSE_LIST } from "../../config/endpointApi";
import { Button, Form, Input, notification, Select, Spin } from "antd";
import { LANGUAGES } from "../../config/const";

const CreateCourse = () => {
  const { t } = useTranslation("common");
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const languages = LANGUAGES;
  const { TextArea } = Input;

  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 6 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 18 },
    },
  };

  const optionLanguages = languages.map((item) => ({
    value: item,
    label: item,
  }));

  const onFinish = async (data) => {
    setLoading(true);
    postAxios(API_COURSE_CREATE, data)
      .then((res) => {
        notification.success({
          message: t("Tạo mới khóa học thành công."),
        });
        history.push(COURSES_PATH);
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
      <Layout style={{ minWidth: "100vh" }}>
        <div className="PageHead">
          <div className="PageHeadRow">
            <div className="Title">{t("Tạo khóa học")}</div>
          </div>
        </div>
        <Form
          className="wrapCourseCreate"
          name="basic"
          onFinish={onFinish}
          {...formItemLayout}
        >
          <Form.Item
            label={t("Tên khóa học")}
            name="name"
            rules={[
              {
                required: true,
                whitespace: true,
                message: t("Đây là thông tin bắt buộc."),
              },
            ]}
            extra={t(
              "Đặt tên phù hợp cho khóa học sẽ giúp các học viên khác tìm kiếm dễ dàng hơn."
            )}
          >
            <Input placeholder={t("Nhập tên khóa học...")} />
          </Form.Item>
          <Form.Item
            label={t("Dạy")}
            name="language"
            rules={[
              {
                required: true,
                message: t("Đây là thông tin bắt buộc."),
              },
            ]}
          >
            <Select
              showSearch
              placeholder={t("Chọn ngôn ngữ")}
              filterOption={(input, option) =>
                (option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              options={optionLanguages}
            />
          </Form.Item>
          <Form.Item
            label={t("Cho người nói")}
            name="my_language"
            rules={[
              {
                required: true,
                message: t("Đây là thông tin bắt buộc."),
              },
            ]}
          >
            <Select
              showSearch
              placeholder={t("Chọn ngôn ngữ")}
              filterOption={(input, option) =>
                (option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              options={optionLanguages}
            />
          </Form.Item>
          <Form.Item
            label={t("Mô tả")}
            name="description"
            rules={[
              {
                required: true,
                whitespace: true,
                message: t("Đây là thông tin bắt buộc."),
              },
            ]}
            extra={t("Mô tả khóa học bằng ngôn ngữ của người học.")}
          >
            <TextArea rows={4} />
          </Form.Item>
          <Form.Item
            wrapperCol={{
              xs: { span: 24, offset: 0 },
              sm: { span: 18, offset: 6 },
            }}
          >
            <Button
              type="primary"
              htmlType="submit"
              className="createCourse"
              loading={loading}
            >
              {t("Tạo khóa học")}
            </Button>
          </Form.Item>
        </Form>
      </Layout>
    </PrivateLayout>
  );
};

export default CreateCourse;
