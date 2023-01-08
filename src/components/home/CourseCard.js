import React, { useState } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import "./CourseCard.scss";
import img from "../../assets/img/lean.jpg";
import { COURSE_DETAIL_PATH } from "../../config/path";
import { bindParams } from "../../config/function";
const QuitCourseModal = React.lazy(() =>
  import("../quit-course-modal/QuitCourseModal")
);
const CourseCard = (props) => {
  const { t } = useTranslation("common");
  const { loading, course } = props;
  const [modal, setModal] = useState(false);
  const history = useHistory();

  const openModal = () => {
    setModal(true);
  };

  const closeModal = () => {
    setModal(false);
  };

  const learnClick = () => {
    if (Number(course.totalWords) !== 0) {
      history.push(`/learn/${course.id}`);
    }
  };

  if (loading) {
    return (
      <div className={"CourseCard LoadingBox"} />
    );
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

    return (
      <div className={"CourseCard"}>
        {modal && (
          <Suspense fallback={null}>
            <QuitCourseModal
              closeModal={closeModal}
              quitCourse={() => quitCourse(course.id)}
            />
          </Suspense>
        )}
        <div className={"CardTop"}>
          <div className={"ImgWrapper"}>
            <img src={img} className={"Image"} alt="" />
          </div>
          <div className={"CardMainContainer"}>
            <div className={"TitleRow"}>
              "Title"
              <Link
                className={"CourseTitle"}
                to={bindParams(COURSE_DETAIL_PATH, {
                  courseId: course.id,
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
                          courseId: course.id,
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
              {course.wordsLearned}/{course.totalWords} words learned
            </div>
            <div className={"ProgressBar"}>
              <div style={progressWidth} className={"Progress"} />
            </div>
            {progress === 100 && (
              <div className={"CourseCompleted"}>Course completed!</div>
            )}
          </div>
        </div>
        <div className={"CardBottom"}>
          <div onClick={learnClick} className={nextUpButtonClasses}>
            <div className={"LearnIcon"} />
            <div className={"NextUpLabel"}>
              <div className={"NextUpText"}>NEXT UP</div>
              <div>Learn new words</div>
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
  learn: conditionalCheck,
  quitCourse: conditionalCheck,
};

CourseCard.defaultProps = {
  loading: false,
};

