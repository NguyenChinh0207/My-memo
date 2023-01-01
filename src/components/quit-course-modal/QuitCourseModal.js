import React from "react";
import "./QuitCourseModal.scss";

const QuitCourseModal = (props) => (
  <div className="ModalQuitCourse">
    <div className="Full">
      <div className="ModalDialog">
        <div className="Modal">
          <div className="ModalHeader">Quit this course</div>
          <div className="ModalBody">Are you sure you would like to quit?</div>
          <div className="ModalFooter">
            <div onClick={props.closeModal} className="Button">
              No
            </div>
            <div onClick={props.quitCourse} className="Button YesButton">
              Yes
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default React.memo(QuitCourseModal);
