import React, { useEffect, useState, useContext } from "react";
import PropTypes from "prop-types";

import "./CourseHead.scss";
import Spinner from "../../spinner/Spinner";
import { useTranslation } from "react-i18next";
import {
  Button,
  Col,
  Divider,
  Form,
  Image,
  Modal,
  notification,
  Row,
  Select,
} from "antd";
import logoCourses from "../../../assets/img/logoCourses.png";
import { useHistory } from "react-router-dom";
import { bindParams } from "../../../config/function";
import { EXAM_ONLINE_PATH } from "../../../config/path";
import { RightOutlined } from "@ant-design/icons";
import { API_EXAM_DETAIL, API_EXAM_LIST } from "../../../config/endpointApi";
import { postAxios } from "../../../Http";
import { AppContext } from "../../../context/AppContext";
import { FULL_PATH_FILE } from "../../../config/const";

const { Option } = Select;

const CourseHead = (props) => {
  const { t } = useTranslation("course");
  const { words, name, description, owner, edit, added, setShowCard } = props;
  const history = useHistory();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [exams, setExams] = useState([]);
  const [validate, setValidate] = useState(false);
  const [examId, setExamId] = useState();
  const [loading, setLoading] = useState(false);
  const [exam, setExam] = useState({});
  const { user_info } = useContext(AppContext);

  useEffect(() => {
    if (isModalOpen) {
      loadExams();
    }
  }, [isModalOpen]);

  useEffect(() => {
    if (examId) {
      setValidate(false);
      loadExam(examId);
    }
  }, [examId]);

  const loadExams = () => {
    postAxios(API_EXAM_LIST, { courseId: props._id })
      .then((res) => {
        setExams(res?.data);
      })
      .catch((error) => {
        const { response } = error;
        notification.error({
          message: response?.data?.message
            ? `${t("common:server_error")}: ${response?.data?.message}`
            : t("common:msg_please_try_again"),
        });
      });
  };

  const loadExam = (id) => {
    setLoading(true);
    postAxios(API_EXAM_DETAIL, { id })
      .then((res) => {
        setExam(res?.data);
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

  const handleSelect = (value) => {
    setExamId(value);
  };

  const handleSubmit = () => {
    if (!examId) {
      setValidate(true);
    } else {
      setValidate(false);
    }
    if (!validate && examId) {
      history.push({
        pathname: `${bindParams(EXAM_ONLINE_PATH, {
          courseId: props._id,
          examId,
        })}`,
        state: { detail: exam },
      });
    }
  };

  return (
    <div className="CourseHead">
      {edit ? (
        <div className="PageHeadEdit">
          <div className="PageHeadRowEdit">
            {props.name ? (
              <React.Fragment>
                <div className="course-detail-wrapper-edit">
                  <img
                    className="imgCourseDetailEdit"
                    src={
                      props?.image
                        ? `${FULL_PATH_FILE}/${props?.image}`
                        : logoCourses
                    }
                  />
                  <div className="CourseDetails">
                    <div className="TitleCourseEdit">{name}</div>
                  </div>
                </div>
                <div className="CreatedByDiv">
                  <span className="CreatedBySpan">{t("created_by")} </span>
                  <span className="Owner">{owner?.username}</span>
                </div>
              </React.Fragment>
            ) : (
              <Spinner />
            )}
          </div>
        </div>
      ) : (
        <div className="PageHead">
          <div className="PageHeadRow">
            {props.name ? (
              <React.Fragment>
                <div className="course-detail-wrapper">
                  <Image
                    className="imgCourseDetail"
                    src={
                      props?.image
                        ? `${FULL_PATH_FILE}/${props.image}`
                        : logoCourses
                    }
                  />
                  <div className="CourseDetails">
                    <div className="breadcumb">
                      {t("course")}
                      <RightOutlined size={18} /> {name}
                    </div>
                    <Divider className="divider-custom" />
                    <h1 className="TitleCourse">{name}</h1>
                    <div className="Description">{description}</div>
                    {added && (
                      <div className="btnWrapCourse">
                        {/* <div style={{ marginTop: "10px" }}>
                          <Button
                            type="default"
                            className="unitBtn"
                            onClick={() => setIsModalOpen(true)}
                          >
                            {t("Hệ thống bài học")}
                          </Button>
                        </div> */}
                        <div style={{ marginTop: "10px" }}>
                          <Button
                            type="default"
                            className="examBtn"
                            onClick={() => setIsModalOpen(true)}
                          >
                            {t("test_exam")}
                          </Button>
                        </div>
                        {words && words.length > 1 && owner._id !== user_info._id && (
                          <div style={{ marginTop: "10px" }}>
                            <Button
                              type="default"
                              className="flashCardBtn"
                              onClick={() => setShowCard(true)}
                            >
                              {t("FlashCard")}
                            </Button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <div className="CreatedByDiv">
                  <span className="CreatedBySpan">{t("created_by")} </span>
                  <span className="Owner">{owner?.username}</span>
                </div>
              </React.Fragment>
            ) : (
              <Spinner />
            )}
          </div>
        </div>
      )}
      <Modal
        title={t("select_topic")}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={[
          <Button key="back" onClick={() => setIsModalOpen(false)}>
            {t("common:back")}
          </Button>,
          <Button key="submit" type="primary" onClick={handleSubmit}>
            {t("common:start")}
          </Button>,
        ]}
      >
        <Select
          size="large"
          placeholder={t("select_topic")}
          style={{ width: "100%" }}
          onChange={handleSelect}
        >
          {exams.map((item, index) => (
            <Option value={item._id} key={index}>
              {item.name}
            </Option>
          ))}
        </Select>
        {validate && <p style={{ color: "red" }}>{t("validate_required")}</p>}
        {examId && exam && (
          <Form className="formExamDetailSelect">
            <Row>
              <Col span={24}>
                <Form.Item label={t("topic_name")} className="itemFormExam">
                  <div className="">{exam?.name}</div>
                </Form.Item>
                <Divider className="divider-custom-form" />
                <Form.Item label={t("questions")} className="itemFormExam">
                  <div className="">{exam?.questions_appear}</div>
                </Form.Item>
                <Divider className="divider-custom-form" />
                <Form.Item label={t("anwser_time")} className="itemFormExam">
                  <div className="">
                    {exam?.time_answer} {t("minutes")}
                  </div>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        )}
      </Modal>
    </div>
  );
};

export default React.memo(CourseHead);

CourseHead.propTypes = {
  name: PropTypes.string,
  description: PropTypes.string,
  owner: PropTypes.object,
};
