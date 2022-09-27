import React from 'react'
import PropTypes from 'prop-types'

const IconClose = (props) => {
    return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="8" cy="8" r="8" fill="#D3D3D3" />
            <path
                d="M5.5 10.5L10.5 5.5"
                stroke="#888888"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M10.5 10.5L5.5 5.5"
                stroke="#888888"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    )
}

IconClose.propTypes = {
    onClick: PropTypes.func,
}

export default IconClose
