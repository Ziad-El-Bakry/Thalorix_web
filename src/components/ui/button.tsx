import React from 'react';
import { motion } from 'framer-motion';

type Props = {
	children: React.ReactNode;
	variant?: 'primary' | 'ghost' | 'outline';
	className?: string;
	type?: 'button' | 'submit' | 'reset';
	onClick?: () => void;
	disabled?: boolean;
};

export const Button = ({ children, variant = 'primary', className = '', type = 'button', onClick, disabled }: Props) => {
	const base = 'inline-flex items-center justify-center px-6 py-3 rounded shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer';
	const styles =
		variant === 'primary'
			? 'bg-teal-800 text-white hover:bg-teal-700 dark:bg-primary dark:hover:bg-primary-hover active:translate-y-0.5'
			: variant === 'outline'
				? 'border border-gray-300 dark:border-border bg-transparent text-teal-800 dark:text-foreground hover:bg-gray-50 dark:hover:bg-card-hover'
				: 'bg-transparent text-teal-800 dark:text-foreground underline hover:opacity-85';

	return (
		<motion.button
			whileHover={!disabled ? { scale: 1.015 } : undefined}
			whileTap={!disabled ? { scale: 0.985 } : undefined}
			type={type}
			onClick={onClick}
			disabled={disabled}
			className={`${base} ${styles} ${className}`}
		>
			{children}
		</motion.button>
	);
};