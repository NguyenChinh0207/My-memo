import React, { Component, useState, useRef } from 'react';
import PropTypes from 'prop-types';

import './AddWordsRow.scss';
import { useTranslation } from 'react-i18next';

const AddWordsRow = (props) => {
	const [word, setWord] = useState('');
	const [description, setDescription] = useState('');
	const reference = useRef();
	const { t } = useTranslation("common");

	const confirm = () => {
		if ((word !== '') & (description !== '')) {
			props.addNewWord(word.trim(), description.trim());
			setWord('');
			setDescription('');
			reference.current.focus();
			window.scrollTo(0, document.body.scrollHeight);
		}
	};

	const inputChangeWord = event => {
		setWord(event.target.value)
	};

	const inputChangeDescription = event => {
		setDescription(event.target.value)
	};

	const onKeyDown = event => {
		if (event.key === 'Enter') {
			if (event.target.name === 'word') {
				if (word !== '') {
					reference.current.focus();
				}
			} else {
				confirm();
			}
		}
	};

		let confirmIconClasses ="ConfirmIcon Invisible";
		if ((word !== '') & (description !== '')) {
			confirmIconClasses = "ConfirmIcon";
		}
		return (
      <React.Fragment>
        <div className="AddWordsRow">
          <div className="RowWrapper">
            <div className="Row">
              <div className="AddWords">{t("add_words")}</div>
            </div>
          </div>
          <div className="RowWrapper">
            <div className="Row">
              <div className="Column">
                <input
                  ref={(input) => {
                    reference.current = input;
                  }}
                  name="word"
                  value={word}
                  onKeyDown={(e) => onKeyDown(e, true)}
                  onChange={inputChangeWord}
                  className="Input"
                />
              </div>
              <div className="Column">
                <input
                  ref={(input) => {
                    reference.current = input;
                  }}
                  name="description"
                  value={description}
                  onKeyDown={(e) => onKeyDown(e, false)}
                  onChange={inputChangeDescription}
                  className="Input"
                />
              </div>
              <div className={confirmIconClasses} onClick={confirm} />
            </div>
          </div>
        </div>
      </React.Fragment>
    );
	}


export default React.memo(AddWordsRow);

AddWordsRow.propTypes = {
	addNewWord: PropTypes.func.isRequired,
};
