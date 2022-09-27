import React from 'react'
import {Spin} from 'antd'

const RouteLoader = () => {
    return (
        <div style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)'
        }}>
            <Spin size={'large'} tip={'loading'}/>
        </div>
    )
}

export default RouteLoader
