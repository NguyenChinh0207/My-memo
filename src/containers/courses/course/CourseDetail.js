import React, { Suspense, useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { NavLink, useHistory, useParams } from "react-router-dom";
import "./CourseDetail.scss";
import PrivateLayout from "../../../layout/PrivateLayout";
import { COURSE_CREATE_PATH, COURSE_EDIT_PATH, COURSE_LEARN_PATH } from "../../../config/path";
import Layout from "antd/lib/layout/layout";
import {
  Avatar,
  Button,
  Card,
  Col,
  Input,
  List,
  Modal,
  notification,
  Row,
  Spin,
} from "antd";
import {
  API_ACTION_MY_COURSE,
  API_ADD_MY_COURSE,
  API_COURSE_DETAIL,
  API_GET_MY_COURSE,
} from "../../../config/endpointApi";
import { postAxios } from "../../../Http";
import QuitCourseModal from "../../../components/quit-course-modal/QuitCourseModal";
import CourseHead from "../../../components/course/CourseHead/CourseHead";
import WordsTable from "../../../components/course/WordsTable/WordsTable";
import { AppContext } from "../../../context/AppContext";
import { bindParams } from "../../../config/function";
import { ComponentRender } from "./item/ComponentRender";
import { ExclamationCircleFilled } from "@ant-design/icons";

const CourseDetail = (props) => {
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

  const [learnBtnClasses, setLearnBtnClasses] = useState("LearnBtn Disabled");
  const [progressWidth, setProgressWidth] = useState();
  const [progress, setProgress] = useState(0);
  const [myCourses, setMyCourses] = useState([]);
  const [loadMyCourses, setLoadMyCourses] = useState(false);
  const userId = user_info?._id;
  const { confirm } = Modal;

  useEffect(() => {
    loadCourse();
    checkIfAdded();
  }, []);

  useEffect(() => {
    checkIfAdded();
    return () => {
      setLoadMyCourses(false);
      setLoading(false)
    }
  }, [myCourses, loadMyCourses]);

  useEffect(() => {
    setLoading(true);
    postAxios(API_GET_MY_COURSE, { userId })
      .then((res) => {
        setMyCourses(res?.data?.courses);
      })
      .catch((error) => {
        notification.error({
          message: t("Đã có lỗi xảy ra, vui lòng thử lại sau."),
        });
      })
      .then(() => setLoading(false));
  }, [userId, loadMyCourses]);

  useEffect(() => {
    if (course) {
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
        const words = course?.words ? JSON.parse(course.words) : [];
        if (course) {
          if (words.length === 0) {
            course.words = [{ word: t("Khóa học trống"), description: "" }];
          } else {
            course.words = words;
          }
          course.totalWords = words.length;
          checkIfOwner(course);
          setCourse(course);
        }
      })
      .catch((error) => {
        console.log("in detail", error);
        notification.error({
          message: t("Đã có lỗi xảy ra, vui lòng thử lại sau."),
        });
      })
      .then(() => setLoading(false));
  };

  const checkIfOwner = (course = course) => {
    if (course?.owner._id === user_info._id) {
      setOwner(true);
    }
  };

  const checkIfAdded = () => {
    if (!loading) {
      setLoading(false);
      let addedWord = false;
      let words = 0;
      if (myCourses && myCourses.length > 0) {
        for (let c of myCourses) {
          if (String(c._id) === courseId) {
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
        notification.error({
          message: t("Đã có lỗi xảy ra, vui lòng thử lại sau."),
        });
      })
      .then(() => setLoading(false));
  };

  const learn = () => {
    if (
      Number(course.totalWords) !== 0 &&
      wordsLearned !== Number(course.totalWords)
    ) {
      history.push(bindParams(COURSE_LEARN_PATH, {courseId: courseId}));
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
        <Layout className="Course-detail">
          {showElement ? (
            <div>
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
              <WordsTable {...course} />
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
