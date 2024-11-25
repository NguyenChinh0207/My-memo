import React, { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {

  useHistory,
  useLocation,
  useParams,
} from "react-router-dom";
import "./CourseDetail.scss";
import PrivateLayout from "../../../layout/PrivateLayout";

import Layout from "antd/lib/layout/layout";
import { postAxios } from "../../../Http";
import {
  Button,
  Col,
  notification,
  Radio,
  Row,
  Spin,
  Table,
} from "antd";
// import logoListen from "../../../assets/img/listen.jpg";
import {
  API_LESSONS_LIST_BY_UNIT_ID,
  API_LESSON_DETAIL,
} from "../../../config/endpointApi";
import { PlayCircleOutlined } from "@ant-design/icons";

const LessonDetail = () => {
  const { t } = useTranslation("course");
  const history = useHistory();
  const { unitId, lessonId } = useParams();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [lesson, setLesson] = useState({});
  const [voiceId, setVoiceId] = useState();
  const [answer, setAnswer] = useState({});
  const [status, setStatus] = useState(false)

  let msg = new SpeechSynthesisUtterance();
  let synth = speechSynthesis;

  const speechHandler = (msg, text) => {
    msg.text = text;
    msg.voice = synth.getVoices()[voiceId || 13];
    window.speechSynthesis.speak(msg);
  };

  useEffect(() => {
      loadLesson();
      return () => setStatus(false);
  }, [location]);

  const loadLesson = () => {
    setLoading(true);
    postAxios(API_LESSON_DETAIL, { id: lessonId })
      .then((res) => {
        const data = res?.data;
        setVoiceId(res?.voiceId);
        setLesson(data);
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

    const onRadioChange = (e) => {
        let obj = { [e.target.name]: e.target.value };
        let objClone = answer
        Object.assign(objClone, obj);
        setAnswer(objClone)
  };

  const onSubmit = () => {
    setStatus(true)
  };

  const VideoContent = () => {
    return (
      <>
        <div className="videoWrap">
          <h3
            className="videoTitle"
            style={{ marginBottom: "10px", color: "#684228" }}
          >
            {t("watch_lesson")}
          </h3>
          <h2 className="videoTitle">
            {lesson?.titleTargetLanguage &&
              lesson.titleTargetLanguage.toUpperCase()}
          </h2>
          <div className="borderVideo">
            <video width="700" controls>
              <source src={lesson.video} />
            </video>
          </div>
        </div>
      </>
    );
  };
  const SummaryContent = () => {
    return (
      <>
        <div className="summaryWrap">
          <h2 style={{ fontWeight: "bold", color: "red" }}>
            {t("Tóm tắt bài học").toUpperCase()}
          </h2>
        </div>
        <div
          className="htmlContent"
          dangerouslySetInnerHTML={{ __html: lesson?.content }}
        />
      </>
    );
  };
  const WordsContent = () => {
    const columns = [
      {
        title: "#",
        dataIndex: "key",
        with: "10%",
        render: (value, data, index) => {
          return index + 1;
        },
      },
      {
        title: t("vocabulary"),
        dataIndex: "newWord",
        with: "25%",
        align: "left",
        render: (newWord) => {
          return (
            <span style={{ fontWeight: "bold", fontSize: "18px" }}>
              {newWord}
            </span>
          );
        },
      },
      {
        title: `${t("transcription")}`,
        with: "10%",
        dataIndex: "spelling",
        align: "left",
        render: (spelling) => {
          return spelling;
        },
      },
      {
        title: `${t("audio")}`,
        with: "10%",
        dataIndex: "newWord",
        align: "left",
        render: (newWord) => {
          return (
            <div onClick={() => speechHandler(msg, newWord)}>
              <PlayCircleOutlined style={{ fontSize: "20px" }} />
            </div>
          );
        },
      },
      {
        title: t("mean"),
        dataIndex: "meaning",
        with: "15%",
        align: "left",
        render: (meaning) => {
          return <span style={{ color: "#a86322 " }}>{meaning}</span>;
        },
      },
      {
        title: t("example"),
        with: "25%",
        dataIndex: "example",
        align: "left",
        render: (example) => {
          return (
            <div>
              {example}
              <span onClick={() => speechHandler(msg, example)}>
                <PlayCircleOutlined style={{ fontSize: "20px" }} />
              </span>
            </div>
          );
        },
      },
    ];
    return (
      <div className="wordContent">
        {lesson.video && (
          <h2 style={{ fontWeight: "bold", color: "red" }}>
            {t("new_word_appear").toUpperCase()}
          </h2>
        )}
        <Table
          className="custom-table"
          columns={columns}
          dataSource={lesson?.newWords}
          rowKey="id"
          loading={loading}
          pagination={false}
        />
      </div>
    );
  };

  const QuestionsContent = () => {
    return (
      <>
        {!status ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              marginTop: "40px",
              marginBottom: "40px",
            }}
          >
            <div style={{ fontSize: "20px", fontWeight: "bold" }}>
              {t("pratice")}
            </div>
            {lesson?.questions &&
              lesson.questions.map((item, key) => (
                <div
                  key={key}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "start",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      width: "100%",
                      marginLeft: "20px",
                      marginTop: "10px",
                    }}
                  >
                    <div className="questionNumber">{key + 1}</div>
                    <div className="questionName">{item.question}</div>
                  </div>
                  <Radio.Group
                    className="radio-common radioLesson"
                    onChange={onRadioChange}
                    name={`answer${key + 1}`}
                  >
                    {item?.answer1 && (
                      <Radio value={item.answer1}>A. {item.answer1}</Radio>
                    )}
                    {item?.answer2 && (
                      <Radio value={item.answer2}>B. {item.answer2}</Radio>
                    )}
                    {item?.answer3 && (
                      <Radio value={item.answer3}>C. {item.answer3}</Radio>
                    )}
                    {item?.answer4 && (
                      <Radio value={item.answer4}>D. {item.answer4}</Radio>
                    )}
                  </Radio.Group>
                </div>
              ))}
            <Button
              type="primary"
              className="createCourse"
              loading={loading}
              style={{ width: "110px", marginTop: "10px", marginLeft: "20px" }}
              onClick={onSubmit}
            >
              {t("submit")}
            </Button>
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              marginTop: "40px",
              marginBottom: "40px",
            }}
          >
            <div style={{ fontSize: "20px", fontWeight: "bold" }}>
              {t("pratice")}
            </div>
            {lesson?.questions &&
              lesson.questions.map((item, key) => (
                <div
                  key={key}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "start",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      width: "100%",
                      marginLeft: "20px",
                      marginTop: "10px",
                    }}
                  >
                    <div className="questionNumber">{key + 1}</div>
                    <div className="questionName">{item.question}</div>
                  </div>
                  <Radio.Group
                    className="radio-common radioLesson"
                    onChange={onRadioChange}
                    name={`answer${key + 1}`}
                  >
                    {item?.answer1 && (
                      <Radio
                        value={item.answer1}
                        className={`${
                          String(item.answer1) === String(item.correct)
                            ? "correct"
                            : String(item.answer1) ===
                              String(answer[`answer${key + 1}`])
                            ? "fail failBorder"
                            : ""
                        } Radio-common disableRadio`}
                      >
                        A. {item.answer1}
                      </Radio>
                    )}
                    {item?.answer2 && (
                      <Radio
                        value={item.answer2}
                        className={`${
                          String(item.answer2) === String(item.correct)
                            ? "correct"
                            : String(item.answer2) ===
                              String(answer[`answer${key + 1}`])
                            ? "fail failBorder"
                            : ""
                        } Radio-common disableRadio`}
                      >
                        B. {item.answer2}
                      </Radio>
                    )}
                    {item?.answer3 && (
                      <Radio
                        value={item.answer3}
                        className={`${
                          String(item.answer3) === String(item.correct)
                            ? "correct"
                            : String(item.answer3) ===
                              String(answer[`answer${key + 1}`])
                            ? "fail failBorder"
                            : ""
                        } Radio-common disableRadio`}
                      >
                        C. {item.answer3}
                      </Radio>
                    )}
                    {item?.answer4 && (
                      <Radio
                        value={item.answer4}
                        className={`${
                          String(item.answer4) === String(item.correct)
                            ? "correct"
                            : String(item.answer4) ===
                              String(answer[`answer${key + 1}`])
                            ? "fail failBorder"
                            : ""
                        } Radio-common disableRadio`}
                      >
                        D. {item.answer4}
                      </Radio>
                    )}
                  </Radio.Group>
                </div>
              ))}
          </div>
        )}
      </>
    );
  };
  const ReadContent = () => {
    return (
      <>
        <div className=" imgRead">
          <div
            className="readHtmlContent"
            dangerouslySetInnerHTML={{ __html: lesson?.content }}
          />
        </div>
      </>
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
        <Layout
          style={{ minWidth: "100vh" }}
          className="lessonDetail unitDetail"
        >
          <div className="PageHead">
            <div className="PageHeadRow">
              <div className="Title">{`${
                Number(lesson?.tagType) === 1
                  ? "Từ vựng"
                  : Number(lesson?.tagType) === 2
                  ? "Ngữ pháp"
                  : Number(lesson?.tagType) === 3
                  ? "Nghe hiểu"
                  : "Đọc hiểu"
              }- ${lesson?.title}`}</div>
            </div>
          </div>
          <div className="Content-courses Content-courses-owner ContentLesson">
            <div>
              <Row>
                <Col span={24}>
                  {lesson?.video && <VideoContent />}
                  {lesson?.content &&
                    (Number(lesson?.tagType) === 4 ? (
                      <ReadContent />
                    ) : (
                      <SummaryContent />
                    ))}
                  {lesson?.newWords && lesson.newWords.length > 0 && (
                    <WordsContent />
                  )}
                  {lesson?.questions && lesson.questions.length > 0 && (
                    <QuestionsContent />
                  )}
                </Col>
              </Row>
            </div>
          </div>
        </Layout>
      )}
    </PrivateLayout>
  );
};

export default LessonDetail;
