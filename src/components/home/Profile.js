import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import img from "../../assets/img/avatar-2.png";
import "./Profile.scss";

const Profile = (props) => {
  const { t } = useTranslation("common");

  return (
    <div className={"Profile"}>
      <div className={"ProfileHeader"}>
        <div className={"UserName"}>{props.username}</div>
        <div className={"Level"}>LEVEL {props.level}</div>
        <div className={"ImageWrapper"}>
          <img src={img} className={"ProfileImage"} alt="" />
        </div>
      </div>
      <div className={"ProfileStats"}>
        <div className={"StatsWrapper"}>
          <div className={"StatsNumber"}>{props.wordsLearned}</div>
          <div className={"StatsLabel"}>words learned</div>
        </div>
        <div className={"StatsSeparator"} />
        <div className={"StatsWrapper"}>
          <div className={"StatsNumber"}>{props.points}</div>
          <div className={"StatsLabel"}>points</div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
