import React, { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory, useParams } from "react-router-dom";
import "./CourseDetail.scss";
import PrivateLayout from "../../../layout/PrivateLayout";
import { COURSE_DETAIL_PATH } from "../../../config/path";
import Layout from "antd/lib/layout/layout";
import { notification, Spin } from "antd";
import {
  API_COURSE_DETAIL,
  API_UPDATE_WORDS,
} from "../../../config/endpointApi";
import { postAxios } from "../../../Http";
import CourseHead from "../../../components/course/CourseHead/CourseHead";
import WordsTable from "../../../components/course/WordsTable/WordsTable";
import { AppContext } from "../../../context/AppContext";
import EditingNavBar from "../../../components/EditCourse/EditingNavBar/EditingNavBar";
import AddWordsRow from "../../../components/EditCourse/AddWordsRow/AddWordsRow";
import { bindParams } from "../../../config/function";
import EditCourseInfor from "./item/EditCourseInfor";
import QuestionExams from "./item/QuestionExams";

const CourseEdit = () => {
  const { t } = useTranslation("common");
  const history = useHistory();
  const { courseId } = useParams();
  const { user_info } = useContext(AppContext);
  const [loading, setLoading] = useState(false);
  const [course, setCourse] = useState({});
  const [tab, setTab] = useState("0");

  useEffect(() => {
    loadCourse();
  }, []);

  const checkIfOwner = (course) => {
    if (user_info?._id && course?.owner?._id !== user_info?._id) {
      history.goBack();
    }
  };

  const loadCourse = () => {
    setLoading(true);
    postAxios(API_COURSE_DETAIL, { id: courseId })
      .then((res) => {
        const courseDetail = res?.data;
        if (courseDetail) {
          const words = courseDetail?.words
            ? JSON.parse(courseDetail.words)
            : [];
          courseDetail.words = words;
          checkIfOwner(courseDetail);
          setCourse(courseDetail);
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
      .then(() => setLoading(false));
  };

  const addNewWord = (word, description) => {
    const words = course.words || [];
    words.push({
      name: word,
      description: description,
    });
    setCourse({ ...course, words: words });
    updateWords(words);
  };

  const removeWord = (pair) => {
    const words = course.words;
    const index = words.indexOf(pair);
    if (index !== -1) {
      words.splice(index, 1);
    }
    setCourse({ ...course, words: words });
    updateWords(words);
  };

  const updateWords = (words) => {
    postAxios(API_UPDATE_WORDS, {
      courseId: courseId,
      words: JSON.stringify(words),
    })
      .then((res) => {})
      .catch((error) => {
        const { response } = error;
        notification.error({
          message: response?.data?.message
            ? `${t("common:server_error")}: ${response?.data?.message}`
            : t("common:msg_please_try_again"),
        });
      });
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
          <CourseHead {...course} edit />
          <EditingNavBar
            goBack={() =>
              history.push(bindParams(COURSE_DETAIL_PATH, { courseId }))
            }
            courseId={courseId}
            name={course.name}
            description={course.description}
            createBy={course.owner?.username}
            setTab={setTab}
          />
          {course && tab === "0" && (
            <WordsTable removeWord={removeWord} {...course}>
              <AddWordsRow addNewWord={addNewWord} />
            </WordsTable>
          )}
          {tab === "1" && <EditCourseInfor course={course} />}
          {tab === "2" && <QuestionExams course={course} />}
        </Layout>
      )}
    </PrivateLayout>
  );
};

export default CourseEdit;
