import React from "react"
import { Checkbox } from "antd"

import './CheckboxCommon.scss'

const CheckboxCommon = (props) => {
    const {name, classname, content, ...resProp} = props

    return (
        <Checkbox
            name={name}
            classname={`checkbox-common ${classname || ``}`}
            {...resProp}
        >
            {content}
        </Checkbox>
    )
}

export default CheckboxCommon
