import React, { Component, useState, useRef } from 'react';
import PropTypes from 'prop-types';

import styles from './AddWordsRow.module.css';
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

		let confirmIconClasses = styles.ConfirmIcon + ' ' + styles.Invisible;
		if ((word !== '') & (description !== '')) {
			confirmIconClasses = styles.ConfirmIcon;
		}
		return (
			<React.Fragment>
				<div className={styles.RowWrapper}>
					<div className={styles.Row}>
						<div className={styles.AddWords}>{t('add_words')}</div>
					</div>
				</div>
				<div className={styles.RowWrapper}>
					<div className={styles.Row}>
						<div className={styles.Column}>
							<input
								ref={input => {
									reference.current = input;
								}}
								name="word"
								value={word}
								onKeyDown={e => onKeyDown(e, true)}
								onChange={inputChangeWord}
								className={styles.Input}
							/>
						</div>
						<div className={styles.Column}>
							<input
								ref={input => {
									reference.current = input;
								}}
								name="description"
								value={description}
								onKeyDown={e => onKeyDown(e, false)}
								onChange={inputChangeDescription}
								className={styles.Input}
							/>
						</div>
						<div className={confirmIconClasses} onClick={confirm} />
					</div>
				</div>
			</React.Fragment>
		);
	}


export default React.memo(AddWordsRow);

AddWordsRow.propTypes = {
	addNewWord: PropTypes.func.isRequired,
};
