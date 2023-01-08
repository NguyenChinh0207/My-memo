import React from "react";
import PropTypes from "prop-types";

import "./CourseHead.scss";
import Spinner from "../../spinner/Spinner";
import { useTranslation } from "react-i18next";
import { Button, Image } from "antd";
import logoCourses from "../../../assets/img/logoCourses.png";

const CourseHead = (props) => {
  const { t } = useTranslation("common");
  const { name, description, owner, edit } = props;
  return (
    <div className="CourseHead">
      {edit ? (
        <div className="PageHeadEdit">
          <div className="PageHeadRowEdit">
            {props.name ? (
              <React.Fragment>
                <div className="course-detail-wrapper-edit">
                  <img
                    className="imgCourseDetailEdit"
                    alt="example"
                    src={logoCourses}
                  />
                  <div className="CourseDetails">
                    <div className="TitleCourseEdit">{name}</div>
                  </div>
                </div>
                <div className="CreatedByDiv">
                  <span className="CreatedBySpan">{t("created_by")} </span>
                  <span className="Owner">{owner?.username}</span>
                </div>
              </React.Fragment>
            ) : (
              <Spinner />
            )}
          </div>
        </div>
      ) : (
        <div className="PageHead">
          <div className="PageHeadRow">
            {props.name ? (
              <React.Fragment>
                <div className="course-detail-wrapper">
                  <Image
                    className="imgCourseDetail"
                    alt="example"
                    src={logoCourses}
                  />
                  <div className="CourseDetails">
                    <h1 className="TitleCourse">{name}</h1>
                    <div className="Description">{description}</div>
                  </div>
                </div>
                <div className="CreatedByDiv">
                  <span className="CreatedBySpan">{t("created_by")} </span>
                  <span className="Owner">{owner?.username}</span>
                </div>
              </React.Fragment>
            ) : (
              <Spinner />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default React.memo(CourseHead);

CourseHead.propTypes = {
  name: PropTypes.string,
  description: PropTypes.string,
  owner: PropTypes.object,
};
