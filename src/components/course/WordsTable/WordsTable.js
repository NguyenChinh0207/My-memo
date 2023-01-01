import React from 'react';
import PropTypes from 'prop-types';

import "./WordsTable.scss";

const WordsTable = props => {
	return (
    <div className="WordsTable">
      <div className="RowWrapper">
        <div className="LanguagesRow">
          <div className="Column">{props.teaching}</div>
          <div className="Column">{props.description_language}</div>
        </div>
      </div>

      {props.words.map((p, idx) => (
        <div key={idx} className="RowWrapper">
          <div className="Row">
            <div className="Column">{p.word}</div>
            <div className="Column">{p.description}</div>
            {props.removeWord && (
              <div className="RemoveBtn" onClick={() => props.removeWord(p)} />
            )}
          </div>
        </div>
      ))}
      {props.children}
    </div>
  );
}

export default WordsTable;

WordsTable.propTypes = {
	name: PropTypes.string.isRequired,
	description: PropTypes.string.isRequired,
	teaching: PropTypes.string.isRequired,
	description_language: PropTypes.string.isRequired,
	words: PropTypes.array.isRequired,
};
