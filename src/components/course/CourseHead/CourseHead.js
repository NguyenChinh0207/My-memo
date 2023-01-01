import React from 'react';
import PropTypes from 'prop-types';

import "./CourseHead.scss";
import Spinner from '../../spinner/Spinner';
import { useTranslation } from 'react-i18next';

const CourseHead = props => {
	const { t } = useTranslation("common");
	return (
    <div className="CourseHead">
      <div className="PageHead">
        <div className="PageHeadRow">
          {props.name ? (
            <React.Fragment>
              <div className="CourseDetails">
                <div className="Title">{props.name}</div>
                <div className="Description">{props.description}</div>
              </div>
              <div className="CreatedByDiv">
                <span className="CreatedBySpan">{t("created_by")} </span>
                <span className="Owner">{props.owner}</span>
              </div>
            </React.Fragment>
          ) : (
            <Spinner />
          )}
        </div>
      </div>
    </div>
  );
}

export default React.memo(CourseHead);

CourseHead.propTypes = {
	name: PropTypes.string,
	description: PropTypes.string,
	owner: PropTypes.string,
};
