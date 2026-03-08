import React from 'react';

type Props = {
	children: React.ReactNode;
	variant?: 'primary' | 'ghost' | 'outline';
	className?: string;
	type?: 'button' | 'submit' | 'reset';
	onClick?: () => void;
};

export const Button = ({ children, variant = 'primary', className = '', type = 'button', onClick }: Props) => {
	const base = 'inline-flex items-center justify-center px-6 py-3 rounded shadow-md transition';
	const styles =
		variant === 'primary'
			? 'bg-teal-800 text-white hover:bg-teal-700 active:translate-y-0.5'
			: variant === 'outline'
				? 'border border-gray-300 bg-transparent text-teal-800 hover:bg-gray-50'
				: 'bg-transparent text-teal-800 underline';

	return (
		<button type={type} onClick={onClick} className={`${base} ${styles} ${className}`}>
			{children}
		</button>
	);
};