import React, { useState } from 'react'
import { Button } from 'antd'
import { DownOutlined } from '@ant-design/icons'
import DatePickerCommon from './DatePickerCommon'
import { useTranslation } from 'react-i18next'

import './FilterDatepicker.scss'

const FilterDatepicker = (props) => {
    const [openPicker, setOpenPicker] = useState(false)
    
    const { t } = useTranslation('common')
    const { placeholder, onChange, className, value , ...resProps} = props

    const onOpenChange = (open) => {
        setOpenPicker(false)
    }

    const onChangeDate = (value) => {
        onChange(value)
    }

    const onClick = (e) => {
        e.stopPropagation()
        setOpenPicker(!openPicker)
    }
    const onClear = () => {
        onChange(null)
    }

    return (
        <div className="Filter-Datepicker">
            <Button onClick={onClick} size="large" className={`filter-datepicker-button ${className}`}>
                <span className="custom-content">{value ? value.format('DD.MM.YYYY') : placeholder}</span>
                <span className="custom-icon">
                    <DownOutlined style={{ fontSize: '75%' }} />
                </span>
            </Button>
            <DatePickerCommon
                className="Filter-Datepicker_picker"
                open={openPicker}
                showToday={false}
                renderExtraFooter={() => (
                    <div className="filter-datepicker-extra-button">
                        <Button className="btn btn-common" size="large" onClick={onClear}>
                            {t('Bỏ chọn')}
                        </Button>
                    </div>
                )}
                onOpenChange={onOpenChange}
                onChange={onChangeDate}
                value={value}
                {...resProps}
            />
        </div>
    )
}

export default FilterDatepicker
