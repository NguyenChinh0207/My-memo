import React, { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useHistory } from "react-router-dom";
import "./Courses.scss";
import PrivateLayout from "../../layout/PrivateLayout";
import {
  COURSE_DETAIL_PATH,
  COURSE_EDIT_PATH,
} from "../../config/path";
import Layout from "antd/lib/layout/layout";
import { postAxios } from "../../Http";
import {
  API_COURSE_EDIT,
  API_COURSE_OWNER_LIST,
} from "../../config/endpointApi";
import {
  Col,
  List,
  Modal,
  notification,
  Row,
  Spin,
} from "antd";
import { bindParams } from "../../config/function";
import {
  ExclamationCircleFilled,
} from "@ant-design/icons";
import logoCourses from "../../assets/img/logoCourses.png";
import { AppContext } from "../../context/AppContext";

const CoursesOwner = () => {
  const { t } = useTranslation("course");
  const history = useHistory();
  const { user_info } = useContext(AppContext);
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState([]);
  const [total, setTotal] = useState(0);
  const { confirm } = Modal;
  const [isChange, setIsChange] = useState(false);

  useEffect(() => {
    loadCourses();
  }, [isChange]);

  const loadCourses = () => {
    setLoading(true);
    postAxios(API_COURSE_OWNER_LIST, {
      userId: user_info._id,
    })
      .then((res) => {
        setTotal(res?.total);
        const arr = res?.data;
        setCourses(arr);
      })
      .catch((error) => {
        const { response } = error;
        notification.error({
          message: response?.data?.message
            ? `${t("common:server_error")}: ${response?.data?.message}`
            : t("common:msg_please_try_again"),
        });
      })
      .finally(() => setLoading(false));
  };

  const changeStatusActive = (id, active) => {
    setLoading(true);
    setIsChange(false);
    postAxios(API_COURSE_EDIT, { id: id, active: active ? 0 : 1 })
      .then((res) => {
        setLoading(false);
        setIsChange(true);
      })
      .catch((error) => {
        const { response } = error;
        notification.error({
          message: response?.data?.message
            ? `${t("common:server_error")}: ${response?.data?.message}`
            : t("common:msg_please_try_again"),
        });
      })
      .finally(() => setLoading(false));
  };

  const onStatus = (id, active) => {
    confirm({
      title: t("confim_change_status"),
      icon: <ExclamationCircleFilled />,
      onOk: () => changeStatusActive(id, active),
      onCancel() {},
    });
  };

  const ContentList = () => {
    return (
      <List
        grid={{
          gutter: 16,
          xs: 1,
          sm: 2,
          md: 3,
          lg: 4,
          xl: 4,
          xxl: 4,
        }}
        loading={loading}
        dataSource={courses}
        renderItem={(item) => (
          <List.Item key={item?._id} className="listItemOwner">
            <div className="courseOwner">
              <div className="tilteCourseOwner">
                <img
                  className="imgCourseOwner"
                  src={item?.image ? item.image : logoCourses}
                />
                <div className="titleItem">
                  <h3
                    className="courseNameOwner"
                    onClick={() =>
                      history.push(
                        bindParams(COURSE_DETAIL_PATH, {
                          courseId: item._id,
                        })
                      )
                    }
                  >
                    {item?.name}
                  </h3>
                  <p>{`${item?.words ? JSON.parse(item?.words).length : 0} ${t(
                    "từ"
                  )}`}</p>
                  <p>
                    {item.active
                      ? `(${t("active")})`
                      : `(${t("deactive")})`}
                  </p>
                </div>
              </div>
              <div className={"MoreOptionsDiv"}>
                <div className={"MoreOptionsButton"} />
                <div className={"TooltipWrapper"}>
                  <ul className={"Tooltip"}>
                    <li>
                      <Link
                        className={"TooltipLink"}
                        to={bindParams(COURSE_EDIT_PATH, {
                          courseId: item._id,
                        })}
                      >
                        {t("edit_course")}
                      </Link>
                    </li>
                    <li>
                      <div
                        className={"TooltipLink"}
                        onClick={() => onStatus(item._id, item.active)}
                      >
                        {t("change_status")}
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </List.Item>
        )}
        className="ownerList"
      />
    );
  };

  return (
    <PrivateLayout>
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
        <Layout style={{ minWidth: "100vh" }} className="Course">
          <div className="PageHead">
            <div className="PageHeadRow">
              <div className="Title">{t("created_courses")}</div>
            </div>
          </div>
          <div className="Content-courses Content-courses-owner">
            <div>
              <Row>
                <Col span={24}>
                  <ContentList />
                </Col>
              </Row>
            </div>
          </div>
        </Layout>
      )}
    </PrivateLayout>
  );
};

export default CoursesOwner;
