import React, { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { NavLink, useHistory } from "react-router-dom";
import Layout from "antd/lib/layout/layout";
import {
  Button,
  Col,
  Form,
  Input,
  Modal,
  notification,
  Popover,
  Row,
  Space,
  Spin,
  Table,
} from "antd";
import AdminLayout from "../../../layout/AdminLayout";
import "./CourseList.scss";
import { SearchOutlined } from "@ant-design/icons";
import { postAxios } from "../../../Http";
import {
  API_COURSES_LIST_ALL,
  API_COURSE_LIST,
  API_COURSE_OWNER_LIST,
  API_USERS_LIST,
} from "../../../config/endpointApi";
import { bindParams } from "../../../config/function";
import { ADMIN_MY_COURSE_CREATE_PATH, ADMIN_MY_COURSE_DETAIL_PATH, ADMIN_MY_COURSE_EDIT_PATH, COURSE_DETAIL_PATH, USER_DETAIL_PATH } from "../../../config/path";
import { ADMIN_ID } from "../../../config/const";
import IconMoreInfo from "../../../common/Icon/IconMoreInfo";
import IconEdit from "../../../common/Icon/IconEdit";

const MyCourseList = () => {
  const { t } = useTranslation("common");
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [keyword, setKeyword] = useState("");

  const LIMIT = 15;

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
          <div className="pl-1">{t("Chỉnh sửa")}</div>
        </div>
      </div>
    );
  };

  const columns = [
    {
      title: "#",
      dataIndex: "key",
      render: (value, data, index) => {
        return index + 1;
      },
      onCell,
    },
    {
      title: t("Tên khóa học"),
      dataIndex: "name",
      render: (name) => {
        return name;
      },
      onCell,
    },
    {
      title: t("Ngôn ngữ dạy"),
      dataIndex: "language",
      render: (language) => {
        return language;
      },
      onCell,
    },
    {
      title: t("Ngôn ngữ của người học"),
      dataIndex: "my_language",
      render: (my_language) => {
        return my_language;
      },
      onCell,
    },
    {
      title: t("Trạng thái"),
      dataIndex: "active",
      render: (active) => {
        return active === 1 ? t("Công khai") : t("Không công khai");
      },
      onCell,
    },
    {
      title: t("Người tạo"),
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
    loadMyCourseAdmin();
  }, [keyword]);

  const loadMyCourseAdmin = () => {
    setLoading(true);
    postAxios(API_COURSE_OWNER_LIST, {
      userId: ADMIN_ID,
    })
      .then((res) => {
        setTotal(res?.total);
        const arr = res?.data;
        setData(arr);
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

  const onSearch = (data) => {
    setData([]);
    setKeyword(data.keyword);
  };

  return (
    <AdminLayout breadcrumbs={[t("Danh sách Khóa học đã tạo")]}>
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
                {t("Tạo khóa học")}
              </Button>
            </NavLink>
          </div>
          <Space size={"large"} direction={"vertical"}>
            <div className="site-layout-background">
              <div className="banner--title">
                <div className="banner-header">
                  <div style={{ fontWeight: "bold" }}>
                    {[t("Danh sách các khóa học")]}
                  </div>
                  <div className="search-wrap">
                    <Form
                      className="tabbar-form"
                      onFinish={onSearch}
                      initialValues={{ keyword: keyword }}
                    >
                      <Form.Item
                        name={"keyword"}
                        className="input-search-discount"
                      >
                        <Input
                          allowClear
                          placeholder={t("Nhập từ khoá...")}
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
                rowKey="id"
                loading={loading}
                pagination={{
                  total: total,
                  pageSize: LIMIT,
                }}
              />
            </div>
          </Space>
        </Layout>
      )}
    </AdminLayout>
  );
};

export default React.memo(MyCourseList);
