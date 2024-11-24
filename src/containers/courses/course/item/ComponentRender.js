import React, { useContext } from "react";
import { Button } from "antd";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { bindParams } from "../../../../config/function";
import { COURSE_EDIT_PATH } from "../../../../config/path";
import { AppContext } from "../../../../context/AppContext";
import "../CourseDetail.scss";

export const ComponentRender = (items) => {
  const { t } = useTranslation("course");
  const history = useHistory();
  const { user_info } = useContext(AppContext);

  return (
    <>
      <div className="SecondHeader">
        <div className="Row">
          {items?.course?.owner?._id !== user_info._id && (
            <>
              {items.added ? (
                <div className="RemoveButton" onClick={items.openModal}>
                  {t("leave_course")}
                </div>
              ) : (
                <Button
                  className="StartButton"
                  onClick={() => items.updateCourse("add")}
                >
                  {t("add_to_my_courses")}
                </Button>
              )}
            </>
          )}
          {items.owner && items?.course?.owner?._id == user_info._id && (
            <div
              onClick={() =>
                history.push(
                  bindParams(COURSE_EDIT_PATH, {
                    courseId: items.courseId,
                  })
                )
              }
              className="EditBtn"
            >
              {t("edit_course")}
            </div>
          )}
        </div>
      </div>
      {items?.added && items?.course?.owner?._id !== user_info._id && (
        <div className="ProgressDiv">
          <div className="WordsLearned">
            {items.wordsLearned} / {items.course.totalWords}{" "}
            {t("words_learned")}
          </div>
          <div className="ProgressBar">
            <div style={items.progressWidth} className="Progress" />
          </div>
          {items.progress === 100 && (
            <div className="CourseCompleted">{t("course_complete")}</div>
          )}
          <Button onClick={items.learn} className={items.learnBtnClasses}>
            {t("start_pratice")}
          </Button>
        </div>
      )}
    </>
  );
};
