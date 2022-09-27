import React from "react"
import { Radio } from "antd"
import './RadioCommon.scss'

const RadioCommon = (props) => {
    const {name, value, className, content, ...resProp} = props;

    return (
        <Radio
            name={name}
            value={value}
            className={`Radio-common ${className || ''}`}
            {...resProp}
        >{content}</Radio>
    )
}

export default RadioCommon