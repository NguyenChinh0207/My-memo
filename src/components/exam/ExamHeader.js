import React, { useEffect, useRef, useState } from "react";

import "./ExamHeader.scss";
import { useTranslation } from "react-i18next";
import { Button, Col, Divider, Form, notification, Popconfirm, Row } from "antd";
import { useHistory } from "react-router-dom";
import { ClockCircleOutlined } from "@ant-design/icons";
import { formatTime } from "../../config/function";
import moment from "moment";
import { API_EXAM_EDIT } from "../../config/endpointApi";
import { postAxios } from "../../Http";

const ExamHeader = (props) => {
  const { t } = useTranslation("course");
  const { exam, answer, corrects, user, status, setStatus } = props;
  const history = useHistory();
  const [countdown, setCountdown] = useState();
  const [score, setScore] = useState(0);
  // const [status, setStatus] = useState("");
  const [time, setTime] = useState("");
  const timerId = useRef();

  useEffect(() => {
    if (exam) {
      setCountdown(exam.time_answer * 60);
    }
  }, [exam]);

  useEffect(() => {
    if (exam) {
      timerId.current = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timerId.current);
  }, [exam]);

  useEffect(() => {
    if (countdown <= 0) {
      clearInterval(timerId.current);
      handleSubmit();
    }
  }, [countdown]);

  useEffect(() => {
    if (status) {
      loadExam()
    }
  }, [status]);

  const loadExam = () => {
    let data={}
    data.id = exam._id;
    let obj = JSON.parse(exam.result);
    obj[user._id] = { score: score * 2, answerCorrects: score }
    data.result=JSON.stringify(obj)
    postAxios(API_EXAM_EDIT, data)
      .then((res) => {
        
      })
      .catch((error) => {
        const { response } = error;
        notification.error({
          message: response?.data?.message
            ? `${t("common:server_error")}: ${response?.data?.message}`
            : t("common:msg_please_try_again"),
        });
      })
  };

  const handleSubmit = () => {
    let qScore = 0;
    corrects.map((item, index) => {
      if (String(item) === String(answer[`answer${index + 1}`])) {
        qScore += 1;
      }
    });
    setScore(qScore);
    if (score > Math.ceil(exam.questions_appear.length / 2)) setStatus("Pass");
    else setStatus("Fail");
    setTime(moment(new Date()).format("YYYY-MM-DD HH:mm:ss"));
  };

  return (
    <div className="ExamHead">
      <div className={status === "" ? "PageHeadExam" : "PageHeadExam1"}>
        <div className={status === "" ? "PageHeadRow" : "PageHeadRow1"}>
          {status != "" ? (
            <React.Fragment>
              <div className="course-detail-wrapper1">
                <Form style={{ width: "100%" }}>
                  <div>
                    <div className="titleExamOnline">{t("test_exam")}</div>
                    <Divider className="divider-custom" />
                  </div>
                  <Row>
                    <Col span={15}>
                      <Form.Item
                        label={t("topic_name")}
                        className="itemFormExam"
                      >
                        <div>{exam?.name}</div>
                      </Form.Item>
                      <Divider className="divider-custom" />
                      <Form.Item
                        label={t("correct_answer")}
                        className="itemFormExam"
                      >
                        <div style={{ fontSize: "18px", fontWeight: "bold" }}>
                          {`${score}/${exam?.questions_appear}`}
                        </div>
                      </Form.Item>
                      <Divider className="divider-custom" />
                      <Form.Item label={t("time")} className="itemFormExam">
                        <div>{time}</div>
                      </Form.Item>
                    </Col>
                    <Col span={9}>
                      <Form.Item
                        label={t("common:fullname")}
                        className="itemFormExam"
                      >
                        <div>{user?.fullname || user?.username}</div>
                      </Form.Item>
                      <Divider className="divider-custom" />
                      <Form.Item
                        label={t("common:email")}
                        className="itemFormExam"
                      >
                        <div>{user?.email}</div>
                      </Form.Item>
                      <Divider className="divider-custom" />
                      <Form.Item label={t("status")} className="itemFormExam">
                        <div
                          style={
                            status === "Fail"
                              ? { color: "red", fontWeight: "bold" }
                              : { color: "green", fontWeight: "bold" }
                          }
                        >
                          {status}
                        </div>
                      </Form.Item>
                    </Col>
                  </Row>
                </Form>
              </div>
              <div className="CreatedByDiv">
                <div onClick={() => history.goBack()} className="CloseButton" />
              </div>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <div className="course-detail-wrapper">
                <Form style={{ width: "100%" }}>
                  <div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <div className="titleExamOnline">{t("test_exam")}</div>
                      <div
                        className="itemFormExam"
                        style={{ display: "flex", alignItems: "center" }}
                      >
                        <ClockCircleOutlined
                          size={18}
                          style={{ fontSize: "20px", marginRight: "10px" }}
                        />
                        <div className="countdown">{formatTime(countdown)}</div>
                      </div>
                    </div>
                    <Divider className="divider-custom" />
                  </div>
                  <Row>
                    <Col span={15}>
                      <Form.Item label={t("answers")} className="itemFormExam">
                        <div style={{ fontSize: "18px", fontWeight: "bold" }}>
                          {Object.keys(answer).length > 0
                            ? `${Object.keys(answer).length}/${
                                exam?.questions_appear
                              }`
                            : exam?.questions_appear}
                        </div>
                      </Form.Item>
                    </Col>
                    <Col span={9}>
                      <Form.Item className="itemFormExam">
                        <Popconfirm
                          placement="bottom"
                          title={t("confirm_submit_test_exam")}
                          onConfirm={() => handleSubmit()}
                          okText={t("common:yes")}
                          cancelText={t("common:no")}
                        >
                          <Button className="btnStartExam">
                            {t("submit")}
                          </Button>
                        </Popconfirm>
                      </Form.Item>
                    </Col>
                  </Row>
                </Form>
              </div>
            </React.Fragment>
          )}
        </div>
      </div>
    </div>
  );
};

export default React.memo(ExamHeader);
