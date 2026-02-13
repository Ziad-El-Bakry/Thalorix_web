import React from 'react';

export const Input = ({ className = '', ...props }: any) => {
	return (
		<input
			className={`border p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-teal-200 ${className}`}
			{...props}
		/>
	);
};