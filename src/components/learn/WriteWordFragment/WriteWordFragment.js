import React, { Component, useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import "./WriteWordFragment.scss";
import { useTranslation } from "react-i18next";

const WriteWordFragment = (props) => {
  const {t} = useTranslation("common")
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current.focus();
  }, [])
  
  useEffect(() => {
    	if (props.result === 'learning') {
    		clearInput();
    	}
  },[props.result])

  const inputChange = event => {
  	setInputValue(event.target.value);
  };

  const onKeyDown = e => {
  	if (e.key === 'Enter' && props.result === 'learning') {
  		onNext();
  	}
  };

  const onNext = () => {
  	if (props.result === 'learning') {
  		props.userWrote(inputValue);
  	}
  };

  const clearInput = () => {
  	inputRef.current.focus();
  	setInputValue('')
  };

  let inputClasses = "Input";

  if (props.result === "correct") {
    inputClasses += " " + "InputCorrect";
  } else if (props.result === "wrong") {
    inputClasses += " " + "InputWrong";
  }

  return (
    <div className="WriteWord">
      <div className="ContentWriteWord">
        <div className="Main">
          <div className="Word">{props.pair.description}</div>
          {/* {input} */}
          <input
            ref={inputRef}
            readOnly={props.result !== "learning"}
            value={inputValue}
            onChange={inputChange}
            onKeyDown={onKeyDown}
            className={inputClasses}
          />
        </div>
        <div className="RightColumnWriteWord">
          <div onClick={onNext} className="NextButton">
            <div className="RightArrow" />
            <div>{t("Tiếp tục")}</div>
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
