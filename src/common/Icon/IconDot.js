import React from 'react';

const IconDot = ({
    r = 24,
    viewBox = "0 0 24 24",
    fillSvg = "none",
    fillPath = "#B31E8D",
    onClick = () => {
    }
}) => {
    return (
        <svg onClick={onClick} width={r * 2} height={r * 2} viewBox={viewBox} fill={fillSvg} xmlns="http://www.w3.org/2000/svg">
            <circle cx={r * 2} cy={r * 2} r={r * 2} fill={fillPath} />
        </svg>
    );
};

IconDot.propTypes = {};

export default IconDot;