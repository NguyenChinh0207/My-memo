import React from 'react';
import PropTypes from 'prop-types';
import './ItemRating.scss';
import IconStar from './Icon/IconStar';

const ItemRating = props => {
    const { className, rating, maxRating } = props;
    let item = Array.from({ length: maxRating }, (_, i) => i + 1);
    let half = null, decimal = rating % 1;
    if (decimal > 0) {
        half = {
            percent: decimal / 1 * 100,
            index: Math.floor(rating) + 1
        };
    }

    return <div className={`ItemRating ${className}`}>
        {item.map((rate, index) => (
            <div key={index} className={`ItemRating-item ${rate <= rating ? 'is-activated' : ''}`}>
                <IconStar half={half && half.index === rate ? half : null} />
            </div>
        ))}
    </div>
}

ItemRating.defaultProps = {
    className: '',
    maxRating: 5,
}

ItemRating.propTypes = {
    className: PropTypes.string,
    rating: PropTypes.number,
    maxRating: PropTypes.number,
};

export default ItemRating