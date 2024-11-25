import React, { useContext, useEffect, useState } from "react";
import "./Learn.scss";
import HeaderLearnComponent from "../../components/learn/Header/Header";
import NewWordFragment from "../../components/learn/NewWordFragment/NewWordFragment";
import WriteWordFragment from "../../components/learn/WriteWordFragment/WriteWordFragment";
import SessionComplete from "../../components/learn/SessionComplete/SessionComplete";
import { postAxios } from "../../Http";
import {
  API_COURSE_DETAIL,
  API_UPDATE_PROGRESS,
} from "../../config/endpointApi";
import { useHistory, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import PrivateLayout from "../../layout/PrivateLayout";
import { notification, Spin } from "antd";
import { bindParams } from "../../config/function";
import { COURSE_DETAIL_PATH } from "../../config/path";
import { AppContext } from "../../context/AppContext";
import useGetMyCourse from "../../hook/useGetMyCourse";

const GOAL_SCORE = 2;
const TOTAL_TURNS = 10;

const Learn = () => {
  const { t } = useTranslation("common");
  const history = useHistory();
  const { user_info } = useContext(AppContext);
  const { courseId } = useParams();
  const [course, setCourse] = useState();
  const [loading, setLoading] = useState(true);
  const [index, setIndex] = useState(0);
  const [turns, setTurns] = useState(TOTAL_TURNS);
  const [resultStr, setResultStr] = useState("learning");
  const [progress, setProgress] = useState();
  const [sessionWords, setSessionWords] = useState();
  const [wordsLearned, setWordsLearned] = useState([]);
  const [currentWord, setCurrentWord] = useState();
  const [courseFinished, setCourseFinished] = useState(false);
  const [loadMyCourses, setLoadMyCourses] = useState(false);
  const [isLoading, data] = useGetMyCourse(loadMyCourses);
  const [flag, setFlag] = useState(false);
  const [inputReset, setInputReset] = useState(false);

  useEffect(() => {
    loadCourse();
    if (!isLoading) {
      loadProgress();
    }
  }, []);

  useEffect(() => {
    if (data.progress?.[courseId]) {
      loadProgress();
    }
  }, [data]);

  useEffect(() => {
    if (flag && sessionWords !== undefined) {
      setTimeout(setResultToLearning, 1000);
    }
  }, [flag]);

  useEffect(() => {
    if (progress && course) {
      // setSessionCreated(true);
      createLearningSession();
    }
  }, [progress, course]);

  useEffect(() => {
    if (inputReset && resultStr === "learning") {
      const turnsNumber = turns - 1;
      if (turnsNumber > 0 && sessionWords.length > 0) {
        let idx = Math.floor(Math.random() * sessionWords.length);
        if (sessionWords.length > 1) {
          while (idx === index) {
            idx = Math.floor(Math.random() * sessionWords.length);
          }
        }
        setIndex(idx);
        setCurrentWord(sessionWords[idx]); // Đảm bảo từ mới được cập nhật sau khi reset
        setTurns(turnsNumber);
      } else {
        setCourseFinished(true);
      }
    }
  }, [inputReset, resultStr]);

  const createLearningSession = () => {
    const sessionWordsArr = [];
    const wordsLearnedArr = [];

    // Duyệt qua tất cả các từ của khóa học để phân loại
    for (let pair of course.words) {
      let score = progress.wordsInProgress[pair.name] || 0;
      if (score !== GOAL_SCORE) {
        pair.score = score;
        sessionWordsArr.push(pair); // Thêm vào sessionWords nếu chưa đạt mục tiêu
      } else {
        wordsLearnedArr.push(pair.name); // Nếu đã đạt mục tiêu, đưa vào wordsLearned
      }
    }

    // Kiểm tra nếu không có từ nào chưa học
    if (sessionWordsArr.length === 0) {
      // Nếu tất cả từ đã học xong, chuyển về màn hình hoàn thành khóa học
      setCourseFinished(true);
      return;
    }

    // Đảm bảo không có lỗi về sessionWords và cập nhật dữ liệu mới
    const currentWordData = sessionWordsArr[0];
    setLoading(false);
    setWordsLearned(wordsLearnedArr);
    setCurrentWord(currentWordData);
    setSessionWords(sessionWordsArr);
  };
  const loadProgress = () => {
    if (!isLoading) {
      let progressData = {};
      if (data.progress?.[courseId]) {
        progressData = data.progress?.[courseId];
      }
      if (Object.keys(progressData).length === 0) {
        progressData = {
          wordsLearned: 0,
          wordsInProgress: {},
        };
      } else {
        progressData = progressData;
      }
      setProgress(progressData);
    }
  };

  const loadCourse = () => {
    setLoading(true);
    postAxios(API_COURSE_DETAIL, { id: courseId })
      .then((res) => {
        const course = res?.data;
        if (course) {
          setLoading(false);
          course.words = course.words ? JSON.parse(course.words) : [];
          if (course.words.length === 0) {
            history.goBack();
          }
          setCourse(course);
        }
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

  const nextClick = () => {
    const turnsNumber = turns - 1;
    if (turnsNumber === 0) {
      setTurns(0); // Khi không còn lượt nào, dừng lại
    } else {
      const sessionWordsArr = [...sessionWords]; // Tạo bản sao của mảng sessionWords
      sessionWordsArr[index].score++; // Tăng điểm của từ hiện tại

      // Chọn một từ ngẫu nhiên mới để học
      let idx = 0;
      if (sessionWordsArr.length > 1) {
        do {
          idx = Math.floor(Math.random() * sessionWordsArr.length);
        } while (idx === index); // Đảm bảo không chọn lại từ hiện tại
      }

      setTurns(turnsNumber);
      setIndex(idx);
      setSessionWords(sessionWordsArr);
      setCurrentWord(sessionWordsArr[idx]);
    }
  };

  const goToCourse = () => {
    history.push(bindParams(COURSE_DETAIL_PATH, { courseId: courseId }));
  };

  const userWrote = (word) => {
    const sessionWordsArr = [...sessionWords];
    const wordsLearnedArr = [...wordsLearned];
    const currentWordObj = { ...currentWord };

    if (currentWordObj.name === word.trim()) {
      currentWordObj.score++;
      if (currentWordObj.score === GOAL_SCORE) {
        wordsLearnedArr.push(currentWordObj.name);
        sessionWordsArr.splice(index, 1); // Loại bỏ từ đã học
      }
      setResultStr("correct");
    } else {
      sessionWordsArr.push(currentWordObj);
      currentWordObj.score = 0;
      setResultStr("wrong");
    }

    // Cập nhật trạng thái học
    postProgress(sessionWordsArr, wordsLearnedArr);
    setInputReset(false);

    setTimeout(() => {
      setWordsLearned(wordsLearnedArr);
      setSessionWords(sessionWordsArr);

      if (resultStr === "correct") {
        setInputReset(true); // Đổi từ mới khi đúng
      } else {
        const randomIdx = Math.floor(Math.random() * sessionWordsArr.length);
        setIndex(randomIdx);
        setCurrentWord(sessionWordsArr[randomIdx]);
        setResultStr("learning");
      }
    }, 1000); // Thời gian delay
  };

  const postProgress = (words, wordsLearnedList) => {
    let progressObj = { wordsLearned: 0, wordsInProgress: {} };
    for (let pair of words) {
      progressObj.wordsInProgress[pair.name] = pair.score;
    }
    for (let word of wordsLearnedList) {
      progressObj.wordsInProgress[word] = GOAL_SCORE;
      progressObj.wordsLearned++;
    }
    let profileProgress = data.progress;
    profileProgress[courseId] = progressObj;
    const dataParams = JSON.stringify(profileProgress);
    setLoadMyCourses(false);
    postAxios(API_UPDATE_PROGRESS, {
      data: dataParams,
      userId: user_info?._id,
    }).then((res) => {
      setLoadMyCourses(true);
    });
  };

  const setResultToLearning = () => {
    if (resultStr === "wrong") {
      setResultStr("learning");
    } else if (resultStr === "correct") {
      setTimeout(() => {
        const turnsNumber = turns - 1;
        if (turnsNumber > 0 && sessionWords.length > 0) {
          let idx = Math.floor(Math.random() * sessionWords.length);
          if (sessionWords.length > 1) {
            while (idx === index) {
              idx = Math.floor(Math.random() * sessionWords.length);
            }
          }
          setIndex(idx);
          setCurrentWord(sessionWords[idx]); // Cập nhật từ mới
          setTurns(turnsNumber);
          setResultStr("learning");
        } else {
          setCourseFinished(true); // Kết thúc khóa học
        }
      }, 1000);
    }
    setFlag(false);
  };

  if (course && !loading) {
    const pair = currentWord;
    let content = <NewWordFragment next={nextClick} {...pair} />;
    if (turns === 0 || courseFinished) {
      content = (
        <SessionComplete courseFinished={courseFinished} home={goToCourse} />
      );
    } else if (pair?.score > 0 || resultStr === "wrong") {
      content = (
        <WriteWordFragment
          result={resultStr}
          userWrote={userWrote}
          pair={currentWord}
          setInputReset={setInputReset}
        />
      );
    }
    return (
      <PrivateLayout>
        <div style={{ minWidth: "100vh" }} className="CourseLearn">
          <HeaderLearnComponent
            turns={turns}
            totalTurns={TOTAL_TURNS}
            close={() => history.goBack()}
            name={course.name}
          />
          {content}
        </div>
      </PrivateLayout>
    );
  } else {
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
};

export default React.memo(Learn);
