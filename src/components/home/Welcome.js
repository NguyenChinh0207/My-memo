import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { COURSES_PATH } from "../../config/path";
import { Link } from "react-router-dom";
import './Welcome.scss';

const Welcome = () => {
  const { t } = useTranslation("common");

  return (
    <div className={"WelcomeCard"}>
      <div className={"TextWrapper"}>
        <div className={"Title"}> Welcome to My-memo! </div>
        Pick a course and start learning.
      </div>
      <div className={"BtnWrapper"}>
        <Link to={COURSES_PATH} className={"CoursesBtn"}>
          Pick a course
        </Link>
      </div>
    </div>
  );
};

export default Welcome;
