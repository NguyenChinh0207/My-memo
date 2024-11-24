import { notification } from "antd";
import { postAxios } from "../Http"; // Adjust based on your imports
import { API_LESSON_CREATE, API_LESSON_EDIT, API_UNIT_CREATE, API_UNIT_EDIT } from "../config/endpointApi"; // Adjust paths
import { useHistory } from "react-router-dom"; // Adjust if using react-router-dom

export const useLessonAction = () => {
  const history = useHistory();

  const handleLessonAction = async (lessonId, body, t, setLoading) => {
    setLoading(true); // Start loading

    try {
      const apiEndpoint = !lessonId ? API_LESSON_CREATE : API_LESSON_EDIT; // Chọn API phù hợp
      await postAxios(apiEndpoint, body);

      notification.success({
        message: !lessonId
          ? t("course:create_lesson_success")
          : t("course:edit_lesson_success"),
      });

      // Quay lại trang trước
      history.goBack();
    } catch (error) {
      const { response } = error;

      // Hiển thị thông báo lỗi
      notification.error({
        message: response?.data?.message
          ? `${t("common:server_error")}: ${response?.data?.message}`
          : t("common:msg_please_try_again"),
      });
    } finally {
      setLoading(false); // Tắt loading bất kể thành công hay thất bại
    }
  };

  return {
    handleLessonAction,
  };
};
