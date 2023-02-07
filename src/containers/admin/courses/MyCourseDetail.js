import React, { useContext, useEffect, useState } from "react";
import Row from "antd/es/grid/row";
import {
  Button,
  Col,
  Form,
  Input,
  Space,
  Checkbox,
  Spin,
  Layout,
  Divider,
  Table,
  notification,
  Image,
} from "antd";
import { useTranslation } from "react-i18next";
import { useHistory, useLocation, useParams } from "react-router-dom";
import "./CourseList";
import AdminLayout from "../../../layout/AdminLayout";
import { AppContext } from "../../../context/AppContext";
import { API_UNIT_LIST_BY_COURSE } from "../../../config/endpointApi";
import IconMoreInfo from "../../../common/Icon/IconMoreInfo";
import moment from "moment";
import { postAxios } from "../../../Http";

const MyCourseDetail = () => {
  const params = useParams();
  const history = useHistory();
  const location = useLocation();
  const { courseId } = params;
  const { t } = useTranslation("cmmon");
  const [loading, setLoading] = useState(false);
  const { user_info } = useContext(AppContext);
  const [detail, setDetail] = useState({});
  const [units, setUnits] = useState([]);

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
      title: t("Ảnh"),
      dataIndex: "image",
      render: (image) => {
        return <img src={image} />;
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
  ];

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

  useEffect(() => {
    if (courseId && location?.state?.detail) {
      const detail = location.state.detail;
      setDetail(detail);
    }
  }, [location]);

  useEffect(() => {
    loadUnits();
  }, []);

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
      <Layout className="banner-wrapper banner-form">
        <Space size={"large"} direction={"vertical"}>
          <div className="site-layout-background site-detail-course-admin">
            <Row>
              <Col span={16}>
                <div style={{ display: "flex" }}>
                  <Label>{t("Tên khóa học")}</Label>
                  <Text>{detail?.name}</Text>
                </div>
                <Divider className="divider-custom" />
                <div style={{ display: "flex" }}>
                  {" "}
                  <Label>{t("Dạy")}</Label>
                  <Text>{detail?.language}</Text>
                </div>
                <Divider className="divider-custom" />
                <div style={{ display: "flex" }}>
                  <Label>{t("Cho người nói")}</Label>
                  <Text>{detail?.my_language}</Text>
                </div>
                <Divider className="divider-custom" />
                <div style={{ display: "flex" }}>
                  <Label>{t("Thanh âm")}</Label>
                  <Text>{detail?.voice}</Text>
                </div>
                <Divider className="divider-custom" />
                <div style={{ display: "flex" }}>
                  {" "}
                  <Label>{t("Mô tả")}</Label>
                  <Text>{detail?.description}</Text>
                </div>
                <Divider className="divider-custom" />
                <div style={{ display: "flex" }}>
                  {" "}
                  <Label>{t("Công khai")}</Label>
                  <Text>
                    {detail?.active === 1
                      ? t("Công khai")
                      : t("Không công khai")}
                  </Text>
                </div>
                <Divider className="divider-custom" />
              </Col>
              <Col
                span={8}
                style={{ display: "flex", justifyContent: "center" }}
              >
                <Label>{t("Ảnh")}</Label>
                <div className="imgWrapper">
                  <Image
                    className="imgCourseEdit"
                    src={detail?.image}
                  />
                </div>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <Label style={{ marginTop: "10px" }}>{`${t(
                  t("Danh sách các bài học")
                )}:`}</Label>
                <Table
                  className="custom-table"
                  columns={columns}
                  dataSource={units}
                  rowKey="id"
                  loading={loading}
                />
              </Col>
            </Row>
          </div>
        </Space>
      </Layout>
    );
  };

  return (
    <AdminLayout
      breadcrumbs={[
        t("Danh sách khóa học đã tạo"),
        !courseId ? t("Tạo mới") : t("Chi tiết"),
      ]}
    >
      {renderForm()}
    </AdminLayout>
  );
};

export default MyCourseDetail;
