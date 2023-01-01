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
          Có vẻ như bạn chưa chọn khóa học nào! Một thế giới vô vàn thứ để học
          đang chờ bạn khám phá đấy! Hãy nhấn vào nút bên cạnh và chọn hành
          trình học tiếp theo của bạn nào.
        </p>
      </div>
      <div className={"BtnWrapper"}>
        <NavLink to={COURSES_PATH} className={"CoursesBtn"}>
          Tìm khóa học
        </NavLink>
      </div>
    </div>
  );
};

export default Welcome;
