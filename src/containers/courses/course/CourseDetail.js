import React, { Suspense, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { NavLink, useHistory, useParams } from "react-router-dom";
import "./CourseDetail.scss";
import PrivateLayout from "../../../layout/PrivateLayout";
import { COURSE_CREATE_PATH } from "../../../config/path";
import Layout from "antd/lib/layout/layout";
import { Avatar, Card, Col, Input, List, notification, Row, Spin } from "antd";
import { API_COURSE_DETAIL } from "../../../config/endpointApi";
import { postAxios } from "../../../Http";
import QuitCourseModal from "../../../components/quit-course-modal/QuitCourseModal";
import CourseHead from "../../../components/course/CourseHead/CourseHead";
import WordsTable from "../../../components/course/WordsTable/WordsTable";

const ComponentRender = (items) => {
  const { t } = useTranslation("common");
  const history = useHistory();
  return (
    <>
      <div className="SecondHeader">
        <div className="Row">
          {items.added ? (
            <div className="RemoveButton" onClick={items.openModal}>
              {t("quit_course")}
            </div>
          ) : (
            <div
              className="StartButton"
              onClick={() => items.updateCourse("add")}
            >
              {t("add_to_my_courses")}
            </div>
          )}
          {items.owner && (
            <div
              onClick={() => history.push(items.courseId + "/edit")}
              className="EditBtn"
            >
              {t("editing")}
            </div>
          )}
        </div>
      </div>
      {items.added && (
        <div className="ProgressDiv">
          <div className="WordsLearned">
            {/* {items.wordsLearned} / {items.course.totalWords} {t("words_learn")} */}
            {t("words_learn")}
          </div>
          <div className="ProgressBar">
            <div style={items.progressWidth} className="Progress" />
          </div>
          {items.progress === 100 && (
            <div className="CourseCompleted">{t("course_complete")}</div>
          )}
          <div onClick={items.learn} className="learnBtnClasses">
            {t("learn")}
          </div>
        </div>
      )}
    </>
  );
};

const CourseDetail = (props) => {
  const { t } = useTranslation("common");
  const history = useHistory();
  const params = useParams();
  const { courseId } = params;
  const [loading, setLoading] = useState(false);
  const [course, setCourse] = useState({});
  const [owner, setOwner] = useState(false);
  const [added, setAdded] = useState(false);
  const [modal, setModal] = useState(false);
  const [wordsLearned, setWordsLearned] = useState(0);
  const [showElement, setShowElement] = useState(false);

  const [learnBtnClasses, setLearnBtnClasses] = useState("LearnBtn Disabled");
  const [progressWidth, setProgressWidth] = useState();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    loadCourse();
    // checkIfAdded();
  }, []);

  useEffect(() => {
    if (course && !loading) {
      setShowElement(true);
      if (added) {
        if (Number(course.totalWords) !== 0) {
          setProgress((100 * Number(wordsLearned)) / Number(course.totalWords));
          setLearnBtnClasses(
            progress === 100 ? "LearnBtn Disabled" : "LearnBtn"
          );
        }
        setProgressWidth({ width: progress + "%" });
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
        if (course) {
          const words = course?.words;
          if (course?.words.length === 0) {
            course.words = [{ word: "This course is empty", description: "" }];
          } else {
            course.words = words;
          }
          course.totalWords = words.length;
          checkIfOwner(course);
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

  const checkIfOwner = (course = course) => {
    if (course.owner === props.profile.username) {
      setOwner(true);
    }
  };

  const checkIfAdded = () => {
    if (!props.profile.loading) {
      setLoading(false);
      const courses = props.profile.courses;
      let addedWord = false;
      let words = 0;

      if (courses && courses.length !== 0) {
        for (let c of courses) {
          if (String(c.id) === courseId) {
            addedWord = true;
            words = c.wordsLearned;
          }
        }
      }
      setAdded(added);
      setWordsLearned(words);
    }
  };

  const openModal = () => {
    setModal(true);
  };

  const closeModal = () => {
    setModal(false);
  };

  const updateCourse = (action) => {
    // axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
    // axios.defaults.xsrfCookieName = "csrftoken";
    // axios.defaults.headers = {
    //   "Content-Type": "application/json",
    //   Authorization: `Token ${this.props.token}`,
    // };
    // axios
    //   .post(
    //     BASE_URL + "profiles-api/" + action + "/" + this.state.courseId + "/"
    //   )
    //   .then((res) => {
    //     this.props.updateProfile();
    //     if (action === "remove") {
    //       this.closeModal();
    //     }
    //   });
  };

  const learn = () => {
    if (
      Number(course.totalWords) !== 0 &&
      wordsLearned !== Number(course.totalWords)
    ) {
      history.push("/learn/" + courseId);
    }
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
        <Layout style={{ minWidth: "100vh" }}>
          <div className="PageHead">
            <div className="PageHeadRow">
              {showElement ? (
                <div>
                  {modal && (
                    <Suspense fallback={null}>
                      <QuitCourseModal
                        closeModal={this.closeModal}
                        quitCourse={() => this.updateCourse("remove")}
                      />
                    </Suspense>
                  )}
                  <CourseHead {...course} />
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
                  {/* <WordsTable {...course} /> */}
                </div>
              ) : (
                <CourseHead />
              )}
            </div>
          </div>
        </Layout>
      )}
    </PrivateLayout>
  );
};

export default CourseDetail;
