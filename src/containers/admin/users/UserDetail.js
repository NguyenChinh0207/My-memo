import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useParams } from "react-router-dom";
import Layout from "antd/lib/layout/layout";
import {
  Col,
  Divider,
  Modal,
  notification,
  Row,
  Space,
  Spin,
  Table,
} from "antd";
import AdminLayout from "../../../layout/AdminLayout";
import "./UserList.scss";
import { postAxios } from "../../../Http";
import {
  API_COURSE_OWNER_LIST,
  API_GET_EXAM_BY_COURSEID,
  API_GET_MY_COURSE,
} from "../../../config/endpointApi";
import IconMoreInfo from "../../../common/Icon/IconMoreInfo";

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

const UserDetail = () => {
  const { t } = useTranslation("course");
  const location = useLocation();
  const { userId } = useParams();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [coursesOwner, setCoursesOwner] = useState([]);
  const [progress, setProgress] = useState();
  const [myCourses, setMyCourses] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [exams, setExams] = useState([]);

  const columnsOwner = [
    {
      title: "#",
      dataIndex: "key",
      width: "5%",
      render: (value, data, index) => {
        return index + 1;
      },
    },
    {
      title: t("course_name"),
      dataIndex: "name",
      ellipsis: true,
      width: "15%",
      render: (name) => {
        return name;
      },
    },
    {
      title: t("description"),
      dataIndex: "description",
      width: "30%",
      ellipsis: true,
      render: (description) => {
        return description;
      },
    },
    {
      title: t("teacher_lang"),
      dataIndex: "language",
      width: "15%",
      render: (language) => {
        return language;
      },
    },
    {
      title: t("learner_lang"),
      dataIndex: "my_language",
      width: "15%",
      render: (my_language) => {
        return my_language;
      },
    },
    {
      title: t("words"),
      dataIndex: "words",
      width: "10%",
      render: (words) => {
        return words ? JSON.parse(words).length : 0;
      },
    },
    {
      title: t("status"),
      dataIndex: "active",
      width: "10%",
      render: (active) => {
        return active === 1 ? t("active") : t("deactive");
      },
    },
  ];
  const columnsMyCourses = [
    {
      title: "#",
      dataIndex: "key",
      width: "5%",
      render: (value, data, index) => {
        return index + 1;
      },
    },
    {
      title: t("course_name"),
      dataIndex: "name",
      ellipsis: true,
      width: "15%",
      render: (name) => {
        return name;
      },
    },
    {
      title: t("description"),
      dataIndex: "description",
      width: "20%",
      ellipsis: true,
      render: (description) => {
        return description;
      },
    },
    {
      title: t("teacher_lang"),
      dataIndex: "language",
      width: "15%",
      render: (language) => {
        return language;
      },
    },
    {
      title: t("learner_lang"),
      dataIndex: "my_language",
      width: "15%",
      render: (my_language) => {
        return my_language;
      },
    },
    {
      title: t("words"),
      dataIndex: "words",
      width: "10%",
      render: (words) => {
        return words ? JSON.parse(words).length : 0;
      },
    },
    {
      title: t("words_learned"),
      dataIndex: "_id",
      width: "15%",
      render: (id) => {
        return (progress && progress[id]?.wordsLearned) || 0;
      },
    },
    {
      title: t("history"),
      dataIndex: "_id",
      width: "15%",
      render: (id) => (
        <div className="moreIcon" onClick={() => action(id)}>
          <IconMoreInfo />
        </div>
      ),
    },
  ];
  const columnsExam = [
    {
      title: "#",
      dataIndex: "key",
      width: "5%",
      render: (value, data, index) => {
        return index + 1;
      },
    },
    {
      title: t("topic_name"),
      dataIndex: "name",
      ellipsis: true,
      width: "15%",
      render: (name) => {
        return name;
      },
    },
    {
      title: t("anwser_time"),
      dataIndex: "time_answer",
      width: "15%",
      ellipsis: true,
      render: (time_answer) => {
        return time_answer;
      },
    },
    {
      title: t("questions_appear"),
      dataIndex: "questions_appear",
      width: "20%",
      render: (questions_appear) => {
        return questions_appear;
      },
    },
    {
      title: t("questions"),
      dataIndex: "questions",
      width: "10%",
      render: (questions) => {
        return questions.length;
      },
    },
    {
      title: t("correct_answers"),
      dataIndex: "result",
      width: "10%",
      render: (result, record) => {
        let resultData;
        if (result) resultData = JSON.parse(result);
        return resultData[userId] && resultData[userId].answerCorrects;
      },
    },
    {
      title: t("result"),
      dataIndex: "result",
      width: "10%",
      render: (result, record) => {
        let resultData;
        let status;
        if (result) resultData = JSON.parse(result);
        if (
          resultData[userId] &&
          resultData[userId].answerCorrects >
            Math.ceil(record.questions_appear.length / 2)
        )
          status = 1;
        else status = 2;
        return status === 1 ? (
          <span style={{ color: "green", fontWeight: "bold" }}>
            {t("pass")}
          </span>
        ) : status === 2 ? (
          <span style={{ color: "red", fontWeight: "bold" }}>{t("fail")}</span>
        ) : (
          ""
        );
      },
    },
  ];

  useEffect(() => {
    // loadUser();
    const detail = location.state.detail;
    if (detail) {
      loadCoursesOwner(detail._id);
      loadMyCourses(detail._id);
      setData(detail);
      if (detail?.progress) setProgress(JSON.parse(detail?.progress));
    }
  }, [location.state.detail]);

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
        const { response } = error;
        notification.error({
          message: response?.data?.message
            ? `${t("common:server_error")}: ${response?.data?.message}`
            : t("common:msg_please_try_again"),
        });
      })
      .then(() => setLoading(false));
  };

  const loadMyCourses = (id) => {
    setLoading(true);
    postAxios(API_GET_MY_COURSE, { userId: id })
      .then((res) => {
        setMyCourses(res?.data?.courses);
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

  const loadExamsByCourseId = (id) => {
    setLoading(true);
    postAxios(API_GET_EXAM_BY_COURSEID, {
      courseId: id,
    })
      .then((res) => {
        const arr = res?.data;
        setExams(arr);
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

  const action = (id) => {
    setOpenModal(true);
    loadExamsByCourseId(id);
  };

  return (
    <AdminLayout breadcrumbs={[t("common:user_list"), data?.username]}>
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
                    <Label>{t("common:fullname")}</Label>
                    <Text>{data?.fullname}</Text>
                  </div>
                  <Divider className="divider-custom" />
                  <div style={{ display: "flex" }}>
                    {" "}
                    <Label>{t("common:username")}</Label>
                    <Text>{data?.username}</Text>
                  </div>
                  <Divider className="divider-custom" />
                  <div style={{ display: "flex" }}>
                    <Label>{t("common:email")}</Label>
                    <Text>{data?.email}</Text>
                  </div>
                  <Divider className="divider-custom" />
                </Col>
                <Col span={12}>
                  <div style={{ display: "flex" }}>
                    <Label>{t("common:points")}</Label>
                    <Text>{data?.points}</Text>
                  </div>
                  <Divider className="divider-custom" />
                  <div style={{ display: "flex" }}>
                    {" "}
                    <Label>{t("words_learned")}</Label>
                    <Text>{data?.wordsLearned}</Text>
                  </div>
                  <Divider className="divider-custom" />
                </Col>
              </Row>
              <Row>
                <Col span={24}>
                  <div style={{ marginTop: "10px" }}>{`${t(
                    t("created_courses")
                  )}:`}</div>
                  <Table
                    className="custom-table"
                    columns={columnsOwner}
                    dataSource={coursesOwner}
                    rowKey={(record) => record._id}
                    loading={loading}
                  />
                </Col>
              </Row>
              <Row>
                <Col span={24}>
                  <div style={{ marginTop: "10px" }}>{`${t(
                    t("my_course_list")
                  )}:`}</div>
                </Col>
                <Table
                  className="custom-table"
                  columns={columnsMyCourses}
                  dataSource={myCourses}
                  rowKey={(record) => record._id}
                  loading={loading}
                />
              </Row>
              <Modal
                title={t("test_history")}
                open={openModal}
                onCancel={() => setOpenModal(false)}
                footer={false}
                width="80%"
              >
                <Row style={{ width: "100%" }}>
                  <Table
                    className="custom-table"
                    columns={columnsExam}
                    dataSource={exams}
                    rowKey={(record) => record._id}
                    loading={loading}
                  />
                </Row>
              </Modal>
            </div>
          </Space>
        </Layout>
      )}
    </AdminLayout>
  );
};

export default UserDetail;
