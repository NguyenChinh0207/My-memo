import React from 'react';
import PropTypes from 'prop-types';
import "./NewWordFragment.scss";
import { useTranslation } from 'react-i18next';

const NewWordFragment = props => {
	const { t } = useTranslation("common");
	return (
    <div className="Content">
      <div className="Main">
        <div className="Word">{props.word}</div>
        <div className="Description">{props.description}</div>
      </div>
      <div className="RightColumn">
        <div onClick={props.next} className="NextButton">
          <div className="RightArrow" />
          <div>{t("next")}</div>
        </div>
      </div>
    </div>
  );
}

export default React.memo(NewWordFragment);

NewWordFragment.propTypes = {
	word: PropTypes.string.isRequired,
	description: PropTypes.string.isRequired,
	next: PropTypes.func.isRequired,
};
