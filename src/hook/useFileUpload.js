import { notification } from "antd";
import { API_UPLOAD_FILE } from "../config/endpointApi";
import { postAxios } from "../Http";
import { useTranslation } from "react-i18next";

export const useFileUpload = () => {
  const { t } = useTranslation("course");

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];

    if (file) {
      // Kiểm tra loại tệp
      const isImage = file.type.startsWith("image/");
      const isVideo = file.type.startsWith("video/");

      if (!isImage && !isVideo) {
        notification.error({
          message: t("msg_file_invalid"),
        });
        return ""; // Trả về chuỗi rỗng nếu file không hợp lệ
      }

      // Tạo FormData để gửi tệp
      const formData = new FormData();
      formData.append("file", file);

      try {
        const apiUrl = API_UPLOAD_FILE; // Chọn API phù hợp

        const res = await postAxios(apiUrl, formData, {
          headers: { "Content-Type": "multipart/form-data" }, // Đảm bảo header đúng
        });

        notification.success({
          message: t(
            isImage ? t("upload_image_success") : t("upload_video_success")
          ),
        });

        // Trả về đường dẫn file (giả định API trả về `filePath`)
        return res.data?.filePath;
      } catch (error) {
        notification.error({
          message: t(
            isImage ? t("upload_image_failed") : t("upload_video_failed")
          ),
        });
        return ""; // Trả về chuỗi rỗng nếu gặp lỗi
      }
    } else {
      console.error("No file selected");
      return ""; // Trả về chuỗi rỗng nếu không có file nào được chọn
    }
  };


  return { handleFileUpload };
};
