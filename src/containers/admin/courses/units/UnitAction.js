import React, { useContext, useEffect, useState } from "react";
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
  notification,
  Table,
} from "antd";
import { useTranslation } from "react-i18next";
import { useHistory, useLocation, useParams } from "react-router-dom";
import "./Units.scss";
import AdminLayout from "../../../../layout/AdminLayout";
import {
  bindParams,
  optionLanguages,
  optionVoices,
} from "../../../../config/function";
import { postAxios } from "../../../../Http";
import {
  API_COURSE_CREATE,
  API_COURSE_EDIT,
  API_UNIT_CREATE,
  API_UNIT_EDIT,
} from "../../../../config/endpointApi";
import {
  ADMIN_COURSE_LIST_PATH,
  ADMIN_MY_COURSE_LIST_PATH,
} from "../../../../config/path";
import { AppContext } from "../../../../context/AppContext";
import TabsUnit from "../items/TabsUnit";
import { RenderLessons } from "./RenderLessons";
import { RenderSkills } from "./RenderSkills";

const UnitAction = () => {
  const [form] = Form.useForm();
  const params = useParams();
  const history = useHistory();
  const location = useLocation();
  const { courseId, unitId } = params;
  const { t } = useTranslation("cmmon");
  const [loading, setLoading] = useState(false);
  const { TextArea } = Input;
  const { user_info } = useContext(AppContext);
  const [tab, setTab] = useState("0");

  useEffect(() => {
    if (unitId && location.state.detail) {
      const detail = location.state.detail;
      form.setFieldsValue(detail);
    }
  }, [location, form]);

  const onFinish = (data) => {
    data.id = unitId;
    setLoading(true);
    data.courseId = courseId;
    postAxios(!unitId ? API_UNIT_CREATE : API_UNIT_EDIT, data)
      .then((res) => {
        notification.success({
          message: !unitId
            ? t("Tạo mới bài học thành công.")
            : t("Chỉnh sửa bài học thành công."),
        });
        history.goBack();
      })
      .catch((error) => {
        const { response } = error;
        notification.error({
          message: response?.data?.message
            ? `${t("Đã có lỗi xảy ra")}: ${response?.data?.message}`
            : t("Đã có lỗi xảy ra, vui lòng thử lại sau."),
        });
      })
      .then(() => setLoading(false));
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
                label={t("Tên bài học")}
                name="name"
                rules={[
                  {
                    required: true,
                    whitespace: true,
                    message: t("Đây là thông tin bắt buộc."),
                  },
                ]}
              >
                <Input placeholder={t("Nhập tên bài học...")} />
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
              >
                <TextArea rows={4} />
              </Form.Item>
            </Col>
          </Row>
          <TabsUnit goBack={() => history.goBack()} setTab={setTab} />
          {tab === "0" && <RenderLessons />}
          {tab === "1" && <RenderSkills />}
          <Row>
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
                  {!unitId ? t("Tạo mới") : t("Chỉnh sửa")}
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
        t("Danh sách khóa học đã tạo"),
        t("Chỉnh sửa khóa học"),
        !unitId ? t("Tạo mới bài học") : t("Chỉnh sửa bài học"),
      ]}
    >
      {renderForm()}
    </AdminLayout>
  );
};

export default UnitAction;
