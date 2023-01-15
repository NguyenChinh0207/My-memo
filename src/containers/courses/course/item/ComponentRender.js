import { Button } from "antd";
import React from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { bindParams } from "../../../../config/function";
import { COURSE_EDIT_PATH } from "../../../../config/path";
import "../CourseDetail.scss";

export const ComponentRender = (items) => {
  const { t } = useTranslation("common");
  const history = useHistory();

  return (
    <>
      <div className="SecondHeader">
        <div className="Row">
          {items.added ? (
            <div className="RemoveButton" onClick={items.openModal}>
              {t("quit_course")}
            </div>
          ) : (
            <Button
              className="StartButton"
              onClick={() => items.updateCourse("add")}
            >
              {t("add_to_my_courses")}
            </Button>
          )}
          {items.owner && (
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
              {t("Chỉnh sửa khóa học")}
            </div>
          )}
        </div>
      </div>
      {items.added && (
        <div className="ProgressDiv">
          <div className="WordsLearned">
            {items.wordsLearned} / {items.course.totalWords} {t("words_learn")}
          </div>
          <div className="ProgressBar">
            <div style={items.progressWidth} className="Progress" />
          </div>
          {items.progress === 100 && (
            <div className="CourseCompleted">{t("course_complete")}</div>
          )}
          <Button onClick={items.learn} className={items.learnBtnClasses}>
            {t("learn")}
          </Button>
        </div>
      )}
    </>
  );
};
