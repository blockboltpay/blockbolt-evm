import React from 'react';

export const EthIcon = ({ className, style }: any) => {
    return (
        <svg
            width="22"
            height="22"
            viewBox="0 0 22 22"
            fill="none"
            className={className}
            style={style}
        >
            <path
                d="M22 11C22 17.0751 17.0751 22 11 22C4.92487 22 0 17.0751 0 11C0 4.92487 4.92487 0 11 0C17.0751 0 22 4.92487 22 11Z"
                fill="black"
            />
            <path
                d="M11.0186 15.2058V19.2742L15.9996 12.2401L11.0186 15.2058Z"
                fill="#9B9B9B"
            />
            <path
                d="M11.019 3L15.9999 11.2889L11.019 14.2546L6 11.2889"
                fill="#9A9A9A"
            />
            <path
                d="M11.019 3V9.00755L6 11.2889M6 12.2395L11.0186 15.2058V19.2742"
                fill="#FCFCFC"
            />
            <path d="M11.0186 9.00497V14.2521L15.9996 11.2863" fill="#333333" />
            <path d="M6 11.2863L11.0186 9.00497V14.2521" fill="#999999" />
        </svg>
    );
};