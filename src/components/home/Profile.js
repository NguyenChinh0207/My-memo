import React from "react";
import { useTranslation } from "react-i18next";
import img from "../../assets/img/avatar.png";
import "./Profile.scss";

const Profile = (props) => {
  const { t } = useTranslation("common");

  return (
    <div className={"LeftColumnProfile"}>
      <div className={"Profile"}>
        <div className={"ProfileHeader"}>
          <div className={"UserName"}></div>
          <div className={"Level"}>
            {t("level")} {props.level}
          </div>
          <div className={"ImageWrapper"}>
            <img src={img} className={"ProfileImage"} alt="" />
          </div>
        </div>
        <div className={"ProfileStats"}>
          <div className={"StatsWrapper"}>
            <div className={"StatsNumber"}>{props.wordsLearned}</div>
            <div className={"StatsLabel"}>{t("words_learn")}</div>
          </div>
          <div className={"StatsSeparator"} />
          <div className={"StatsWrapper"}>
            <div className={"StatsNumber"}>{props.points}</div>
            <div className={"StatsLabel"}>{t("point")}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
