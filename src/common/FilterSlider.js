import React, { useEffect, useState } from 'react'
import { Menu, Slider, Dropdown, Button } from 'antd'
import { DownOutlined } from '@ant-design/icons'

import './FilterSlider.scss'

const FilterSlider = ({ buttonText, onChange, value = [], sliderProps = {}, ...resProps }) => {
    const [visible, setVisible] = useState(false)
    const [ranger, setRanger] = useState([])

    useEffect(() => {
        setRanger(value)
    }, [value])

    const handleMenuClick = (e) => {}

    const handleVisibleChange = (flag) => {
        setVisible(flag)
        if (!flag && Array.isArray(value) && [...value].sort().join(',') !== [...ranger].sort().join(',')) {
            onChange(ranger)
        }
    }

    const onChangeSlider = (value) => {
        setRanger(value)
    }

    const menuSelect = (
        <Menu onClick={handleMenuClick}>
            <Menu.Item>
                <Slider
                    range={{ draggableTrack: true }}
                    tooltipVisible={visible}
                    value={ranger}
                    tooltipPrefixCls="slider-tooltip ant-tooltip"
                    className="custom-slider"
                    onChange={onChangeSlider}
                    {...sliderProps}
                />
            </Menu.Item>
        </Menu>
    )

    return (
        <Dropdown
            overlay={menuSelect}
            placement="bottomCenter"
            arrow
            visible={visible}
            onVisibleChange={handleVisibleChange}
            trigger={['click']}
            className="custom-dropdown"
            {...resProps}
        >
            <Button size="large" className="filter-select btn-flter">
                <span>
                    {buttonText}
                    {!ranger[1] ? (
                        ''
                    ) : (
                        <span className="custom-age-value"> {`(${ranger[0] || 0}, ${ranger[1] || 0})`}</span>
                    )}
                </span>
                <DownOutlined />
            </Button>
        </Dropdown>
    )
}

export default FilterSlider
