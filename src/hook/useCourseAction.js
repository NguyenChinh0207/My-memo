import { notification } from "antd";
import { postAxios } from "../Http"; // Adjust based on your imports
import { API_COURSE_CREATE, API_COURSE_EDIT } from "../config/endpointApi"; // Adjust paths
import { ADMIN_MY_COURSE_DETAIL_PATH, ADMIN_MY_COURSE_LIST_PATH, COURSE_DETAIL_PATH } from "../config/path";
import { useHistory } from "react-router-dom"; // Adjust if using react-router-dom
import { bindParams } from "../config/function";

export const useCourseAction = () => {
  const history = useHistory();

  const handleCourseAction = async (courseId, body, t, setLoading) => {
    setLoading(true); // Start loading

    try {
      // Determine API endpoint based on whether it's a new course or an edit
      const apiEndpoint = courseId ? API_COURSE_EDIT : API_COURSE_CREATE;

      const res = await postAxios(apiEndpoint, body);

      notification.success({
        message: courseId
          ? t("course:msg_edit_course_success")
          : t("course:msg_create_course_success"),
      });

      history.push(
        bindParams(COURSE_DETAIL_PATH, { courseId: courseId || res?.data?._id})
      );
    } catch (error) {
      const { response } = error;
      notification.error({
        message: response?.data?.message
          ? `${t("common:server_error")}: ${response?.data?.message}`
          : t("common:msg_please_try_again"),
      });
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const handleAdminCourseAction = async (courseId, body, t, setLoading) => {
    setLoading(true); // Start loading

    try {
      // Determine API endpoint based on whether it's a new course or an edit
      const apiEndpoint = courseId ? API_COURSE_EDIT : API_COURSE_CREATE;

      const res = await postAxios(apiEndpoint, body);

      notification.success({
        message: courseId
          ? t("course:msg_edit_course_success")
          : t("course:msg_create_course_success"),
      });

      history.push({
        pathname: bindParams(
          courseId ? ADMIN_MY_COURSE_DETAIL_PATH : ADMIN_MY_COURSE_LIST_PATH,
          { courseId: courseId }
        ),
        state: { detail: res?.data }, 
      });
    } catch (error) {
      const { response } = error;
      notification.error({
        message: response?.data?.message
          ? `${t("common:server_error")}: ${response?.data?.message}`
          : t("common:msg_please_try_again"),
      });
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return {
    handleCourseAction,
    handleAdminCourseAction,
  };
};
