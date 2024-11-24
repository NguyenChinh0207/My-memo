import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { COURSES_PATH } from "../../config/path";
import { Link, NavLink } from "react-router-dom";
import './Welcome.scss';
import img from "../../assets/img/rocket.png";

const Welcome = () => {
  const { t } = useTranslation("common");

  return (
    <div className={"WelcomeCard"}>
      <div className={"TextWrapper"}>
        <div className={"wellcome-title"}>
          {t("welcome")}
          <div className={"IconWelcome"}>
            <img src={img} className={"imgTitle"} />
          </div>
        </div>
        <p className={"Description"}>
          {t("begin_text")}
        </p>
      </div>
      <div className={"BtnWrapper"}>
        <NavLink to={COURSES_PATH} className={"CoursesBtn"}>
          {t("search_course")}
        </NavLink>
      </div>
    </div>
  );
};

export default Welcome;
