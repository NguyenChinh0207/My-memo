import React from 'react';

const IconTime = ({
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
            <path fillRule="evenodd" clipRule="evenodd" d="M12.6374 1C6.56223 1 1.63736 5.92487 1.63736 12C1.63736 18.0751 6.56223 23 12.6374 23C18.7125 23 23.6374 18.0751 23.6374 12C23.6374 5.92487 18.7125 1 12.6374 1ZM12.6374 3C17.6079 3 21.6374 7.02944 21.6374 12C21.6374 16.9706 17.6079 21 12.6374 21C7.6668 21 3.63736 16.9706 3.63736 12C3.63736 7.02944 7.6668 3 12.6374 3Z" fill={fillPath} />
            <path fillRule="evenodd" clipRule="evenodd" d="M12.6374 6C13.1502 6 13.5729 6.38604 13.6306 6.88338L13.6374 7V11.585L16.3445 14.2929C16.705 14.6534 16.7327 15.2206 16.4277 15.6129L16.3445 15.7071C15.984 16.0676 15.4168 16.0953 15.0245 15.7903L14.9303 15.7071L11.9303 12.7071C11.774 12.5508 11.6748 12.3481 11.646 12.1314L11.6374 12V7C11.6374 6.44772 12.0851 6 12.6374 6Z" fill={fillPath} />
        </svg>
    );
};

IconTime.propTypes = {};

export default IconTime;