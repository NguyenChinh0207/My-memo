import { notification } from "antd";
import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { API_COURSE_DETAIL, API_GET_MY_COURSE, API_USER_EDIT } from "../config/endpointApi";
import { getUserInfo } from "../config/function";
import { AppContext } from "../context/AppContext";
import { postAxios } from "../Http";

const useGetMyCourse = (loadMyCourses = false) => {
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation("common");
  const {user_info} = useContext(AppContext)
  const userId = getUserInfo()?._id;
  const [myCourses, setMyCourses] = useState([]);
  const [progress, setProgress] = useState();
  const [level, setLevel] = useState(1);
  const [points, setPoints] = useState(0);
  const [wordsLearned, setWordsLearned] = useState(0);

  useEffect(() => {
    setIsLoading(true);
    loadData();
  }, [userId]);

  useEffect(() => {
    setIsLoading(true);
    if (loadMyCourses) {
      loadData();
    }
  }, [loadMyCourses]);

  const updateUser = (wordsLearned, points) => {
    postAxios(API_USER_EDIT, {
      _id: user_info?._id,
      wordsLearned: wordsLearned,
      points: points,
    })
      .then((res) => {})
      .catch((error) => {
        const { response } = error;
        notification.error({
          message: response?.data?.message
            ? `${t("Đã có lỗi xảy ra")}: ${response?.data?.message}`
            : t("Đã có lỗi xảy ra, vui lòng thử lại sau."),
        });
      });
  };

  const loadData = () => {
    postAxios(API_GET_MY_COURSE, { userId })
      .then((res) => {
        if (res.data) {
          const obj = res.data;
          const courses = obj.courses;
          let progress = {};
          if (obj.progress !== "") {
            try {
              progress = JSON.parse(obj.progress);
            } catch (e) {
              progress = {};
            }
          }
          let totalWordsLearned = 0;
          const coursesF = [];
          for (let c of courses) {
            const words = c?.words ? JSON.parse(c.words) : [];
            const totalWords = words.length;
            let wordsLearned = 0;
            if (progress?.[c._id]) {
              wordsLearned = progress[c._id].wordsLearned;
            }
            if (wordsLearned > totalWords) {
              wordsLearned = totalWords;
            }
            const course = {
              _id: c._id,
              name: c.name,
              wordsLearned: wordsLearned,
              totalWords: totalWords,
            };
            coursesF.push(course);
            totalWordsLearned += wordsLearned;
          }
          const level = 1;
          const points = totalWordsLearned * 100;
          updateUser(totalWordsLearned, points);
          setMyCourses(coursesF);
          setLevel(level);
          setPoints(points);
          setProgress(progress);
          setWordsLearned(totalWordsLearned);
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
      .then(() => setIsLoading(false));
  };

  const data = { myCourses, progress, wordsLearned, level, points };
  return [isLoading, data];
};
export default useGetMyCourse;
