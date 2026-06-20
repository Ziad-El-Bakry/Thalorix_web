import React from 'react';
import { motion } from 'framer-motion';

export const Input = ({ className = '', ...props }: any) => {
	return (
		<motion.input
			whileFocus={{ scale: 1.005 }}
			transition={{ duration: 0.15, ease: "easeOut" }}
			className={`border border-gray-300 dark:border-border p-3 rounded w-full bg-transparent dark:bg-card text-gray-900 dark:text-foreground placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-200 dark:focus:ring-primary/30 transition-all ${className}`}
			{...props}
		/>
	);
};