import React from "react";
import PropTypes from "prop-types";
import "./SessionComplete.scss";
import { useTranslation } from "react-i18next";

const SessionComplete = (props) => {
  const { t } = useTranslation("course");
  return (
    <React.Fragment>
      <div className="SessionComplete">
        {props.courseFinished ? (
          <div className="Content">{t("course_complete")}</div>
        ) : (
          <div className="Content">{t("goal_complete")}</div>
        )}
        <div onClick={props.home} className="NextButton">
          <div className="BtnText">{t("course")}</div>
          <div className="RightArrow" />
        </div>
      </div>
    </React.Fragment>
  );
};

export default React.memo(SessionComplete);

SessionComplete.propTypes = {
  home: PropTypes.func.isRequired,
  courseFinished: PropTypes.bool,
};
