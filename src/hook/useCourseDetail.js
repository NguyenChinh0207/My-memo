import { useState } from "react";
import { useHistory } from "react-router-dom";
import { notification } from "antd";
import { API_COURSE_DETAIL } from "../config/endpointApi";
import { postAxios } from "../Http";

const useCourseDetail = (courseId, t, setLoading) => {
  const [course, setCourse] = useState(null);
  const history = useHistory();

  const fetchCourseDetail = async () => {
    setLoading(true);
    try {
      const res = await postAxios(API_COURSE_DETAIL, { id: courseId });

      const courseData = res?.data;
      if (courseData) {
        courseData.words = courseData.words ? JSON.parse(courseData.words) : [];
        setCourse(courseData);
      }
    } catch (error) {
      const { response } = error;
      notification.error({
        message: response?.data?.message
          ? `${t("common:server_error")}: ${response?.data?.message}`
          : t("common:msg_please_try_again"),
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch course detail when the courseId changes or on initial load
  useState(() => {
    fetchCourseDetail();
  }, [courseId]);

  return { course };
};

export default useCourseDetail;
