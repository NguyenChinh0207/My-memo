import React, { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory, useParams } from "react-router-dom";
import "./CourseDetail.scss";
import PrivateLayout from "../../../layout/PrivateLayout";
import { COURSE_LEARN_PATH } from "../../../config/path";
import Layout from "antd/lib/layout/layout";
import { Button, Modal, notification, Spin } from "antd";
import {
  API_ACTION_MY_COURSE,
  API_COURSE_DETAIL,
  API_GET_MY_COURSE,
} from "../../../config/endpointApi";
import { postAxios } from "../../../Http";
import CourseHead from "../../../components/course/CourseHead/CourseHead";
import WordsTable from "../../../components/course/WordsTable/WordsTable";
import { AppContext } from "../../../context/AppContext";
import { bindParams, shuffleArray } from "../../../config/function";
import { ComponentRender } from "./item/ComponentRender";
import {
  DoubleLeftOutlined,
  DoubleRightOutlined,
  ExclamationCircleFilled,
} from "@ant-design/icons";
import useGetMyCourse from "../../../hook/useGetMyCourse";
import { FlashCard } from "./item/FlashCard";

const CourseDetail = () => {
  const { t } = useTranslation("common");
  const history = useHistory();
  const params = useParams();
  const { courseId } = params;
  const { user_info } = useContext(AppContext);
  const [loading, setLoading] = useState(false);
  const [course, setCourse] = useState({});
  const [owner, setOwner] = useState(false);
  const [added, setAdded] = useState(false);
  const [wordsLearned, setWordsLearned] = useState(0);
  const [showElement, setShowElement] = useState(false);
  const [loadMyCourses, setLoadMyCourses] = useState(false);
  const [learnBtnClasses, setLearnBtnClasses] = useState("");
  const [progressWidth, setProgressWidth] = useState();
  const [progress, setProgress] = useState(0);
  const { confirm } = Modal;
  const [isLoading, data] = useGetMyCourse(loadMyCourses);
  const [showCard, setShowCard] = useState(false);
  const [curCardId, setCurCardId] = useState(1);
  const [wordsData, setWordsData] = useState();
  const [loadingCard, setLoadingCard] = useState();

  useEffect(() => {
    loadCourse();
    checkIfAdded();
  }, []);

  useEffect(() => {
    if (!isLoading && data?.myCourses.length > 0) {
      checkIfAdded();
    }
    return () => {
      setLoading(false);
    };
  }, [isLoading]);

  useEffect(() => {
    if (course && !loading) {
      let learnBtnClassesState;
      let progressWidthState;
      let progressState = 0;
      setShowElement(true);
      if (added) {
        learnBtnClassesState = "LearnBtn Disabled";
        if (Number(course.totalWords) !== 0) {
          progressState =
            (100 * Number(wordsLearned)) / Number(course.totalWords);
          learnBtnClassesState =
            progressState === 100 ? "LearnBtn Disabled" : "LearnBtn";
        }
        progressWidthState = { width: `${progressState}%` };
        setProgress(progressState);
        setProgressWidth(progressWidthState);
        setLearnBtnClasses(learnBtnClassesState);
      }
    } else {
      setShowElement(false);
    }
  }, [course, added]);

  const loadCourse = () => {
    setLoading(true);
    postAxios(API_COURSE_DETAIL, { id: courseId })
      .then((res) => {
        const course = res?.data;
        const words = course?.words ? JSON.parse(course.words) : [];
        if (course) {
          if (words.length === 0) {
            course.words = [{ word: t("Khóa học trống"), description: "" }];
          } else {
            course.words = words;
          }
          course.totalWords = words.length;
          checkIfOwner(course);
          setWordsData(course.words);
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

  const checkIfOwner = (course) => {
    if (course?.owner._id === user_info._id) {
      setOwner(true);
    }
  };

  const checkIfAdded = () => {
    if (!isLoading) {
      setLoading(false);
      const courses = data?.myCourses;
      let addedWord = false;
      let words = 0;
      if (courses && courses.length > 0) {
        for (let c of courses) {
          if (String(c._id) === courseId) {
            console.log("in c", c);
            addedWord = true;
            words = c.wordsLearned;
          }
        }
      }
      setAdded(addedWord);
      setWordsLearned(words ? words : 0);
    }
  };

  const openModal = () => {
    confirm({
      title: `${t("Bạn có chắc chắn muốn rời khỏi khóa học?")}`,
      icon: <ExclamationCircleFilled />,
      onOk: () => updateCourse("remove"),
      onCancel: () => {},
    });
  };

  const updateCourse = (action) => {
    setLoading(true);
    setLoadMyCourses(false);
    postAxios(`${API_ACTION_MY_COURSE}/${action}`, {
      courseId: courseId,
      userId: user_info._id,
    })
      .then((res) => {
        setLoadMyCourses(true);
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

  const learn = () => {
    if (
      Number(course.totalWords) !== 0 &&
      wordsLearned !== Number(course.totalWords)
    ) {
      history.push(bindParams(COURSE_LEARN_PATH, { courseId: courseId }));
    }
  };

  // flashcard
  const RenderHeaderCard = () => {
    return (
      <div className="SecondHeader">
        <div className="Row" style={{ display: "flex", justifyContent: "end" }}>
          <div onClick={() => setShowCard(false)} className="EditBtn">
            {t("Quay lại")}
            <DoubleRightOutlined />
          </div>
        </div>
      </div>
    );
  };

  const goToPrev = () => {
    if (isValidId(curCardId - 1)) {
      setCurCardId(curCardId - 1);
    } else {
      setCurCardId(wordsData.length);
    }
  };

  const goToNext = () => {
    if (isValidId(curCardId + 1)) {
      setCurCardId(curCardId + 1);
    } else {
      setCurCardId(1);
    }
  };

  function isValidId(id) {
    return id <= wordsData.length && id >= 1;
  }

  const shuffleFunc = () => {
    setLoadingCard(true);
    const arr = shuffleArray(course.words, course.words.length);
    setWordsData(arr);
    setLoadingCard(false);
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
        <Layout className="Course-detail">
          {showElement ? (
            <div>
              <CourseHead {...course} added={added} setShowCard={setShowCard} />
              {!showCard ? (
                <>
                  <ComponentRender
                    course={course}
                    progress={progress}
                    progressWidth={progressWidth}
                    learnBtnClasses={learnBtnClasses}
                    added={added}
                    owner={owner}
                    courseId={courseId}
                    wordsLearned={wordsLearned}
                    openModal={openModal}
                    learn={learn}
                    updateCourse={updateCourse}
                  />
                  <WordsTable {...course} />
                </>
              ) : (
                <>
                  <RenderHeaderCard />
                  <div className="FlashCardWrap">
                    <Button
                      type="default"
                      className="me-4 prev-next-btns"
                      onClick={goToPrev}
                    >
                      <DoubleLeftOutlined />
                      {t("Trước")}
                    </Button>
                    <FlashCard
                      {...wordsData.find(
                        (item, index) => index + 1 === curCardId
                      )}
                      curCardId={curCardId}
                      loadingCard={loadingCard}
                    ></FlashCard>
                    <Button
                      // type="primary"
                      className="ms-4 prev-next-btns"
                      onClick={goToNext}
                    >
                      {t("Tiếp")}
                      <DoubleRightOutlined />
                    </Button>
                  </div>
                  <div className="action-buttons">
                    <Button
                      type="primary"
                      className="ms-4 prev-next-btns"
                      onClick={shuffleFunc}
                    >
                      {t("Trộn thẻ")}
                    </Button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <CourseHead />
          )}
        </Layout>
      )}
    </PrivateLayout>
  );
};

export default CourseDetail;
