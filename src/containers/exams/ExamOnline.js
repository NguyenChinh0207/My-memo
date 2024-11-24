import React, { useContext, useEffect, useState } from "react";
import "./Exam.scss";
import { useHistory, useLocation, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Layout, Radio } from "antd";
import { AppContext } from "../../context/AppContext";
import ExamHeader from "../../components/exam/ExamHeader";
import { shuffleArray } from "../../config/function";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";

const ExamOnline = () => {
  const { t } = useTranslation("course");
  const location = useLocation();
  const { user_info } = useContext(AppContext);
  const [exam, setExam] = useState({});
  const [questions, setQuestions] = useState([]);
  const [answer, setAnswer] = useState({});
  const [corrects, setCorrects] = useState([]);
  const [status, setStatus] = useState("");

  useEffect(() => {
    const detail = location.state.detail;
    if (detail) {
      setExam(detail);
      const arrShuffle = shuffleArray(
        detail.questions,
        Number(detail.questions_appear)
      );
      setQuestions(arrShuffle);
      let arr = [];
      arrShuffle.map((item) => {
        arr.push(item.correct);
      });
      setCorrects(arr);
    }
  }, [location]);

  const onRadioChange = (e) => {
    setAnswer({
      ...answer,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <Layout style={{ minWidth: "100vh" }} className="examOnline">
      <ExamHeader
        exam={exam}
        user={user_info}
        answer={answer}
        corrects={corrects}
        status={status}
        setStatus={setStatus}
      />
      {status !== "" ? (
        <div className="examOnlineContent1">
          <div>
            {questions.map((item, index) => (
              <div key={index}>
                <div className="question">
                  <p>
                    {`${t("question_number")} ${index + 1}:`}{" "}
                    <span>
                      {!String(answer[`answer${index + 1}`]) ||
                      answer[`answer${index + 1}`] === undefined ? (
                        <span className="fail">Miss</span>
                      ) : String(item.correct) ===
                        String(answer[`answer${index + 1}`]) ? (
                        <CheckOutlined className="correct" />
                      ) : (
                        <CloseOutlined className="fail" />
                      )}
                    </span>
                  </p>
                  <p>{item.content}</p>
                </div>
                <div className="answer">
                  <Radio.Group
                    className="radio-common"
                    name={`answer${index + 1}`}
                  >
                    {item.answer.map((value, i) => (
                      <Radio
                        value={value}
                        key={i}
                        className={`${
                          String(value) === String(item.correct)
                            ? "correct"
                            : String(value) ===
                              String(answer[`answer${index + 1}`])
                            ? "fail failBorder"
                            : ""
                        } Radio-common disableRadio`}
                      >
                        {i === 0
                          ? `A. ${value}`
                          : i === 1
                          ? `B. ${value}`
                          : i === 2
                          ? `C. ${value}`
                          : `D. ${value}`}
                      </Radio>
                    ))}
                  </Radio.Group>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="examOnlineContent">
          <div>
            {questions.map((item, index) => (
              <div key={index}>
                <div className="question">
                  <p>{`${t("question_number")} ${index + 1}:`} </p>
                  <p>{item.content}</p>
                </div>
                <div className="answer">
                  <Radio.Group
                    className="radio-common"
                    onChange={onRadioChange}
                    name={`answer${index + 1}`}
                  >
                    {item.answer.map((value, index) => (
                      <Radio value={value} key={index} className="Radio-common">
                        {index === 0
                          ? `A. ${value}`
                          : index === 1
                          ? `B. ${value}`
                          : index === 2
                          ? `C. ${value}`
                          : `D. ${value}`}
                      </Radio>
                    ))}
                  </Radio.Group>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </Layout>
  );
};

export default React.memo(ExamOnline);
