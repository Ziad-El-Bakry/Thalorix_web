import React from 'react';

type Props = {
	children: React.ReactNode;
	variant?: 'primary' | 'ghost';
	className?: string;
	onClick?: () => void;
};

export const Button = ({ children, variant = 'primary', className = '', onClick }: Props) => {
	const base = 'inline-flex items-center justify-center px-6 py-3 rounded shadow-md transition';
	const styles =
		variant === 'primary'
			? 'bg-teal-800 text-white hover:bg-teal-700 active:translate-y-0.5'
			: 'bg-transparent text-teal-800 underline';

	return (
		<button onClick={onClick} className={`${base} ${styles} ${className}`}>
			{children}
		</button>
	);
};