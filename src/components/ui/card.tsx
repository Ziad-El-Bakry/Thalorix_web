import React from 'react';
import { motion } from 'framer-motion';

export const Card = ({ children, title, description, className = '' }: any) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            whileHover={{ y: -4, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.08)" }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className={`p-6 shadow rounded bg-white dark:bg-card border border-transparent dark:border-border transition-all duration-300 ${className}`}
        >
            {title && <h3 className="font-semibold text-lg mb-1 text-gray-900 dark:text-foreground">{title}</h3>}
            {description && <p className="text-sm text-gray-600 dark:text-muted-foreground mb-3">{description}</p>}
            {children}
        </motion.div>
    );
};
