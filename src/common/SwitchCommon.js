import React from 'react'
import { Switch } from 'antd'
import './SwitchCommon.scss'

const SwitchCommon = ({className = '', ...props}) => {
    return (
        <Switch {...props} className={`${className} switch-common`}/>
    )
}

export default SwitchCommon