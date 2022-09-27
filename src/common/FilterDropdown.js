import React from 'react'
import { Dropdown, Button } from 'antd'
import { DownOutlined } from '@ant-design/icons'

import './FilterDropdown.scss'

const FilterDropdown = (props) => {
    const { className, buttonText, menu, ...resProp } = props

    return (
        <Dropdown trigger="click" className={`Filter-Dropdown ${className}`} overlay={menu} {...resProp}>
            <Button>
                {buttonText} <DownOutlined />
            </Button>
        </Dropdown>
    )
}

export default FilterDropdown
