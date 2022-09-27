import React from 'react';
import PropTypes from 'prop-types';
import {Input} from "antd";

const InputCommon = props => {
    const {className, size, placeHolder} = props
    return (
        <Input className={className} size={size} placeholder={placeHolder}/>
    );
};

InputCommon.defaultProps = {
    className: 'input-common',
    size: "large",
    placeHolder: ""
}

InputCommon.propTypes = {
    className: PropTypes.string,
    size: PropTypes.string
};

export default InputCommon;