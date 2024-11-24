import React, { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import "./HomePage.scss";
import PrivateLayout from "../../layout/PrivateLayout";
import { Layout, notification, Spin } from "antd";
import Welcome from "../../components/home/Welcome";
import { API_ACTION_MY_COURSE } from "../../config/endpointApi";
import { AppContext } from "../../context/AppContext";
import { postAxios } from "../../Http";
import CourseCard from "../../components/home/CourseCard";
import { bindParams } from "../../config/function";
import { COURSE_LEARN_PATH } from "../../config/path";
import useGetMyCourse from "../../hook/useGetMyCourse";
import Profile from "../../components/home/Profile";

const HomePage = () => {
  const { t } = useTranslation("common");
  const { user_info } = useContext(AppContext);
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [loadMyCourses, setLoadMyCourses] = useState(false);
  const [isLoading, data] = useGetMyCourse(loadMyCourses);

  const quitCourse = (courseId) => {
    setLoading(true);
    setLoadMyCourses(false);
    postAxios(`${API_ACTION_MY_COURSE}/remove`, {
      userId: user_info?._id,
      courseId: courseId,
    })
      .then((res) => {
        setLoadMyCourses(true);
        setLoading(false);
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

  const learn = (courseId) => {
    history.push(bindParams(COURSE_LEARN_PATH, { courseId: courseId }));
  };

  return (
    <PrivateLayout>
      {loading || isLoading ? (
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
              <Profile
                level={data.level}
                points={data.points}
                wordsLearned={data.wordsLearned}
              />
              <div className={"RightColumn"}>
                {data.myCourses && data.myCourses.length > 0 ? (
                  data.myCourses.map((course) => (
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
