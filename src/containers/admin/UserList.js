import React, { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import Layout from "antd/lib/layout/layout";
import {
  Button,
  Col,
  Form,
  Input,
  notification,
  Row,
  Space,
  Spin,
  Table,
} from "antd";
import { AppContext } from "../../context/AppContext";
import AdminLayout from "../../layout/AdminLayout";
import "./UserList.scss";
import { SearchOutlined } from "@ant-design/icons";
import { postAxios } from "../../Http";
import { API_USERS_LIST } from "../../config/endpointApi";

const UserList = () => {
  const { t } = useTranslation("common");
  const history = useHistory();
  const { user_info } = useContext(AppContext);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [keyword, setKeyword] = useState("");
  const LIMIT = 15;

  const columns = [
    {
      title: "#",
      dataIndex: "key",
      render: (value, data, index) => {
        return index + 1;
      },
    },
    {
      title: t("Tên đăng nhập"),
      dataIndex: "username",
      render: (username) => {
        return username;
      },
    },
    {
      title: t("Email"),
      dataIndex: "email",
      render: (email) => {
        return email;
      },
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
        notification.error({
          message: t("Đã có lỗi xảy ra, vui lòng thử lại sau."),
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
                  <div style={{fontWeight: 'bold'}}>{[t("Danh sách người dùng")]}</div>
                  <Form
                    className="tabbar-form"
                    size="large"
                    onFinish={onSearch}
                    initialValues={{ keyword: keyword }}
                  >
                    <Form.Item name={"keyword"} className="tabbar-form-key">
                      <Input placeholder={t("Nhập từ khóa...")} />
                    </Form.Item>
                    <Button
                      loading={loading}
                      icon={<SearchOutlined />}
                      size="large"
                      htmlType="submit"
                    />
                  </Form>
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
