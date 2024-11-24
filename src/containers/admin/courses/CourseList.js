import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import Layout from "antd/lib/layout/layout";
import {
  Button,
  Form,
  Image,
  Input,
  notification,
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
  API_COURSES_LIST_ALL,
} from "../../../config/endpointApi";
import { bindParams } from "../../../config/function";
import {
  ADMIN_COURSE_DETAIL_PATH,
} from "../../../config/path";
import { LIMIT } from "../../../config/const";

const CourseList = () => {
  const { t } = useTranslation("course");
  const history = useHistory();
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
          pathname: `${bindParams(ADMIN_COURSE_DETAIL_PATH, {
            courseId: record._id,
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
      title: t("course_list"),
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
  ];

  useEffect(() => {
    loadAllCourses();
  }, [keyword, status]);

  const loadAllCourses = () => {
    setLoading(true);

    const params = { keyword, status: status !== null ? status : undefined };

    postAxios(API_COURSES_LIST_ALL, params)
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

  return (
    <AdminLayout breadcrumbs={[t("course_list")]}>
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
                  <div style={{ fontWeight: "bold" }}>{[t("course_list")]}</div>
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
