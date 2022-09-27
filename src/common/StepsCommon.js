import React from 'react'
import { Steps } from 'antd'
import './StepsCommon.scss'

const { Step } = Steps

const StepsCommon = ({ steps, currentStep }) => {
    return (
        <Steps current={currentStep} className="steps-common" size="small" labelPlacement="vertical" responsive>
            {steps.map((value, index) => (
                <Step key={index} title={value} />
            ))}
        </Steps>
    )
}

export default StepsCommon
