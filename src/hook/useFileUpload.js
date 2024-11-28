import { notification } from "antd";
import { API_UPLOAD_FILE } from "../config/endpointApi";
import { postAxios } from "../Http";
import { useTranslation } from "react-i18next";

export const useFileUpload = () => {
  const { t } = useTranslation("course");

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];

    if (file) {
      // check type
      const isImage = file.type.startsWith("image/");
      const isVideo = file.type.startsWith("video/");

      if (!isImage && !isVideo) {
        notification.error({
          message: t("msg_file_invalid"),
        });
        return ""; 
      }

      // Create formdata send file
      const formData = new FormData();
      formData.append("file", file);

      try {
        const apiUrl = API_UPLOAD_FILE; 

        const res = await postAxios(apiUrl, formData, {
          headers: { "Content-Type": "multipart/form-data" }, 
        });

        notification.success({
          message: t(
            isImage ? t("upload_image_success") : t("upload_video_success")
          ),
        });

        return res.data?.filePath;
      } catch (error) {
        notification.error({
          message: t(
            isImage ? t("upload_image_failed") : t("upload_video_failed")
          ),
        });
        return ""; 
      }
    } else {
      console.error("No file selected");
      return ""; 
    }
  };

  return { handleFileUpload };
};
