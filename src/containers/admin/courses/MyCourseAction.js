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
  Popover,
  Image,
} from "antd";
import { useTranslation } from "react-i18next";
import { useHistory, useLocation, useParams } from "react-router-dom";
import "./CourseList";
import AdminLayout from "../../../layout/AdminLayout";
import {
  bindParams,
  optionLanguages,
  optionVoices,
} from "../../../config/function";
import { postAxios } from "../../../Http";
import {
  API_UNIT_DELETE,
  API_UNIT_LIST_BY_COURSE,
} from "../../../config/endpointApi";
import {
  ADMIN_CREATE_UNIT_PATH,
  ADMIN_EDIT_UNIT_PATH
} from "../../../config/path";
import { AppContext } from "../../../context/AppContext";
import IconMoreInfo from "../../../common/Icon/IconMoreInfo";
import moment from "moment";
import IconEdit from "../../../common/Icon/IconEdit";
import logoCourses from "../../../assets/img/logoCourses.png";
import { CODE_NOT_FOUND } from "../../../config/const";
import { UploadOutlined, DeleteOutlined } from "@ant-design/icons";
import { useFileUpload } from "../../../hook/useFileUpload";
import { useCourseAction } from "../../../hook/useCourseAction";

const CourseAction = () => {
  const [form] = Form.useForm();
  const params = useParams();
  const history = useHistory();
  const location = useLocation();
  const { courseId } = params;
  const { t } = useTranslation("course");
  const { handleFileUpload } = useFileUpload();
  const { handleAdminCourseAction } = useCourseAction();
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState(false);
  const { TextArea } = Input;
  const { user_info } = useContext(AppContext);
  const [units, setUnits] = useState([]);
  const [image, setImage] = useState("");
  const [preview, setPreview] = useState();

  const action = (record) => {
    return (
      <div>
        <div
          className="d-flex align-items-center pointer"
          onClick={() =>
            history.push({
              pathname: `${bindParams(ADMIN_EDIT_UNIT_PATH, {
                courseId: courseId,
                unitId: record?._id,
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
            <div className="pl-1">{t("delete_lecture")}</div>
          </Popconfirm>
        </div>
      </div>
    );
  };

  const columns = [
    {
      title: "#",
      dataIndex: "key",
      with: "10%",
      render: (value, data, index) => {
        return index + 1;
      },
    },
    {
      title: t("lecture_name"),
      dataIndex: "name",
      render: (name) => {
        return name;
      },
    },
    {
      title: t("image"),
      dataIndex: "image",
      render: (image) => {
        return <Image src={image} style={{ width: "60px", height: "60px" }} />;
      },
    },
    {
      title: t("description"),
      dataIndex: "description",
      ellipsis: true,
      render: (description) => {
        return description;
      },
    },
    {
      title: t("created_time"),
      dataIndex: "createdAt",
      render: (createdAt) => {
        return createdAt ? moment(createdAt).format("YYYY-MM-DD") : "";
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

  useEffect(() => {
    if (courseId && location?.state?.detail) {
      const detail = location.state.detail;
      form.setFieldsValue(detail);
      detail.active === 1 ? setValue(true) : setValue(false);
      loadUnits();
    }
    return () => {
      setValue(false);
    };
  }, [location, form]);

  useEffect(() => {
    if (image && typeof image === "string") {
      setPreview(image);
    }
  }, [image]);

  const loadUnits = () => {
    setLoading(true);
    postAxios(API_UNIT_LIST_BY_COURSE, { courseId })
      .then((res) => {
        const list = res?.data;
        setUnits(list);
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
    postAxios(API_UNIT_DELETE, { id })
      .then((res) => {
        loadUnits();
      })
      .catch((error) => {
        const { response } = error;
        if (response?.data?.code === CODE_NOT_FOUND) {
          notification.error({
            message: `${t("lecture_not_found")}`,
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
    body.id = courseId;
    body.owner = user_info?._id;
    if (value) {
      body.active = 1;
    } else {
      body.active = 0;
    }

    if (image && image.name) {
      body.image = image;
    }

    await handleAdminCourseAction(courseId, body, t, setLoading);
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
            <Col span={courseId ? 16 : 24}>
              <Form.Item
                label={t("course_name")}
                name="name"
                rules={[
                  {
                    required: true,
                    whitespace: true,
                    message: t("validate_required"),
                  },
                ]}
                extra={t("give_course_name")}
              >
                <Input placeholder={t("course_name_placeholder")} />
              </Form.Item>
              <Form.Item
                label={t("teacher_lang")}
                name="language"
                rules={[
                  {
                    required: true,
                    message: t("validate_required"),
                  },
                ]}
              >
                <Select
                  showSearch
                  placeholder={t("select_lang")}
                  filterOption={(input, option) =>
                    (option?.label ?? "")
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  options={optionLanguages}
                />
              </Form.Item>
              <Form.Item
                label={t("learner_lang")}
                name="my_language"
                rules={[
                  {
                    required: true,
                    message: t("validate_required"),
                  },
                ]}
              >
                <Select
                  showSearch
                  placeholder={t("select_lang")}
                  filterOption={(input, option) =>
                    (option?.label ?? "")
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  options={optionLanguages}
                />
              </Form.Item>
              <Form.Item label={t("voice_lang")} name="voice">
                <Select
                  showSearch
                  placeholder={t("select_voice")}
                  filterOption={(input, option) =>
                    (option?.label ?? "")
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  options={optionVoices}
                />
              </Form.Item>
            </Col>
            {courseId && (
              <Col
                span={8}
                style={{ display: "flex", justifyContent: "center" }}
              >
                <div className="imgWrapper">
                  <Image
                    className="imgCourseEdit"
                    src={
                      location?.state?.detail?.image
                        ? location?.state?.detail?.image
                        : preview
                    }
                  />
                  <Button style={{ marginTop: "15px" }}>
                    <label
                      htmlFor="upload-photo-course"
                      className="label-upload"
                    >
                      <UploadOutlined
                        size={24}
                        style={{ marginRight: "3px" }}
                      />
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
            )}
            <Col span={24}>
              <Form.Item
                label={t("description")}
                name="description"
                rules={[
                  {
                    required: true,
                    whitespace: true,
                    message: t("validate_required"),
                  },
                ]}
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
                  {t("active")}
                </Checkbox>
              </Form.Item>
              {courseId && (
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
                      <h4 style={{ marginTop: "10px" }}>{`${t(
                        t("lecture_list")
                      )}:`}</h4>
                      <Button
                        size={"large"}
                        className={"btn btn-common"}
                        onClick={() =>
                          history.push(
                            bindParams(ADMIN_CREATE_UNIT_PATH, {
                              courseId: courseId,
                            })
                          )
                        }
                      >
                        {t("create_lecture")}
                      </Button>
                    </div>
                    <Table
                      className="custom-table"
                      columns={columns}
                      dataSource={units}
                      rowKey={(record) => record._id}
                      loading={loading}
                    />
                  </Col>
                </Row>
              )}
            </Col>
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
                  {!courseId ? t("common:create") : t("common:edit")}
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
        !courseId ? t("common:create") : `${courseId}`,
        courseId && t("common:edit"),
      ]}
    >
      {renderForm()}
    </AdminLayout>
  );
};

export default CourseAction;
