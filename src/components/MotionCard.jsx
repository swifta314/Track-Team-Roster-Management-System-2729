
import React from 'react';
import { motion } from 'framer-motion';
import { useCommonStyles } from '../hooks/useCommonStyles';

const MotionCard = ({ 
  children, 
  delay = 0, 
  variant = 'default',
  className = '',
  ...props 
}) => {
  const { getCardClasses } = useCommonStyles();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={`${getCardClasses(variant)} ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default MotionCard;
