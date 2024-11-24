// src/hooks/useCourseOptions.js
import { useTranslation } from "react-i18next";

export const useCourseStatusOptions = () => {
  const { t } = useTranslation("course");

  const ACTIVE_COURSE_OPTIONS = [
    {
      label: t("active"), // Dùng hook t() để lấy chuỗi ngôn ngữ
      value: 1,
    },
    {
      label: t("deactive"), // Dùng hook t() để lấy chuỗi ngôn ngữ
      value: 0,
    },
  ];
  return ACTIVE_COURSE_OPTIONS;
};
