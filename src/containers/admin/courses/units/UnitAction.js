import React, { useContext, useEffect, useState } from "react";
import Row from "antd/es/grid/row";
import {
  Button,
  Col,
  Form,
  Input,
  Space,
  Spin,
  notification,
  Table,
  Image,
  Popover,
  Popconfirm,
} from "antd";
import { useTranslation } from "react-i18next";
import { useHistory, useLocation, useParams } from "react-router-dom";
import "./Units.scss";
import AdminLayout from "../../../../layout/AdminLayout";
import { postAxios } from "../../../../Http";
import {
  API_LESSONS_LIST_BY_UNIT_ID,
  API_LESSON_DELETE,
} from "../../../../config/endpointApi";
import { UploadOutlined } from "@ant-design/icons";
import { bindParams } from "../../../../config/function";
import IconMoreInfo from "../../../../common/Icon/IconMoreInfo";
import moment from "moment";
import IconEdit from "../../../../common/Icon/IconEdit";
import { DeleteOutlined } from "@ant-design/icons";
import logoCourses from "../../../../assets/img/logoCourses.png";
import {
  ADMIN_CREATE_LESSON_PATH,
  ADMIN_EDIT_LESSON_PATH,
} from "../../../../config/path";
import { CODE_ALREADY_EXIST, CODE_NOT_FOUND } from "../../../../config/const";
import { useFileUpload } from "../../../../hook/useFileUpload";
import { useUnitAction } from "../../../../hook/useUnitAction";

const UnitAction = () => {
  const [form] = Form.useForm();
  const params = useParams();
  const history = useHistory();
  const location = useLocation();
  const { handleFileUpload } = useFileUpload();
  const { handleUnitAction } = useUnitAction();
  const { courseId, unitId } = params;
  const { t } = useTranslation("course");
  const [loading, setLoading] = useState(false);
  const { TextArea } = Input;
  const [image, setImage] = useState();
  const [preview, setPreview] = useState();
  const [lessons, setLessons] = useState([]);

  useEffect(() => {
    if (unitId && location?.state?.detail) {
      const detail = location.state.detail;
      form.setFieldsValue(detail);
      loadLessons();
    }
  }, [location, form]);

  useEffect(() => {
    if (image && typeof image === "string") {
      setPreview(image);
    }
  }, [image]);

  const action = (record) => {
    return (
      <div>
        <div
          className="d-flex align-items-center pointer"
          onClick={() =>
            history.push({
              pathname: `${bindParams(ADMIN_EDIT_LESSON_PATH, {
                courseId,
                unitId,
                lessonId: record?._id,
              })}`,
              state: { detail: record },
            })
          }
        >
          <IconEdit />
          <div className="pl-1">{t("common:edit")}</div>
        </div>
        <div className="d-flex align-items-center pointer">
          <Popconfirm
            title={t("confirm_delete_lecture")}
            onConfirm={() => onClickDelete(record._id)}
            okText={t("common:yes")}
            cancelText={t("common:no")}
            className="d-flex align-items-center pointer"
          >
            <DeleteOutlined style={{ fontSize: "22px" }} />
            <div className="pl-1">{t("delete_course")}</div>
          </Popconfirm>
        </div>
      </div>
    );
  };

  const columns = [
    {
      title: "#",
      dataIndex: "key",
      with: "5%",
      render: (value, data, index) => {
        return index + 1;
      },
    },
    {
      title: t("lesson_name"),
      dataIndex: "title",
      render: (title) => {
        return title;
      },
    },
    {
      title: `${t("lecture_name_teaching")}`,
      dataIndex: "titleTargetLanguage",
      render: (titleTargetLanguage) => {
        return titleTargetLanguage;
      },
    },
    {
      title: t("lesson_type"),
      dataIndex: "tagType",
      ellipsis: true,
      render: (tagType) => {
        return Number(tagType) === 1
          ? "vocabulary"
          : Number(tagType) === 2
          ? "grammar"
          : Number(tagType) === 3
          ? "Listen"
          : "read";
      },
    },
    {
      title: t("created_time"),
      dataIndex: "createdAt",
      render: (createdAt) => {
        return createdAt ? moment(createdAt).format("YYYY-MM-DD HH:mm:ss") : "";
      },
    },
    {
      title: "",
      dataIndex: "",
      width: "5%",
      align: "center",
      render: (record) => (
        <Popover
          placement="bottom"
          content={() => action(record)}
          title=""
          trigger="click"
        >
          <div className="moreIcon">
            <IconMoreInfo />
          </div>
        </Popover>
      ),
    },
  ];

  const loadLessons = () => {
    setLoading(true);
    postAxios(API_LESSONS_LIST_BY_UNIT_ID, { unitId })
      .then((res) => {
        const list = res?.data;
        setLessons(list);
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

  const onClickDelete = (id) => {
    setLoading(true);
    postAxios(API_LESSON_DELETE, { id })
      .then((res) => {
        loadLessons();
      })
      .catch((error) => {
        const { response } = error;
        if (response?.data?.code === CODE_NOT_FOUND) {
          notification.error({
            message: `${t("lesson_not_found")}`,
          });
          return;
        }
        notification.error({
          message: t("common:msg_please_try_again"),
        });
      })
      .finally(() => setLoading(false));
  };

  const uploadFile = async (e) => {
    const image_path = await handleFileUpload(e);
    setImage(image_path);
  };

  const onFinish = async (body) => {
    body.id = unitId;
    body.courseId = courseId;

    if (image && image.name) {
      body.image = image;
    }
    await handleUnitAction(unitId, body, t, setLoading);
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
                label={t("lecture_name")}
                name="name"
                rules={[
                  {
                    required: true,
                    whitespace: true,
                    message: t("validate_required"),
                  },
                ]}
              >
                <Input placeholder={t("lecture_name_placeholder")} />
              </Form.Item>
              <Form.Item label={t("description")} name="description">
                <TextArea rows={4} />
              </Form.Item>
            </Col>
            <Col span={24} style={{ display: "flex", justifyContent: "start" }}>
              <div className="imgWrapper" style={{ alignItems: "center" }}>
                <Image
                  className="imgCourseEdit"
                  style={{
                    padding: 0,
                  }}
                  src={
                    location?.state?.detail?.image
                      ? location?.state?.detail?.image
                      : preview
                  }
                />
                <Button style={{ marginTop: "15px" }}>
                  <label htmlFor="upload-photo-course" className="label-upload">
                    <UploadOutlined size={24} style={{ marginRight: "3px" }} />
                    {t("upload_image")}
                  </label>
                </Button>
              </div>
              <input
                type="file"
                name="image"
                id="upload-photo-course"
                onChange={uploadFile}
                style={{ display: "none" }}
                accept="image/*"
              />
            </Col>
          </Row>
          {unitId && (
            <Row>
              <Col span={24}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "10px",
                  }}
                >
                  <h4 style={{ marginTop: "20px" }}>{`${t(
                    t("lesson_list")
                  )}:`}</h4>
                  <Button
                    size={"large"}
                    className={"btn btn-common"}
                    onClick={() =>
                      history.push(
                        bindParams(ADMIN_CREATE_LESSON_PATH, {
                          courseId,
                          unitId,
                        })
                      )
                    }
                  >
                    {t("create_lesson")}
                  </Button>
                </div>
                <Table
                  className="custom-table"
                  columns={columns}
                  dataSource={lessons}
                  rowKey="id"
                  loading={loading}
                />
              </Col>
            </Row>
          )}
          <Row>
            <Col span={24} className={"area-button"}>
              <Space>
                <Button
                  size={"large"}
                  className={"btn btnBack"}
                  id="btn-solid"
                  onClick={() => history.goBack()}
                >
                  {t("back")}
                </Button>
                <Button
                  loading={loading}
                  htmlType={"submit"}
                  className={"btn btn-common"}
                  size={"large"}
                  block
                >
                  {!unitId ? t("common:create") : t("common:edit")}
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
        t("created_courses"),
        `${courseId}`,
        t("lecture"),
        !unitId ? t("common:create") : `${unitId}`,
        unitId && t("common:edit"),
      ]}
    >
      {renderForm()}
    </AdminLayout>
  );
};

export default UnitAction;
