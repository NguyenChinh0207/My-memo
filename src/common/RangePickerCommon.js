import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import { DatePicker } from 'antd'
import { getCurrentLanguage } from '../config/function'
import locale from 'antd/es/date-picker/locale/vi_VN'
import 'moment/locale/vi'
import { DownOutlined } from '@ant-design/icons'

import './RangerPickerCommon.scss'

const RangePickerCommon = (props) => {
    const { RangePicker } = DatePicker
    const { size, className, showTime, disabledDate, ...resProps } = props
    const currentLanguage = getCurrentLanguage()

    if (currentLanguage === 'vi') {
        return (
            <RangePicker
                locale={locale}
                size={`${size}`}
                showTime={showTime}
                disabledDate={disabledDate || ''}
                className={`w-100 ${className}`}
                dropdownClassName="rangepicker-dropdown-common"
                suffixIcon={<DownOutlined />}
                {...resProps}
            />
        )
    }

    return (
        <RangePicker
            size={`${size}`}
            showTime={showTime}
            className={`w-100 ${className}`}
            dropdownClassName="rangepicker-dropdown-common"
            suffixIcon={<DownOutlined />}
            {...resProps}
        />
    )
}
RangePickerCommon.defaultProps = {
    size: 'large',
    className: 'rangepicker-common',
}

RangePickerCommon.propTypes = {
    size: PropTypes.string,
    className: PropTypes.string,
}

export default RangePickerCommon
