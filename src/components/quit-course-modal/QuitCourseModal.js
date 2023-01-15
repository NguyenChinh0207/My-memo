import React from "react";
import { useTranslation } from "react-i18next";
import "./QuitCourseModal.scss";

const QuitCourseModal = (props) => {
  const { t } = useTranslation("common");
  return (
    <div className="ModalQuitCourse">
      <div className="Full">
        <div className="ModalDialog">
          <div className="Modal">
            <div className="ModalHeader">{t("Rời khỏi khóa học")}</div>
            <div className="ModalBody">
              {t("Bạn có chắc chắn muốn rời khỏi khóa học")}
            </div>
            <div className="ModalFooter">
              <div onClick={props.closeModal} className="Button">
                {t("Không")}
              </div>
              <div onClick={props.quitCourse} className="Button YesButton">
                {t("Có")}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(QuitCourseModal);
