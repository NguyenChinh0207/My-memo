import React, { Suspense, useState } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { Link, useHistory } from "react-router-dom";
import "./CourseCard.scss";
import img from "../../assets/img/lean.jpg";
import { COURSE_DETAIL_PATH, COURSE_LEARN_PATH } from "../../config/path";
import { bindParams } from "../../config/function";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { Modal } from "antd";

const CourseCard = (props) => {
  const { t } = useTranslation("common");
  const { loading, course, courseId } = props;
  const history = useHistory();
  const { confirm } = Modal;

  const openModal = () => {
    confirm({
      title: `${t("Bạn có chắc chắn muốn rời khỏi khóa học?")}`,
      icon: <ExclamationCircleFilled />,
      onOk: () => props.quitCourse(courseId),
      onCancel: () => {},
    });
  };

  const learnClick = () => {
    if (Number(course.totalWords) !== 0) {
      history.push(bindParams(COURSE_LEARN_PATH, { courseId: courseId }));
    }
  };

  if (loading) {
    return <div className={"CourseCard LoadingBox"} />;
  } else {
    let progress = 0;
    let nextUpButtonClasses = "NextUpButton Disabled";

    if (Number(course.totalWords) !== 0) {
      progress =
        (100 * Number(course.wordsLearned)) / Number(course.totalWords);
      nextUpButtonClasses =
        progress === 100 ? "NextUpButton Disabled" : "NextUpButton";
    }
    const progressWidth = { width: progress + "%" };
    console.log("in ", progress, progressWidth);

    return (
      <div className={"CourseCard"}>
        <div className={"CardTop"}>
          <div className={"ImgWrapper"}>
            <img src={img} className={"Image"} alt="" />
          </div>
          <div className={"CardMainContainer"}>
            <div className={"TitleRow"}>
              <Link
                className={"CourseTitle"}
                to={bindParams(COURSE_DETAIL_PATH, {
                  courseId: courseId,
                })}
              >
                {course.name}
              </Link>
              <div className={"MoreOptionsDiv"}>
                <div className={"MoreOptionsButton"} />
                <div className={"TooltipWrapper"}>
                  <ul className={"Tooltip"}>
                    <li>
                      <Link
                        className={"TooltipLink"}
                        to={bindParams(COURSE_DETAIL_PATH, {
                          courseId: course._id,
                        })}
                      >
                        {t("course_detail")}
                      </Link>
                    </li>
                    <li>
                      <div onClick={openModal} className={"TooltipLink"}>
                        {t("quit_course")}
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className={"WordsLearned"}>
              {course.wordsLearned}/{course.totalWords} {t("words_learn")}
            </div>
            <div className={"ProgressBar"}>
              <div style={progressWidth} className={"Progress"} />
            </div>
            {progress === 100 && (
              <div className={"CourseCompleted"}>{t("course_complete")}</div>
            )}
          </div>
        </div>
        <div className={"CardBottom"}>
          <div onClick={learnClick} className={nextUpButtonClasses}>
            <div className={"LearnIcon"} />
            <div className={"NextUpLabel"}>
              <div className={"NextUpText"}>{t("next_up")}</div>
              <div>{t("learn_new_words")}</div>
            </div>
            <div className={"NextUpArrow"} />
          </div>
        </div>
      </div>
    );
  }
};

export default CourseCard;
const conditionalCheck = function (props, propName, componentName) {
  if (!props.loading && !props[propName]) {
    return new Error(
      "Invalid prop `" +
        propName +
        "` supplied to" +
        " `" +
        componentName +
        "`. Validation failed."
    );
  }
};

CourseCard.propTypes = {
  loading: PropTypes.bool,
  course: conditionalCheck,
  quitCourse: conditionalCheck,
};

CourseCard.defaultProps = {
  loading: false,
};
