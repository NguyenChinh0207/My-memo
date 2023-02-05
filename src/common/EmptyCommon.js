import React from 'react'
import IconEmptyTable from './Icon/IconEmptyTable'

import './EmptyCommon.scss'

const EmptyCommon = ({ text = '' }) => {
    return (
        <div className="Empty-Common">
            {text && <div className="Empty-Common__text">{text}</div>}
            <div className="Empty-Common__icon">
                <IconEmptyTable />
            </div>
        </div>
    )
}

export default EmptyCommon
