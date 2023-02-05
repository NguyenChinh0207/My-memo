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
  const [sessionCreated, setSessionCreated] = useState();
  const [loadMyCourses, setLoadMyCourses] = useState(false);
  const [isLoading, data] = useGetMyCourse(loadMyCourses);
  const [flag, setFlag] = useState(false);

  useEffect(() => {
    loadCourse();
    if (!isLoading) {
      loadProgress();
    }
  }, []);

  useEffect(() => {
    loadProgress();
  }, [data.progress?.[courseId]]);

  useEffect(() => {
    if (flag && sessionWords !== undefined) {
      console.log("in vào useEfffect");
      setTimeout(setResultToLearning, 1000);
    }
  }, [flag]);

  useEffect(() => {
    if (progress && course) {
      console.log("in progress", progress);
      // setSessionCreated(true);
      createLearningSession();
    }
  }, [progress, course]);

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
    console.log("in create learnig1", wordsLearnedArr);
    if (sessionWordsArr.length === 0) {
      history.goBack();
    } else {
      const currentWordData = sessionWordsArr[0];
      setLoading(false);
      console.log("in create learnig2", wordsLearnedArr);
      setWordsLearned(wordsLearnedArr);
      setCurrentWord(currentWordData);
      setSessionWords(sessionWordsArr);
    }
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
            ? `${t("Đã có lỗi xảy ra")}: ${response?.data?.message}`
            : t("Đã có lỗi xảy ra, vui lòng thử lại sau."),
        });
      })
      .then(() => setLoading(false));
  };

  const nextClick = () => {
    console.log("in index nextClick", index, sessionWords[index]);
    const turnsNumber = turns - 1;
    if (turnsNumber === 0) {
      setTurns(0);
    } else {
      const sessionWordsArr = JSON.parse(JSON.stringify(sessionWords));
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
    setFlag(false);
    console.log("in index userWrote", index, sessionWords[index]);
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
      setResultStr("correct");
      setSessionWords(sessionWordsArr);
      console.log("in wordlerans", sessionWordsArr, wordsLearnedArr);
      setWordsLearned(wordsLearnedArr);
      setCurrentWord(currentWordObj);
      setFlag(true);
    } else {
      console.log("in vào set wrong", sessionWordsArr[index], index);
      if (sessionWordsArr[index]) sessionWordsArr[index].score = 0;
      currentWordObj.score = 0;
      setResultStr("wrong");
      setSessionWords(sessionWordsArr);
      setCurrentWord(currentWordObj);
      setFlag(true);
    }
    // setTimeout(setResultToLearning, 1000);
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
    console.log("in set result learning", index, resultStr);
    if (resultStr === "wrong") {
      console.log("vào wrong", index);
      setResultStr("learning");
    } else {
      const turnsNumber = turns - 1;
      const sessionWordsArr = sessionWords;
      console.log("in sessionWords", sessionWords);
      if (turnsNumber === 0) {
        setTurns(0);
      } else if (sessionWordsArr.length === 0) {
        setCourseFinished(true);
      } else {
        let idx = 0;
        if (sessionWordsArr.length > 1) {
          do {
            idx = Math.floor(Math.random() * sessionWordsArr.length);
            console.log("in index setResultToLearning1", idx, index);
          } while (idx === index);
        }
        const currentWordObj = sessionWordsArr[idx];
        console.log(
          "in index setResultToLearning",
          idx,
          index,
          sessionWordsArr[idx]
        );
        setResultStr("learning");
        setIndex(idx);
        setTurns(turnsNumber);
        setCurrentWord(currentWordObj);
      }
    }
    setFlag(false);
  };

  if (course && !loading) {
    console.log("In vào content1", resultStr);
    const pair = currentWord;
    let content = <NewWordFragment next={nextClick} {...pair} />;
    if (turns === 0 || courseFinished) {
      content = (
        <SessionComplete courseFinished={courseFinished} home={goToCourse} />
      );
    } else if (pair?.score > 0 || resultStr === "wrong") {
      console.log("In vào content", resultStr);
      content = (
        <WriteWordFragment
          result={resultStr}
          userWrote={userWrote}
          pair={pair}
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
