import React from "react";
import PropTypes from "prop-types";
import "./Header.scss";
import { useTranslation } from "react-i18next";

const Header = (props) => {
  const { t } = useTranslation("common");
  const progress = (100 * (props.totalTurns - props.turns)) / props.totalTurns;
  const progressWidth = { width: progress + "%" };
  return (
    <div className="HeaderLearn">
      <div className="Header">
        <div className="HeaderRow">
          <div className="LeftColumn">
            <div className="LearningIcon" />
          </div>
          <div className="CenterColumn">
            <div className="HeaderText">
              {props.name} - {t("learn_new_words")}
            </div>
            <div className="ProgressBar">
              <div style={progressWidth} className="Progress" />
            </div>
          </div>
          <div className="RightColumn">
            <div onClick={props.close} className="CloseButton" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(Header);

Header.propTypes = {
  name: PropTypes.string.isRequired,
  close: PropTypes.func.isRequired,
  totalTurns: PropTypes.number.isRequired,
  turns: PropTypes.number.isRequired,
};
