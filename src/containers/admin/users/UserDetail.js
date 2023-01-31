import React, { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory, useLocation, useParams } from "react-router-dom";
import Layout from "antd/lib/layout/layout";
import {
  Button,
  Col,
  Divider,
  Form,
  Input,
  Modal,
  notification,
  Row,
  Space,
  Spin,
  Table,
} from "antd";
import { AppContext } from "../../../context/AppContext";
import AdminLayout from "../../../layout/AdminLayout";
import "./UserList.scss";
import { SearchOutlined } from "@ant-design/icons";
import { postAxios } from "../../../Http";
import {
  API_COURSE_OWNER_LIST,
  API_USERS_LIST,
} from "../../../config/endpointApi";
import { bindParams } from "../../../config/function";
import { USER_DETAIL_PATH } from "../../../config/path";

const Label = (props) => (
  <span className="common-label--black">{props.children} :</span>
);

const Text = ({ pink, children, lightGray, ...restProps }) => {
  return (
    <span {...restProps} style={{ marginLeft: "10px" }}>
      {children}
    </span>
  );
};

const UserList = () => {
  const { t } = useTranslation("common");
  const history = useHistory();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const { userId } = useParams();
  const [data, setData] = useState([]);
  const [coursesOwner, setCoursesOwner] = useState([]);
  const [dataMyCourses, setDataMyCourses] = useState([]);
  const [isLoadingMyCourses, setIsLoadingMyCourses] = useState([])

  const columnsOwner = [
    {
      title: "#",
      dataIndex: "key",
      render: (value, data, index) => {
        return index + 1;
      },
    },
    {
      title: t("Tên khóa học"),
      dataIndex: "name",
      ellipsis: true,
      width: "15%",
      render: (name) => {
        return name;
      },
    },
    {
      title: t("Mô tả"),
      dataIndex: "description",
      width: "35%",
      ellipsis: true,
      render: (description) => {
        return description;
      },
    },
    {
      title: t("Ngôn ngữ dạy"),
      dataIndex: "language",
      width: "15%",
      render: (language) => {
        return language;
      },
    },
    {
      title: t("Ngôn ngữ của người học"),
      dataIndex: "my_language",
      width: "15%",
      render: (my_language) => {
        return my_language;
      },
    },
    {
      title: t("Trạng thái"),
      dataIndex: "active",
      width: "10%",
      render: (active) => {
        return active === 1 ? "Công khai" : "Không công khai";
      },
    },
  ];
  const columnsMyCourses = [
    {
      title: "#",
      dataIndex: "key",
      render: (value, data, index) => {
        return index + 1;
      },
    },
    {
      title: t("Tên khóa học"),
      dataIndex: "name",
      ellipsis: true,
      width: "15%",
      render: (name) => {
        return name;
      },
    },
    {
      title: t("Mô tả"),
      dataIndex: "description",
      width: "35%",
      ellipsis: true,
      render: (description) => {
        return description;
      },
    },
    {
      title: t("Ngôn ngữ dạy"),
      dataIndex: "language",
      width: "15%",
      render: (language) => {
        return language;
      },
    },
    {
      title: t("Ngôn ngữ của người học"),
      dataIndex: "my_language",
      width: "15%",
      render: (my_language) => {
        return my_language;
      },
    },
  ];

  useEffect(() => {
    // loadUser();
    const detail = location.state.detail;
    if (detail) {
      loadCoursesOwner(detail._id);
      setData(detail);
    }
  }, [location]);

  const loadCoursesOwner = (id) => {
    setLoading(true);
    postAxios(API_COURSE_OWNER_LIST, {
      userId: id,
    })
      .then((res) => {
        const arr = res?.data;
        setCoursesOwner(arr);
      })
      .catch((error) => {
        notification.error({
          message: t("Đã có lỗi xảy ra, vui lòng thử lại sau."),
        });
      })
      .then(() => setLoading(false));
  };

  //   const loadUser = () => {
  //     setLoading(true);
  //     postAxios(API_USERS_LIST, { userId })
  //       .then((res) => {
  //         setData(res?.data);
  //       })
  //       .catch((error) => {
  //         notification.error({
  //           message: t("Đã có lỗi xảy ra, vui lòng thử lại sau."),
  //         });
  //       })
  //       .then(() => setLoading(false));
  //   };

  return (
    <AdminLayout breadcrumbs={[t("Danh sách người dùng"), data?.username]}>
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
              <Row>
                <Col span={12}>
                  <div style={{ display: "flex" }}>
                    <Label>{t("Họ và tên")}</Label>
                    <Text>{data?.fullname}</Text>
                  </div>
                  <Divider className="divider-custom" />
                  <div style={{ display: "flex" }}>
                    {" "}
                    <Label>{t("Tên đăng nhập")}</Label>
                    <Text>{data?.username}</Text>
                  </div>
                  <Divider className="divider-custom" />
                  <div style={{ display: "flex" }}>
                    <Label>{t("Email")}</Label>
                    <Text>{data?.email}</Text>
                  </div>
                  <Divider className="divider-custom" />
                </Col>
                <Col span={12}>
                  <div style={{ display: "flex" }}>
                    <Label>{t("Điểm")}</Label>
                    <Text>{data?.points}</Text>
                  </div>
                  <Divider className="divider-custom" />
                  <div style={{ display: "flex" }}>
                    {" "}
                    <Label>{t("Số từ đã học")}</Label>
                    <Text>{data?.wordsLearned}</Text>
                  </div>
                  <Divider className="divider-custom" />
                </Col>
              </Row>
              <Row>
                <Col span={24}>
                  <div style={{ marginTop: "10px" }}>{`${t(
                    "Danh sách khóa học đã tạo"
                  )}:`}</div>
                  <Table
                    className="custom-table"
                    columns={columnsOwner}
                    dataSource={coursesOwner}
                    rowKey="id"
                    loading={loading}
                  />
                </Col>
              </Row>
              <Row>
                <Col span={24}>
                  <div style={{ marginTop: "10px" }}>{`${t(
                    "Danh sách khóa học của tôi"
                  )}:`}</div>
                </Col>
                <Table
                  className="custom-table"
                  columns={columnsMyCourses}
                  dataSource={dataMyCourses}
                  rowKey="id"
                  loading={loading}
                />
              </Row>
            </div>
          </Space>
        </Layout>
      )}
    </AdminLayout>
  );
};

export default UserList;
