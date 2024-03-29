import React, { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import Layout from "antd/lib/layout/layout";
import {
  Button,
  Col,
  Form,
  Input,
  Modal,
  notification,
  Row,
  Space,
  Spin,
  Table,
} from "antd";
import AdminLayout from "../../../layout/AdminLayout";
import "./UserList.scss";
import { SearchOutlined } from "@ant-design/icons";
import { postAxios } from "../../../Http";
import { API_USERS_LIST } from "../../../config/endpointApi";
import { bindParams } from "../../../config/function";
import { USER_DETAIL_PATH } from "../../../config/path";

const UserList = () => {
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
            pathname: `${bindParams(USER_DETAIL_PATH, {
              userId: record._id,
            })}`,
            state: { detail: record },
          }),
      };
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
      title: t("Tên đăng nhập"),
      dataIndex: "username",
      render: (username) => {
        return username;
      },
      onCell,
    },
    {
      title: t("Email"),
      dataIndex: "email",
      render: (email) => {
        return email;
      },
      onCell,
    },
    {
      title: t("Số từ đã học"),
      dataIndex: "wordsLearned",
      render: (wordsLearned) => {
        return wordsLearned;
      },
      onCell,
    },
    {
      title: t("Điểm"),
      dataIndex: "points",
      render: (points) => {
        return points;
      },
      onCell,
    },
    {
      title: t("Role"),
      dataIndex: "role",
      render: (role) => {
        return role === 1 ? "Admin" : "User";
      },
      onCell,
    },
  ];

  useEffect(() => {
    loadUsers();
  }, [keyword]);

  const loadUsers = () => {
    setLoading(true);
    postAxios(API_USERS_LIST, { keyword: keyword })
      .then((res) => {
        setTotal(res?.total);
        setData(res?.data);
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
    <AdminLayout breadcrumbs={[t("Danh sách người dùng")]}>
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
          <Space size={"large"} direction={"vertical"}>
            <div className="site-layout-background">
              <div className="banner--title">
                <div className="banner-header">
                  <div style={{ fontWeight: "bold" }}>
                    {[t("Danh sách người dùng")]}
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

export default UserList;
