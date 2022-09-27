import React from 'react';
// import PropTypes from 'prop-types';

const IconClock = ({
                   width = 24,
                   height = 24,
                   viewBox = "0 0 24 24",
                   fillSvg = "none",
                   fillPath = "#828282",
                   onClick = () => {
                   }
               }) => {
    return (
        <svg onClick={onClick} width={width} height={height} viewBox={viewBox} fill={fillSvg} xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd"
                  d="M12 1C5.92487 1 1 5.92487 1 12C1 18.0751 5.92487 23 12 23C18.0751 23 23 18.0751 23 12C23 5.92487 18.0751 1 12 1ZM12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3Z"
                  fill={fillPath}/>
            <path fillRule="evenodd" clipRule="evenodd"
                  d="M12 6C12.5128 6 12.9355 6.38604 12.9933 6.88338L13 7V11.585L15.7071 14.2929C16.0676 14.6534 16.0953 15.2206 15.7903 15.6129L15.7071 15.7071C15.3466 16.0676 14.7794 16.0953 14.3871 15.7903L14.2929 15.7071L11.2929 12.7071C11.1366 12.5508 11.0374 12.3481 11.0087 12.1314L11 12V7C11 6.44772 11.4477 6 12 6Z"
                  fill={fillPath}/>
        </svg>

    );
};

IconClock.propTypes = {};

export default IconClock;