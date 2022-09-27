import React, { useState } from 'react'
import { Select } from 'antd'
import './MultiSelectCommon.scss'
import IconSquare from './Icon/IconSquare'
import IconSquareCheck from './Icon/IconSquareCheck'

const MultiSelectCommon = (props) => {
    const { className, dropdownClassName, ...resProps } = props

    const menuItemSelectedIcon = (props) => {
        const { ...p } = props
        return (
            <span className="MultiSelectCommon__dropdown-icon">
                {p.isSelected ? <IconSquareCheck /> : <IconSquare />}
            </span>
        )
    }

    return (
        <Select
            mode="multiple"
            menuItemSelectedIcon={menuItemSelectedIcon}
            dropdownClassName={`MultiSelectCommon__dropdown ${dropdownClassName || ''}`}
            size="large"
            className={`MultiSelectCommon ${className || ''}`}
            optionFilterProp="label"
            {...resProps}
        />
    )
}

// @todo: Sync value from props to state?
// The only way now is use useEffect but it will rerender component twice
// Other ideal is put it into a hook but have not tested yet
// Other ideal is put value in to a state then compare two array:  https://reactjs.org/docs/hooks-faq.html#how-do-i-implement-getderivedstatefromprops
export const MultiSelectCommonControl = ({ options, value = [], onChange, ...resProps }) => {
    const [selectedValues, setSelectedValues] = useState([])

    const triggerChange = (changedValue) => {
        onChange?.(changedValue)
    }

    const onSelectChange = (value) => {
        if (!Array.isArray(value)) {
            return
        }

        const newIndex = value.indexOf(-1)
        const currentIndex = selectedValues.indexOf(-1)
        let newValue
        if (currentIndex !== -1 && newIndex !== -1) {
            const newValue = [...value]
            newValue.splice(newIndex, 1)
        } else if (currentIndex === -1 && newIndex !== -1) {
            newValue = [-1]
        } else {
            newValue = [...value]
        }

        setSelectedValues(newValue)
        triggerChange(newValue)
    }

    return <MultiSelectCommon value={selectedValues} options={options} onChange={onSelectChange} {...resProps} />
}

export default MultiSelectCommon
