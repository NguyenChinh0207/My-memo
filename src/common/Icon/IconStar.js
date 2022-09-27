import React from 'react';

const IconStar = ({ half }) => {
    return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            {half && (<linearGradient id="half_grad">
                <stop offset={half?.percent + '%'}></stop>
                <stop></stop>
            </linearGradient>)}
            <path fill={half ? 'url(#half_grad)' : null} d="M8,0l2.472,5.267L16,6.112l-4,4.099L12.945,16L8,13.268L3.056,16L4,10.211L0,6.112l5.528-0.845L8,0z" />
        </svg>
    );
};

export default IconStar;