import React, { Component, useState } from "react";
import PropTypes from "prop-types";
import "./WriteWordFragment.scss";

const WriteWordFragment = (props) => {
  const [inputValue, setInputValue] = useState("");

  // componentDidMount() {
  // 	this.input.focus();
  // }

  // componentDidUpdate(prevProps, prevState) {
  // 	if (this.props.result === 'learning' && this.props.result !== prevProps.result) {
  // 		this.clearInput();
  // 	}
  // }

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
  		props.userWrote(this.state.inputValue);
  	}
  };

  const clearInput = () => {
  	// this.input.focus();
  	setInputValue('')
  };

  let inputClasses = "Input";

  if (this.props.result === "correct") {
    inputClasses += " " + "InputCorrect";
  } else if (this.props.result === "wrong") {
    inputClasses += " " + "InputWrong";
  }

  return (
    <div className="Content">
      <div className="Main">
        <div className="Word">{props.pair.description}</div>
        {/* {input} */}
        <input
          ref={(input) => {
            this.input = input;
          }}
          readOnly={props.result !== "learning"}
          value={inputValue}
          onChange={inputChange}
          onKeyDown={onKeyDown}
          className={inputClasses}
        />
      </div>
      <div className="RightColumn">
        <div onClick={onNext} className="NextButton">
          <div className="RightArrow" />
          <div>Next</div>
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
