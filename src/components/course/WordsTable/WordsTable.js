import React from "react";
import { useTranslation } from "react-i18next";
import "./WordsTable.scss";

const WordsTable = (props) => {
  console.log("in words", typeof props.words, props.words);
  return (
    <div className="WordsTable">
      <div className="RowWrapper">
        <div className="LanguagesRow">
          <div className="Column">{props.language}</div>
          <div className="Column">{props.my_language}</div>
        </div>
      </div>
      {props.words &&
        props.words.map((p, idx) => (
          <div key={idx} className="RowWrapper">
            <div className="Row">
              <div className="Column">{p.name}</div>
              <div className="Column">{p.description}</div>
              {props.removeWord && (
                <div
                  className="RemoveBtn"
                  onClick={() => props.removeWord(p)}
                />
              )}
            </div>
          </div>
        ))}
      {props.children}
    </div>
  );
};

export default WordsTable;
