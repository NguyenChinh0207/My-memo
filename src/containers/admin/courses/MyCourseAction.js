import React, { useEffect, useState } from "react";
import Row from "antd/es/grid/row";
import {
  Button,
  Col,
  Form,
  Input,
  Space,
  Popconfirm,
  Checkbox,
  Select,
  Spin,
} from "antd";
import { useTranslation } from "react-i18next";
import { useHistory, useLocation, useParams } from "react-router-dom";
import "./CourseList";
import AdminLayout from "../../../layout/AdminLayout";
import { optionLanguages, optionVoices } from "../../../config/function";

const MyCourseAction = () => {
  const [form] = Form.useForm();
  const params = useParams();
  const history = useHistory();
  const location = useLocation();
  const { courseId } = params;
  const { t } = useTranslation("cmmon");
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState(false);
  const { TextArea } = Input;

  useEffect(() => {
    if (courseId && location.state.detail) {
      const detail = location.state.detail;
      form.setFieldsValue(detail);
    }
  }, [location, form]);

  const onFinish = (data) => {
    data.id = courseId;
    setLoading(true);
    // postAxios(!id ? API_BRAND_CREATE : API_BRAND_EDIT, data)
    //   .then((res) => {
    //     notification.success({
    //       message: id ? t("message_update") : t("message_create"),
    //     });
    //     queryClient.invalidateQueries("brandList");
    //     history.push(BRAND_PATH);
    //   })
    //   .catch((error) => {
    //     const { response } = error;
    //     if (error.message === NETWORK_ERROR) {
    //       notification.error({
    //         message: t("common:network_error"),
    //       });
    //       return;
    //     }
    //     notification.error({
    //       message: ` (${
    //         error.response?.data?.message || t("common:error_server")
    //       })`,
    //     });
    //     if (response?.data?.validation) {
    //       const validation = response?.data?.validation;
    //       const fields = [];
    //       for (let name in validation) {
    //         fields.push({
    //           name,
    //           errors: validation[name],
    //         });
    //       }
    //       form.setFields(fields);
    //     }
    //   })
    //   .then(() => setLoading(false));
  };

  const renderForm = () => {
    if (loading) {
      return (
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <Spin size={"large"} />
        </div>
      );
    }

    return (
      <div className="site-layout-background">
        <Form
          className={"w-100 form-admin-course"}
          layout={"vertical"}
          form={form}
          onFinish={onFinish}
        >
          <Row gutter={[20, 20]}>
            <Col span={24}>
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
              <Form.Item label={t("Thanh âm")} name="voice">
                <Select
                  showSearch
                  placeholder={t("Chọn thanh âm")}
                  filterOption={(input, option) =>
                    (option?.label ?? "")
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  options={optionVoices}
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
                name="active"
                className="activeCheck"
                wrapperCol={{
                  xs: { span: 24, offset: 0 },
                  sm: { span: 18, offset: 6 },
                }}
              >
                <Checkbox
                  defaultChecked={false}
                  checked={value}
                  onChange={() => setValue(!value)}
                >
                  {t("Công khai")}
                </Checkbox>
              </Form.Item>
            </Col>
            <Col span={24} className={"area-button"}>
              <Space>
                <Button
                  size={"large"}
                  className={"btn btnBack"}
                  id="btn-solid"
                  onClick={() => history.goBack()}
                >
                  {t("Quay lại")}
                </Button>
                <Button
                  loading={loading}
                  htmlType={"submit"}
                  className={"btn btn-common"}
                  size={"large"}
                  block
                >
                  {!courseId ? t("Tạo mới") : t("Chỉnh sửa")}
                </Button>
              </Space>
            </Col>
          </Row>
        </Form>
      </div>
    );
  };

  return (
    <AdminLayout
      breadcrumbs={[
        t("Danh sách Khóa học của tôi"),
        !courseId ? t("Tạo mới") : t("Chỉnh sửa"),
      ]}
    >
      {renderForm()}
    </AdminLayout>
  );
};

export default MyCourseAction;
