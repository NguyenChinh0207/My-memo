import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import "./CourseCard.scss";

const CourseCard = () => {
  const { t } = useTranslation("common");

  return (
    <div className={"CourseCard"}>
      {/* {this.state.modal && (
        <Suspense fallback={null}>
          <QuitCourseModal
            closeModal={this.closeModal}
            quitCourse={() => this.props.quitCourse(course.id)}
          />
        </Suspense>
      )} */}
      <div className={"CardTop"}>
        <div className={"ImgWrapper"}>
          <img src={img} className={"Image"} alt="" />
        </div>
        <div className={"CardMainContainer"}>
          <div className={"TitleRow"}>
            "Title"
            {/* <Link className={"CourseTitle"} to={"/course/" + course.id}>
              {course.name}
            </Link> */}
            <div className={"MoreOptionsDiv"}>
              <div className={"MoreOptionsButton"} />
              <div className={"TooltipWrapper"}>
                <ul className={"Tooltip"}>
                  <li>
                    <Link className={"TooltipLink"} to={"/course/" + course.id}>
                      Course details
                    </Link>
                  </li>
                  <li>
                    <div onClick={this.openModal} className={"TooltipLink"}>
                      Quit course
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
        {/* <div className={"MoreButton + ' ' + "Disabled}>
							<div className={"MoreButtonIcon} />
							<div className={"MoreButtonText}>More</div>
						</div> */}
        <div onClick={() => this.learn()} className={nextUpButtonClasses}>
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
};

export default CourseCard;
