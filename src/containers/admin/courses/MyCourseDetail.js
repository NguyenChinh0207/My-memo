import React, { useContext, useEffect, useState } from "react";
import Row from "antd/es/grid/row";
import {
  Col,
  Space,
  Spin,
  Layout,
  Divider,
  Table,
  notification,
  Image,
} from "antd";
import { useTranslation } from "react-i18next";
import { useLocation, useParams } from "react-router-dom";
import "./CourseList";
import AdminLayout from "../../../layout/AdminLayout";
import { API_UNIT_LIST_BY_COURSE } from "../../../config/endpointApi";
import moment from "moment";
import { postAxios } from "../../../Http";
import useCourseDetail from "../../../hook/useCourseDetail";

const MyCourseDetail = () => {
  const params = useParams();
  const location = useLocation();
  const { courseId } = params;
  const { t } = useTranslation("course");
  const [loading, setLoading] = useState(false);
  const { course } = useCourseDetail(courseId, t, setLoading);

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
        return <img src={image} style={{ width: "60px", height: "60px" }} />;
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
    if (courseId) {
      if (location?.state?.detail) {
        const detail = location.state.detail;
        setDetail(detail);
      } else {
        setDetail(course)
      }
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
            ? `${t("common:server_error")}: ${response?.data?.message}`
            : t("common:msg_please_try_again"),
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
                  <Label>{t("course_name")}</Label>
                  <Text>{detail?.name}</Text>
                </div>
                <Divider className="divider-custom" />
                <div style={{ display: "flex" }}>
                  {" "}
                  <Label>{t("teacher_lang")}</Label>
                  <Text>{detail?.language}</Text>
                </div>
                <Divider className="divider-custom" />
                <div style={{ display: "flex" }}>
                  <Label>{t("learner_lang")}</Label>
                  <Text>{detail?.my_language}</Text>
                </div>
                <Divider className="divider-custom" />
                <div style={{ display: "flex" }}>
                  <Label>{t("voice_lang")}</Label>
                  <Text>{detail?.voice}</Text>
                </div>
                <Divider className="divider-custom" />
                <div style={{ display: "flex" }}>
                  {" "}
                  <Label>{t("description")}</Label>
                  <Text>{detail?.description}</Text>
                </div>
                <Divider className="divider-custom" />
                <div style={{ display: "flex" }}>
                  {" "}
                  <Label>{t("active")}</Label>
                  <Text>
                    {detail?.active === 1
                      ? t("active")
                      : t("deactive")}
                  </Text>
                </div>
                <Divider className="divider-custom" />
              </Col>
              <Col
                span={8}
                style={{ display: "flex", justifyContent: "center" }}
              >
                <Label>{t("image")}</Label>
                <div className="imgWrapper">
                  <Image className="imgCourseEdit" src={detail?.image} />
                </div>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <Label style={{ marginTop: "10px" }}>{`${t(
                  t("lecture_list")
                )}:`}</Label>
                <Table
                  className="custom-table"
                  columns={columns}
                  dataSource={units}
                  rowKey={(record) => record._id}
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
        t("created_courses"),
        !courseId ? t("common:create") : `${courseId}`,
      ]}
    >
      {renderForm()}
    </AdminLayout>
  );
};

export default MyCourseDetail;
