import { notification } from "antd";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { API_COURSE_DETAIL, API_GET_MY_COURSE } from "../config/endpointApi";
import { postAxios } from "../Http";

const useGetMyCourse = (userId) => {
  const [isLoading, setIsLoading] = useState(false);
  const [myCourses, setMyCourses] = useState([]);
  const { t } = useTranslation("common");

  useEffect(() => {
    setIsLoading(true);
    postAxios(API_GET_MY_COURSE, { userId })
      .then((res) => {
        console.log("in my course", res?.data);
        setMyCourses(res?.data);
      })
      .catch((error) => {
        notification.error({
          message: t("Đã có lỗi xảy ra, vui lòng thử lại sau."),
        });
      })
      .then(() => setIsLoading(false));
  }, [userId]);

  return [isLoading, myCourses];
};
export default useGetMyCourse;
