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
  API_COURSE_CREATE,
  API_COURSE_EDIT,
  API_UNIT_DELETE,
  API_UNIT_LIST_BY_COURSE,
} from "../../../config/endpointApi";
import {
  ADMIN_COURSE_LIST_PATH,
  ADMIN_CREATE_UNIT_PATH,
  ADMIN_EDIT_UNIT_PATH,
  ADMIN_MY_COURSE_LIST_PATH,
} from "../../../config/path";
import { AppContext } from "../../../context/AppContext";
import IconMoreInfo from "../../../common/Icon/IconMoreInfo";
import moment from "moment";
import IconEdit from "../../../common/Icon/IconEdit";
import { CODE_ALREADY_EXIST } from "../../../config/const";

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
  const { user_info } = useContext(AppContext);
  const [units, setUnits] = useState([])

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
          <div className="pl-1">{t("Chỉnh sửa")}</div>
        </div>
        <div
          className="d-flex align-items-center pointer"
        >
          <Popconfirm
            title={t("Bạn có chắc chắn muốn xóa bài học này?")}
            onConfirm={() => onClickDelete(record._id)}
            okText={t("Có")}
            cancelText={t("Không")}
          >
            <div className="RemoveBtn" />
          </Popconfirm>
        </div>
      </div>
    );
  }

    const columns = [
      {
        title: "#",
        dataIndex: "key",
        render: (value, data, index) => {
          return index + 1;
        },
      },
      {
        title: t("Tên bài học"),
        dataIndex: "name",
        render: (name) => {
          return name;
        },
      },
      {
        title: t("Mô tả"),
        dataIndex: "description",
        ellipsis: true,
        render: (description) => {
          return description;
        },
      },
      {
        title: t("Số bài giảng"),
        dataIndex: "",
        render: (_, record) => {
          return record?.lessons.length + record?.skills.length || 0;
        },
      },
      {
        title: t("Thời gian tạo"),
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
    if (courseId && location.state.detail) {
      const detail = location.state.detail;
      form.setFieldsValue(detail);
      detail.active === 1 ? setValue(true) : setValue(false);
      loadUnits();
    }
    return () => {
      setValue(false);
    };
  }, [location, form]);

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
            ? `${t("Đã có lỗi xảy ra")}: ${response?.data?.message}`
            : t("Đã có lỗi xảy ra, vui lòng thử lại sau."),
        });
      })
      .then(() => setLoading(false));
  };

  const onClickDelete = (id) => {
    setLoading(true);
    postAxios(API_UNIT_DELETE, { id })
      .then((res) => {
        loadUnits();
      })
      .catch((error) => {
        const { response } = error;
        if (response?.data?.code === CODE_ALREADY_EXIST) {
          notification.error({
            message: `${t("Bài học")} ${t("không tồn tại")}`,
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
    data.id = courseId;
    setLoading(true);
    data.owner = user_info?._id;
    if (value) {
      data.active = 1;
    } else {
      data.active = 0;
    }
    postAxios(!courseId ? API_COURSE_CREATE : API_COURSE_EDIT, data)
      .then((res) => {
        notification.success({
          message: !courseId
            ? t("Tạo mới khóa học thành công.")
            : t("Chỉnh sửa khóa học thành công."),
        });
        history.push(ADMIN_MY_COURSE_LIST_PATH);
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
                        t("Danh sách các bài học")
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
                        {t("Tạo bài học")}
                      </Button>
                    </div>
                    <Table
                      className="custom-table"
                      columns={columns}
                      dataSource={units}
                      rowKey="id"
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
        t("Danh sách khóa học đã tạo"),
        !courseId ? t("Tạo mới") : t("Chỉnh sửa"),
      ]}
    >
      {renderForm()}
    </AdminLayout>
  );
};

export default MyCourseAction;
