import React, { useState, useEffect } from 'react'
import RangePickerCommon from './RangePickerCommon'

import './FilterRangePicker.scss'

const FilterRangePicker = (props) => {
    const { placeholder, onChange, onCalendarChange: onCalChange, disabledDate, ...restProps } = props
    const [showRange, setShowRange] = useState(!!restProps.value)

    useEffect(() => {
        setShowRange(!!restProps.value)
    }, [restProps.value])

    const onChangeDate = (value) => {
        onChange(value)
        if (!value) {
            setShowRange(false)
        }
    }

    const onCalendarChange = (_, dateStrings, info) => {
        if (dateStrings && dateStrings[0] && !showRange) {
            setShowRange(true)
        }
        if (typeof onCalChange === 'function') {
            onCalChange(_, dateStrings, info)
        }
    }

    const onBlur = (e) => {
        if (!e?.target?.value && showRange) {
            setShowRange(false)
        }
    }

    return (
        <RangePickerCommon
            className={`Filter-Rangepicker ${showRange ? '' : 'Filter-Rangepicker__unselected'}`}
            onChange={onChangeDate}
            disabledDate={disabledDate}
            placeholder={[placeholder, '']}
            onCalendarChange={onCalendarChange}
            onBlur={onBlur}
            {...restProps}
        />
    )
}

export default FilterRangePicker
