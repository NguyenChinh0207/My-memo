import React from "react";
import PropTypes from "prop-types";

import "./ExamHeader.scss";
import Spinner from "../spinner/Spinner";
import { useTranslation } from "react-i18next";
import { Button, Divider, Image } from "antd";
import logoCourses from "../../assets/img/logoCourses.png";
import { useHistory } from "react-router-dom";
import { EXAM_ONLINE_PATH } from "../../config/path";
import { RightOutlined } from "@ant-design/icons";

const ExamHeader = (props) => {
  const { t } = useTranslation("common");
  const { name, description, owner, edit, added } = props;
  const history = useHistory();
  return (
    <div className="ExamHead">
      <div className="PageHead">
        <div className="PageHeadRow">
          <React.Fragment>
            <div className="course-detail-wrapper">
              <Image
                className="imgCourseDetail"
                alt="example"
                src={logoCourses}
              />
              <div className="CourseDetails">
                <div className="breadcumb">
                  {t("Khóa học")}
                  <RightOutlined size={18} /> {name}
                </div>
                <Divider className="divider-custom" />
                <h1 className="TitleCourse">{name}</h1>
                <div className="Description">{description}</div>
                {added && (
                  <div style={{ marginTop: "10px" }}>
                    <Button
                      type="default"
                      className="examBtn"
                      onClick={() => history.push(EXAM_ONLINE_PATH)}
                    >
                      {t("Kiểm tra trắc nghiệm")}
                    </Button>
                  </div>
                )}
              </div>
            </div>
            <div className="CreatedByDiv">
              <span className="CreatedBySpan">{t("created_by")} </span>
              <span className="Owner">{owner?.username}</span>
            </div>
          </React.Fragment>
        </div>
      </div>
    </div>
  );
};

export default React.memo(ExamHeader);
