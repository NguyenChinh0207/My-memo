import React, { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Link,
  NavLink,
  useHistory,
  useLocation,
  useParams,
} from "react-router-dom";
import "./CourseDetail.scss";
import PrivateLayout from "../../../layout/PrivateLayout";
import {
  COURSE_CREATE_PATH,
  COURSE_DETAIL_PATH,
  COURSE_EDIT_PATH,
  COURSE_LIST_OWNER_PATH,
  LESSON_DETAIL_PATH,
} from "../../../config/path";
import Layout from "antd/lib/layout/layout";
import { postAxios } from "../../../Http";
import {
  Col,
  Form,
  Image,
  Input,
  List,
  Modal,
  notification,
  Row,
  Spin,
} from "antd";
import { bindParams } from "../../../config/function";
import logoVocab from "../../../assets/img/vocab.jpg";
import logoGrammar from "../../../assets/img/grammar.jpg";
import logoListen from "../../../assets/img/listen.png";
import logoReading from "../../../assets/img/read.png";
import { API_LESSONS_LIST_BY_UNIT_ID } from "../../../config/endpointApi";

const UnitDetail = () => {
  const { t } = useTranslation("common");
  const history = useHistory();
  const { unitId } = useParams();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [unit, setUnit] = useState({});
  const [lessons, setLessons] = useState([]);

  useEffect(() => {
    if (location?.state?.detail) {
      setUnit(location.state.detail);
    }
    loadLessons();
  }, [location]);

  const loadLessons = () => {
    setLoading(true);
    postAxios(API_LESSONS_LIST_BY_UNIT_ID, { unitId })
      .then((res) => {
        const list = res?.data;
        setLessons(list);
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
        dataSource={lessons}
        renderItem={(item) => (
          <List.Item key={item?._id} className="listItemOwner">
            <div className="courseOwner">
              <div className="tilteCourseOwner">
                <img
                  className="imgCourseOwner"
                  src={
                    Number(item?.tagType) === 1
                      ? logoVocab
                      : Number(item?.tagType) === 2
                      ? logoGrammar
                      : Number(item?.tagType) === 3
                      ? logoListen
                      : logoReading
                  }
                />
                <div className="titleItem">
                  <h3
                    className="courseNameOwnerUnit"
                    onClick={() =>
                      history.push(
                        history.push({
                          pathname: `${bindParams(LESSON_DETAIL_PATH, {
                            unitId,
                            lessonId: item._id,
                          })}`,
                          state: { detail: item },
                        })
                      )
                    }
                  >
                    {item?.title}
                  </h3>
                  <p>{item?.titleTargetLanguage}</p>
                  <p className="f-small bg-mark">
                    {Number(item?.tagType) === 1
                      ? "Từ vựng"
                      : Number(item?.tagType) === 2
                      ? "Ngữ pháp"
                      : Number(item?.tagType) === 3
                      ? "Nghe hiểu"
                      : "Đọc hiểu"}
                  </p>
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
        <Layout style={{ minWidth: "100vh" }} className="unitDetail">
          <div className="PageHead">
            <div className="PageHeadRow">
              <div className="Title">{unit?.name}</div>
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

export default UnitDetail;
