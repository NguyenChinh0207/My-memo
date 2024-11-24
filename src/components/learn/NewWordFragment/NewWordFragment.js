import React from 'react';
import "./NewWordFragment.scss";
import { useTranslation } from 'react-i18next';

const NewWordFragment = props => {
	const { t } = useTranslation("common");
	return (
    <div className="NewWordFrag">
      <div className="ContentNewWord">
        <div className="Main">
          <div className="Word">{props.name}</div>
          <div className="Description">{props.description}</div>
        </div>
        <div className="RightColumnNewWord">
          <div onClick={props.next} className="NextButton">
            <div className="RightArrow" />
            <div>{t("continue")}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default React.memo(NewWordFragment);
