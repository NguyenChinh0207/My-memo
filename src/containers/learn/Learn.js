import React, { useContext, useEffect, useState } from "react";
import "./Learn.scss";
import HeaderLearnComponent from "../../components/learn/Header/Header";
import NewWordFragment from "../../components/learn/NewWordFragment/NewWordFragment";
import WriteWordFragment from "../../components/learn/WriteWordFragment/WriteWordFragment";
import SessionComplete from "../../components/learn/SessionComplete/SessionComplete";
import { postAxios } from "../../Http";
import {
  API_COURSE_DETAIL,
  API_GET_PROGRESS,
  API_UPDATE_PROGRESS,
} from "../../config/endpointApi";
import { useHistory, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import PrivateLayout from "../../layout/PrivateLayout";
import { Layout, notification, Spin } from "antd";
import { bindParams } from "../../config/function";
import { COURSE_DETAIL_PATH } from "../../config/path";
import { AppContext } from "../../context/AppContext";

const GOAL_SCORE = 2;
const TOTAL_TURNS = 10;

const Learn = () => {
  const { t } = useTranslation("common");
  const history = useHistory();
  const { user_info } = useContext(AppContext);
  const { courseId } = useParams();
  const [course, setCourse] = useState();
  const [loading, setLoading] = useState(false);
  const [index, setIndex] = useState(0);
  const [turns, setTurns] = useState(TOTAL_TURNS);
  const [result, setResult] = useState(t("Learning"));
  const [progress, setProgress] = useState();
  const [sessionWords, setSessionWords] = useState();
  const [wordsLearned, setWordsLearned] = useState([]);
  const [currentWord, setCurrentWord] = useState();
  const [courseFinished, setCourseFinished] = useState(false);
  const [sessionCreated, setSessionCreated] = useState(false);

  useEffect(() => {
    loadCourse();
    loadProgress();
  }, []);

  useEffect(() => {
    if (!sessionCreated && progress && course) {
      setSessionCreated(true);
      createLearningSession();
    }
  });

  const createLearningSession = () => {
    const sessionWordsArr = [];
    const wordsLearnedArr = [];
    for (let pair of course.words) {
      let score = progress.wordsInProgress[pair.name] || 0;
      if (score !== GOAL_SCORE) {
        pair.score = score;
        sessionWordsArr.push(pair);
      } else {
        wordsLearnedArr.push(pair.name);
      }
    }

    if (sessionWordsArr.length === 0) {
      history.goBack();
    } else {
      const currentWordData = sessionWordsArr[0];
      setLoading(false);
      setWordsLearned(wordsLearnedArr);
      setCurrentWord(currentWordData);
      setSessionWords(sessionWordsArr);
    }
  };

  const loadProgress = () => {
    setLoading(true);
    postAxios(API_GET_PROGRESS, { userId: user_info?._id })
      .then((res) => {
        setLoading(false);
        let data = JSON.parse(res?.data);
        let progressData = data?.progress[courseId] ? data.progress[courseId]: {};
        if (Object.keys(progressData).length === 0) {
          progressData = {
            wordsLearned: 0,
            wordsInProgress: {},
          };
        } else {
          progressData = progressData;
          console.log("in vao day2", progressData);
        }
        setProgress(progressData);
      })
      .catch((error) => {
        console.log("in ", error);
        notification.error({
          message: t("Đã có lỗi xảy ra, vui lòng thử lại sau."),
        });
      })
      .then(() => setLoading(false));
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
        notification.error({
          message: t("Đã có lỗi xảy ra, vui lòng thử lại sau."),
        });
      })
      .then(() => setLoading(false));
  };

  const nextClick = () => {
    const turnsNumber = turns - 1;
    if (turnsNumber === 0) {
      setTurns(0);
    } else {
      const sessionWordsArr = JSON.parse(JSON.stringify(sessionWords));
      console.log("in sessionWordsArr", sessionWordsArr);
      sessionWordsArr[index].score++;
      let idx = 0;
      if (sessionWordsArr.length > 1) {
        do {
          idx = Math.floor(Math.random() * sessionWordsArr.length);
        } while (idx === index);
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
    let sessionWordsArr = JSON.parse(JSON.stringify(sessionWords));
    const wordsLearnedArr = [...wordsLearned];
    const currentWordObj = {
      name: currentWord.name,
      description: currentWord.description,
      score: currentWord.score,
    };

    if (currentWordObj.name === word.trim()) {
      currentWordObj.score++;
      if (currentWordObj.score === GOAL_SCORE) {
        wordsLearnedArr.push(currentWordObj.name);
        sessionWordsArr.splice(index, 1);
      }
      postProgress(sessionWordsArr, wordsLearnedArr);
      setResult(t("Correct"));
      setSessionWords(sessionWordsArr);
      setWordsLearned(wordsLearnedArr);
      setCurrentWord(currentWordObj);
    } else {
      sessionWordsArr[index].score = 0;
      currentWordObj.score = 0;
      setResult(t("Wrong"));
      setSessionWords(sessionWordsArr);
      setCurrentWord(currentWordObj);
    }
    setTimeout(setResultToLearning, 500);
  };

  const postProgress = (words, wordsLearned) => {
    let progressObj = { wordsLearned: 0, wordsInProgress: {} };
    console.log("in word score", words);
    for (let pair of words) {
      progressObj.wordsInProgress[pair.name] = pair.score;
    }
    for (let word of wordsLearned) {
      progressObj.wordsInProgress[word] = GOAL_SCORE;
      progressObj.wordsLearned++;
    }
    let profileProgress = JSON.parse(JSON.stringify(progress));
    console.log("in profile progress", profileProgress);
    profileProgress[courseId] = progressObj;
    console.log("in profile progress2", profileProgress);
    const data = JSON.stringify({ progress: profileProgress });

    postAxios(API_UPDATE_PROGRESS, {
      data,
      userId: user_info?._id,
    }).then((res) => {loadProgress();});
  };

  const setResultToLearning = () => {
    if (result === t("Wrong")) {
      setResult(t("Learning"));
    } else {
      const turnsNumber = turns - 1;
      const sessionWordsArr = sessionWords;
      if (turnsNumber === 0) {
        setTurns(0);
      } else if (sessionWordsArr.length === 0) {
        setCourseFinished(true);
      } else {
        let idx = 0;
        if (sessionWordsArr.length > 1) {
          do {
            idx = Math.floor(Math.random() * sessionWordsArr.length);
          } while (idx === index);
        }
        const currentWordObj = sessionWordsArr[idx];
        setResult(t("Learning"));
        setIndex(idx);
        setTurns(turnsNumber);
        setCurrentWord(currentWordObj);
      }
    }
  };

  if (course && !loading) {
    const pair = currentWord;
    let content = <NewWordFragment next={nextClick} {...pair} />;
    if (turns === 0 || courseFinished) {
      content = (
        <SessionComplete courseFinished={courseFinished} home={goToCourse} />
      );
    } else if (pair?.score > 0 || result === t("Wrong")) {
      content = (
        <WriteWordFragment result={result} userWrote={userWrote} pair={pair} />
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
