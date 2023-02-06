import { Button } from "antd";
import React from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { ADMIN_ID } from "../../../../config/const";
import { bindParams } from "../../../../config/function";
import { COURSE_EDIT_PATH } from "../../../../config/path";
import "./Units.scss";

export const RenderSkills = (items) => {
  console.log("in item", items);
  const { t } = useTranslation("common");
  const history = useHistory();

  return <>In vào skill</>;
};
