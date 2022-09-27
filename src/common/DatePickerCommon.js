import React from 'react'
import { DatePicker } from 'antd'
import { getCurrentLanguage } from '../config/function'
import locale from 'antd/es/date-picker/locale/vi_VN'
import 'moment/locale/vi'
import './DatePickerCommon.scss'

const DatePickerCommon = (props) => {
    const { className, dropdownClassName, ...resProp } = props
    const currentLanguage = getCurrentLanguage()

    if (currentLanguage === 'vi') {
        return (
            <DatePicker
                locale={locale}
                className={`Date-picker-common ${className || ''}`}
                dropdownClassName={`Date-picker-common-dropdown ${dropdownClassName || ''}`}
                {...resProp}
            />
        )
    }

    return (
        <DatePicker
            className={`Date-picker-common ${className || ''}`}
            dropdownClassName={`Date-picker-common-dropdown ${dropdownClassName || ''}`}
            format="DD.MM.YYYY"
            {...resProp}
        />
    )
}

export default DatePickerCommon
