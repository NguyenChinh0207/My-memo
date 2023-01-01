import React from "react";
import PropTypes from "prop-types";
import styles from "./EditingNavBar.module.css";
import { useTranslation } from "react-i18next";

const EditingNavBar = (props) => {
  const { t } = useTranslation("common");
  return (
    <div className={styles.EditingNavBar}>
      <div className={styles.Row}>
        <div className={styles.Title}>{t("editing")}</div>
        <div onClick={props.goBack} className={styles.BackBtn}>
          <span className={styles.LeftArrow} />
          {t("back_to_course")}
        </div>
      </div>
    </div>
  );
};

export default React.memo(EditingNavBar);

EditingNavBar.propTypes = {
  goBack: PropTypes.func.isRequired,
};
