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
  Popover,
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
  API_GET_EXAM_BY_COURSEID,
  API_GET_MY_COURSE,
  API_USERS_LIST,
} from "../../../config/endpointApi";
import { bindParams } from "../../../config/function";
import { USER_DETAIL_PATH } from "../../../config/path";
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
  const { t } = useTranslation("common");
  const location = useLocation();
  const {userId} = useParams()
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
      width: "30%",
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
      title: t("Số từ vựng"),
      dataIndex: "words",
      width: "10%",
      render: (words) => {
        return words ? JSON.parse(words).length : 0;
      },
    },
    {
      title: t("Trạng thái"),
      dataIndex: "active",
      width: "10%",
      render: (active) => {
        return active === 1 ? t("Công khai") : t("Không công khai");
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
      title: t("Số từ vựng"),
      dataIndex: "words",
      width: "10%",
      render: (words) => {
        return words ? JSON.parse(words).length : 0;
      },
    },
    {
      title: t("Số từ đã học"),
      dataIndex: "_id",
      width: "10%",
      render: (id, record) => {
        return progress[id].wordsLearned;
      },
    },
    {
      title: "",
      dataIndex: "_id",
      width: "5%",
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
      title: t("Tên chủ đề"),
      dataIndex: "name",
      ellipsis: true,
      width: "15%",
      render: (name) => {
        return name;
      },
    },
    {
      title: t("Thời gian trả lời"),
      dataIndex: "time_answer",
      width: "15%",
      ellipsis: true,
      render: (time_answer) => {
        return time_answer;
      },
    },
    {
      title: t("Số lượng câu hỏi xuất hiện"),
      dataIndex: "questions_appear",
      width: "20%",
      render: (questions_appear) => {
        return questions_appear;
      },
    },
    {
      title: t("Số câu hỏi"),
      dataIndex: "questions",
      width: "10%",
      render: (questions) => {
        return questions.length;
      },
    },
    {
      title: t("Số câu đúng"),
      dataIndex: "result",
      width: "10%",
      render: (result, record) => {
        let resultData;
        if (result) resultData = JSON.parse(result);
        return resultData[userId] && resultData[userId].answerCorrects;
      },
    },
    {
      title: t("Kết quả"),
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
          <span style={{ color: "green", fontWeight: "bold" }}>Pass</span>
        ) : status === 2 ? (
          <span style={{ color: "red", fontWeight: "bold" }}>Fail</span>
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
            ? `${t("Đã có lỗi xảy ra")}: ${response?.data?.message}`
            : t("Đã có lỗi xảy ra, vui lòng thử lại sau."),
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
            ? `${t("Đã có lỗi xảy ra")}: ${response?.data?.message}`
            : t("Đã có lỗi xảy ra, vui lòng thử lại sau."),
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
            ? `${t("Đã có lỗi xảy ra")}: ${response?.data?.message}`
            : t("Đã có lỗi xảy ra, vui lòng thử lại sau."),
        });
      })
      .then(() => setLoading(false));
  };

  const action = (id) => {
    setOpenModal(true);
    loadExamsByCourseId(id);
  };

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
                    t("Danh sách khóa học đã tạo")
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
                    t("Danh sách khóa học của tôi")
                  )}:`}</div>
                </Col>
                <Table
                  className="custom-table"
                  columns={columnsMyCourses}
                  dataSource={myCourses}
                  rowKey="id"
                  loading={loading}
                />
              </Row>
              <Modal
                title={t("Lịch sử kiểm tra")}
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
                    rowKey="id"
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
