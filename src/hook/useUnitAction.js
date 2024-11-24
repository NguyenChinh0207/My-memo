import { notification } from "antd";
import { postAxios } from "../Http"; // Adjust based on your imports
import {
  API_UNIT_CREATE,
  API_UNIT_EDIT,
} from "../config/endpointApi"; // Adjust paths
import { useHistory } from "react-router-dom"; // Adjust if using react-router-dom

export const useUnitAction = () => {
  const history = useHistory();

  const handleUnitAction = async (unitId, body, t, setLoading) => {
    setLoading(true); // Start loading

    try {
      const apiEndpoint = unitId ? API_UNIT_EDIT : API_UNIT_CREATE; // Chọn API phù hợp
      await postAxios(apiEndpoint, body);

      // Hiển thị thông báo thành công
      notification.success({
        message: unitId
          ? t("course:edit_unit_success")
          : t("course:create_unit_success"),
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
    handleUnitAction,
  };
};
