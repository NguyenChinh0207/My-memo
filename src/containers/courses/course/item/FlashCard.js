import { Button, Spin } from "antd";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { bindParams } from "../../../../config/function";
import { COURSE_EDIT_PATH } from "../../../../config/path";
import "../CourseDetail.scss";

export const FlashCard = (props) => {
  return (
    <div className="FlashCard">
      {props.loadingCard ? (
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <Spin size={"large"} />
        </div>
      ) : (
        <div className="card-holder">
          <div className="card">
            <div className="front">
              <p>{props.curCardId}</p>
              <p>{props.name}</p>
            </div>
            <div className="back">
              <p>{props.description}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
