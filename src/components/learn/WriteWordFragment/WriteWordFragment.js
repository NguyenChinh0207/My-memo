import React, { Component, useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import "./WriteWordFragment.scss";
import { useTranslation } from "react-i18next";

const WriteWordFragment = ({ result, userWrote, pair, setInputReset }) => {
  const { t } = useTranslation("common");
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  useEffect(() => {
    if (result === "learning") {
      clearInput();
      setInputReset(true);
    }
  }, [result]);

  const inputChange = (event) => {
    setInputValue(event.target.value);
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter" && result === "learning") {
      onNext();
    }
  };

  const onNext = () => {
    if (result === "learning") {
      userWrote(inputValue);
      setInputReset(true); // Set inputReset chỉ khi bạn đã hoàn tất việc xử lý kết quả
    }
  };

  const clearInput = () => {
    inputRef.current.focus();
    setInputValue("");
  };

  let inputClasses = "Input";

  if (result === "correct") {
    inputClasses += " " + "InputCorrect";
  } else if (result === "wrong") {
    inputClasses += " " + "InputWrong";
  }

  return (
    <div className="WriteWord">
      <div className="ContentWriteWord">
        <div className="Main">
          <div className="Word">{pair.description}</div>
          <input
            ref={inputRef}
            readOnly={result !== "learning"}
            value={inputValue}
            onChange={inputChange}
            onKeyDown={onKeyDown}
            className={inputClasses}
          />
        </div>
        <div className="RightColumnWriteWord">
          <div onClick={onNext} className="NextButton">
            <div className="RightArrow" />
            <div>{t("continue")}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(WriteWordFragment);

WriteWordFragment.propTypes = {
  result: PropTypes.string.isRequired,
  pair: PropTypes.shape({
    word: PropTypes.string,
    description: PropTypes.string,
  }).isRequired,
  userWrote: PropTypes.func.isRequired,
};
