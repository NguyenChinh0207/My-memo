import React, { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { NavLink, useHistory } from "react-router-dom";
import Layout from "antd/lib/layout/layout";
import {
  Button,
  Form,
  Image,
  Input,
  Popconfirm,
  notification,
  Popover,
  Space,
  Spin,
  Table,
  Checkbox,
} from "antd";
import AdminLayout from "../../../layout/AdminLayout";
import "./CourseList.scss";
import { SearchOutlined } from "@ant-design/icons";
import { postAxios } from "../../../Http";
import {
  API_COURSE_DELETE,
  API_COURSE_OWNER_LIST,
} from "../../../config/endpointApi";
import { bindParams } from "../../../config/function";
import {
  ADMIN_MY_COURSE_DETAIL_PATH,
  ADMIN_MY_COURSE_CREATE_PATH,
  ADMIN_MY_COURSE_EDIT_PATH,
} from "../../../config/path";
import IconMoreInfo from "../../../common/Icon/IconMoreInfo";
import IconEdit from "../../../common/Icon/IconEdit";
import IconDelete from "../../../common/Icon/IconDelete";
import { CODE_NOT_FOUND, LIMIT } from "../../../config/const";
import { AppContext } from "../../../context/AppContext";

const CourseList = () => {
  const { t } = useTranslation("course");
  const history = useHistory();
  const { user_info } = useContext(AppContext);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [keyword, setKeyword] = useState("");
  const [status, setStatus] = useState();
  const [currentPage, setCurrentPage] = useState(1);

  const ACTIVE_COURSE_OPTIONS = [
    {
      label: t("active"), 
      value: 1,
    },
    {
      label: t("deactive"),
      value: 0,
    },
  ];

  const onCell = (record) => {
    return {
      onClick: () =>
        history.push({
          pathname: `${bindParams(ADMIN_MY_COURSE_DETAIL_PATH, {
            courseId: record._id,
          })}`,
          state: { detail: record },
        }),
    };
  };

  const action = (record) => {
    return (
      <div>
        <div
          className="d-flex align-items-center pointer"
          onClick={() =>
            history.push({
              pathname: `${bindParams(ADMIN_MY_COURSE_EDIT_PATH, {
                courseId: record._id,
              })}`,
              state: { detail: record },
            })
          }
        >
          <IconEdit />
          <div className="pl-1">{t("common:edit")}</div>
        </div>
        <Popconfirm
          className="d-flex align-items-center pointer"
          title={t("confirm_delete_course")}
          onConfirm={() => handleDelete(record._id, record.owner._id)}
          okText={t("common:yes")}
          cancelText={t("common:no")}
        >
          <IconDelete />
          <div className="pl-1">{t("common:delete")}</div>
        </Popconfirm>
      </div>
    );
  };

  const columns = [
    {
      title: "#",
      dataIndex: "key",
      render: (value, data, index) => {
        return (currentPage - 1) * LIMIT + index + 1;
      },
      onCell,
    },
    {
      title: t("image"),
      dataIndex: "image",
      render: (image) => {
        return <Image src={image} style={{ width: "60px", height: "60px" }} />;
      },
      onCell,
    },
    {
      title: t("course_name"),
      dataIndex: "name",
      render: (name) => {
        return name;
      },
      onCell,
    },
    {
      title: t("teacher_lang"),
      dataIndex: "language",
      render: (language) => {
        return language;
      },
      onCell,
    },
    {
      title: t("learner_lang"),
      dataIndex: "my_language",
      render: (my_language) => {
        return my_language;
      },
      onCell,
    },
    {
      title: t("status"),
      dataIndex: "active",
      render: (active) => {
        return active === 1 ? t("active") : t("deactive");
      },
      onCell,
    },
    {
      title: t("creator"),
      dataIndex: "owner",
      render: (owner) => {
        return owner.username;
      },
      onCell,
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
    loadAllCourses();
  }, [keyword, status]);

  const loadAllCourses = () => {
    setLoading(true);

    const params = {
      userId: user_info._id,
      keyword,
      status: status !== null ? status : undefined,
    };

    postAxios(API_COURSE_OWNER_LIST, params)
      .then((res) => {
        setTotal(res?.total);
        setData(res?.data);
      })
      .catch((error) => {
        const { response } = error;
        notification.error({
          message: response?.data?.message
            ? `${t("common:server_error")}: ${response?.data?.message}`
            : t("common:msg_please_try_again"),
        });
      })
      .finally(() => setLoading(false)); // Sử dụng `finally` để đảm bảo setLoading(false) luôn được gọi
  };

  const onSearch = (data) => {
    setData([]);
    setKeyword(data.keyword);
  };

  const onChangeCheckbox = (checkedValues) => {
    setStatus(checkedValues);
  };

  const handleDelete = (course_id, user_id) => {
    setLoading(true);
    postAxios(API_COURSE_DELETE, { courseId: course_id, userId: user_id })
      .then((res) => {
        notification.success({
          message: t("delete_course_success"),
        });
        loadAllCourses();
      })
      .catch((error) => {
        const { response } = error;
        if (response?.data?.code === CODE_NOT_FOUND) {
          notification.error({
            message: `${t("course_not_found")}`,
          });
          return;
        }
        notification.error({
          message: t("common:msg_please_try_again"),
        });
      })
      .then(() => setLoading(false));
  };

  return (
    <AdminLayout breadcrumbs={[t("created_courses")]}>
      {loading ? (
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
      ) : (
        <Layout className="banner-wrapper banner-form">
          <div className="create-center">
            <NavLink to={ADMIN_MY_COURSE_CREATE_PATH}>
              <Button className="btn btn-common" size="large">
                {t("create_course")}
              </Button>
            </NavLink>
          </div>
          <Space size={"large"} direction={"vertical"}>
            <div className="site-layout-background">
              <div className="banner--title">
                <div className="banner-header">
                  <div style={{ fontWeight: "bold" }}>{[t("created_courses")]}</div>
                  <div className="search-wrap">
                    <Form
                      className="tabbar-form"
                      onFinish={onSearch}
                      initialValues={{ keyword: keyword, status: status }}
                    >
                      <Form.Item
                        name={"status"}
                        className="d-flex align-items-center"
                      >
                        <Checkbox.Group
                          options={ACTIVE_COURSE_OPTIONS}
                          onChange={onChangeCheckbox}
                        />
                      </Form.Item>
                      <Form.Item
                        name={"keyword"}
                        className="input-search-discount"
                      >
                        <Input
                          allowClear
                          placeholder={t("keyword_placeholder")}
                          size={"large"}
                          style={{
                            borderTopLeftRadius: "8px",
                            borderBottomLeftRadius: "8px",
                          }}
                        />
                      </Form.Item>
                      <Button
                        size={"large"}
                        loading={loading}
                        icon={<SearchOutlined />}
                        className="button-search"
                        style={{
                          borderLeft: "none",
                          borderTopRightRadius: "8px",
                          borderBottomRightRadius: "8px",
                        }}
                        htmlType="submit"
                      />
                    </Form>
                  </div>
                </div>
              </div>

              <Table
                className="custom-table"
                columns={columns}
                dataSource={data}
                rowKey={(record) => record._id}
                loading={loading}
                pagination={{
                  total: total,
                  pageSize: LIMIT,
                  current: currentPage, // Trang hiện tại
                  onChange: (page) => {
                    setCurrentPage(page); // Cập nhật trang khi người dùng thay đổi trang
                  },
                }}
              />
            </div>
          </Space>
        </Layout>
      )}
    </AdminLayout>
  );
};

export default React.memo(CourseList);
