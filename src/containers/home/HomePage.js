import React, { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import LeftColumn from "../../components/home/LeftColumn";
import "./HomePage.scss";
import PrivateLayout from "../../layout/PrivateLayout";
import { Layout, notification, Spin } from "antd";
import Welcome from "../../components/home/Welcome";
import {
  API_ACTION_MY_COURSE,
  API_GET_MY_COURSE,
} from "../../config/endpointApi";
import { AppContext } from "../../context/AppContext";
import { postAxios } from "../../Http";
import CourseCard from "../../components/home/CourseCard";
import { bindParams } from "../../config/function";
import { COURSE_LEARN_PATH } from "../../config/path";

const HomePage = () => {
  const { t } = useTranslation("common");
  const { user_info } = useContext(AppContext);
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [myCourses, setMyCourses] = useState([]);

  useEffect(() => {
    loadCourses();
    return () => setMyCourses([]);
  }, []);

  const loadCourses = () => {
    setLoading(true);
    postAxios(API_GET_MY_COURSE, { userId: user_info?._id })
      .then((res) => {
        setMyCourses(res?.data?.courses);
      })
      .catch((error) => {
        notification.error({
          message: t("Đã có lỗi xảy ra, vui lòng thử lại sau."),
        });
      })
      .then(() => setLoading(false));
  };

  const quitCourse = (courseId) => {
    setLoading(true);
    postAxios(`${API_ACTION_MY_COURSE}/remove`, {
      userId: user_info?._id,
      courseId: courseId,
    })
      .then((res) => {
        setLoading(false);
        loadCourses();
      })
      .catch((error) => {
        notification.error({
          message: t("Đã có lỗi xảy ra, vui lòng thử lại sau."),
        });
      })
      .then(() => setLoading(false));
  };

  const learn = (courseId) => {
    history.push(bindParams(COURSE_LEARN_PATH, { courseId: courseId }));
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
        <Layout className="Layout-bg">
          <div className={"Content"}>
            <div className={"ContainerMain"}>
              <LeftColumn profile={""} />
              <div className={"RightColumn"}>
                {myCourses && myCourses.length > 0 ? (
                  myCourses.map((course) => (
                    <CourseCard
                      key={course._id}
                      courseId={course._id}
                      learn={() => learn(course._id)}
                      course={course}
                      quitCourse={quitCourse}
                    />
                  ))
                ) : (
                  <Welcome />
                )}
              </div>
            </div>
          </div>
        </Layout>
      )}
    </PrivateLayout>
  );
};

export default HomePage;
