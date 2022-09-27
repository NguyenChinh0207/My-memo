import React from 'react'
import { Select } from 'antd'
import IconCircle from './Icon/IconCircle'
import IconCircleCheck from './Icon/IconCircleCheck'

import './SelectCommon.scss'

const SelectCommon = ({ className, dropdownClassName, size = 'large', options, ...resProps }) => {
    return (
        <Select
            size={size}
            className={`Select-Common ${className || ''}`}
            optionLabelProp="label"
            dropdownClassName={`Select-Common-Dropdown ${dropdownClassName || ''}`}
            {...resProps}
        >
            {options?.map(({ value, label }, index) => {
                return (
                    <Select.Option key={index} value={value} label={label}>
                        <div className="Select-Common__option">
                            <span className="Select-Common__option-icon">
                                <IconCircle />
                            </span>
                            <span className="Select-Common__option-icon-active">
                                <IconCircleCheck />
                            </span>
                            {label}
                        </div>
                    </Select.Option>
                )
            })}
        </Select>
    )
}

export default SelectCommon
