import React from 'react';

export const Card = ({ children, title, description, className = '' }: any) => {
    return (
        <div className={`p-6 shadow rounded bg-white ${className}`}>
            {title && <h3 className="font-semibold text-lg mb-1">{title}</h3>}
            {description && <p className="text-sm text-gray-600 mb-3">{description}</p>}
            {children}
        </div>
    );
};

export default Card;
