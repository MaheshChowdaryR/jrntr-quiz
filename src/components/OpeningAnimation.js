import { memo, useEffect } from 'react';
import { motion } from 'framer-motion';
import './OpeningAnimation.css';

const OpeningAnimation = memo(({ setStage }) => {
  useEffect(() => {
    const timer = setTimeout(() => setStage('intro'), 4000);
    return () => clearTimeout(timer);
  }, [setStage]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="animation-container"
    >
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ duration: 2, ease: 'easeOut' }}
        className="image-container"
      ></motion.div>
      <motion.h1
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="animation-title"
      >
        Welcome to the Jr. NTR Ultimate Fan Quiz!
      </motion.h1>
    </motion.div>
  );
});

export default OpeningAnimation;