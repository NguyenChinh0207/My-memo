import React, { useEffect, useState } from "react";
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

const { Option } = Select;

const CourseHead = (props) => {
  const { t } = useTranslation("common");
  const { name, description, owner, edit, added } = props;
  const history = useHistory();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [exams, setExams] = useState([]);
  const [validate, setValidate] = useState(false);
  const [examId, setExamId] = useState();
  const [loading, setLoading] = useState(false);
  const [exam, setExam] = useState({});

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
        notification.error({
          message: t("Đã có lỗi xảy ra, vui lòng thử lại sau."),
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
        notification.error({
          message: t("Đã có lỗi xảy ra, vui lòng thử lại sau."),
        });
      })
      .then(() => setLoading(false));
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
                    alt="example"
                    src={logoCourses}
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
                    alt="example"
                    src={logoCourses}
                  />
                  <div className="CourseDetails">
                    <div className="breadcumb">
                      {t("Khóa học")}
                      <RightOutlined size={18} /> {name}
                    </div>
                    <Divider className="divider-custom" />
                    <h1 className="TitleCourse">{name}</h1>
                    <div className="Description">{description}</div>
                    {added && (
                      <div className="btnWrapCourse">
                        <div style={{ marginTop: "10px" }}>
                          <Button
                            type="default"
                            className="examBtn"
                            onClick={() => setIsModalOpen(true)}
                          >
                            {t("Kiểm tra trắc nghiệm")}
                          </Button>
                        </div>
                        <div style={{ marginTop: "10px" }}>
                          <Button
                            type="default"
                            className="flashCardBtn"
                            onClick={() => setIsModalOpen(true)}
                          >
                            {t("FlashCard")}
                          </Button>
                        </div>
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
        title={t("Chọn chủ đề kiểm tra")}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={[
          <Button key="back" onClick={() => setIsModalOpen(false)}>
            {t("Quay lại")}
          </Button>,
          <Button key="submit" type="primary" onClick={handleSubmit}>
            {t("Bắt đầu")}
          </Button>,
        ]}
      >
        <Select
          size="large"
          placeholder={t("Chọn chủ để kiểm tra")}
          style={{ width: "100%" }}
          onChange={handleSelect}
        >
          {exams.map((item, index) => (
            <Option value={item._id} key={index}>
              {item.name}
            </Option>
          ))}
        </Select>
        {validate && (
          <p style={{ color: "red" }}>{t("Đây là thông tin bắt buộc.")}</p>
        )}
        {examId && exam && (
          <Form className="formExamDetailSelect">
            <Row>
              <Col span={24}>
                <Form.Item label={t("Tên chủ đề")} className="itemFormExam">
                  <div className="">{exam?.name}</div>
                </Form.Item>
                <Divider className="divider-custom-form" />
                <Form.Item label={t("Số câu hỏi")} className="itemFormExam">
                  <div className="">{exam?.questions_appear}</div>
                </Form.Item>
                <Divider className="divider-custom-form" />
                <Form.Item
                  label={t("Thời gian làm bài")}
                  className="itemFormExam"
                >
                  <div className="">
                    {exam?.time_answer} {t("phút")}
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
