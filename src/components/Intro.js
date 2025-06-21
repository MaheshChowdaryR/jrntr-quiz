import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { auth } from '../index';
import { signInAnonymously } from 'firebase/auth';
import './Intro.css';

const Intro = ({ setStage, setUserId }) => {
  const [input, setInput] = useState('');
  const [error, setError] = useState('');

  const validateUserId = useCallback((id) => {
    if (!id.trim()) return 'User ID cannot be empty.';
    if (!/^@?[_a-zA-Z][_a-zA-Z0-9]*$/.test(id)) {
      return 'User ID must start with a letter or underscore (optionally prefixed by @), and only contain letters, numbers, or underscores.';
    }
    return '';
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault(); // Prevent default form submission
    const validationError = validateUserId(input);
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      const userCredential = await signInAnonymously(auth);
      const normalizedInput = input.startsWith('@') ? input.slice(1) : input;
      const generatedUserId = `${normalizedInput}-${userCredential.user.uid.slice(0, 8)}`;
      setUserId(generatedUserId); // Set the unique userId
      setError('');
      setStage('quiz'); // Transition to quiz
      console.log('User ID set:', generatedUserId); // Debug log
    } catch (error) {
      setError('Failed to sign in anonymously. Please try again.');
      console.error('Authentication error:', error.message);
    }
  }, [input, validateUserId, setUserId, setStage]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="intro-container"
    >
      <h1 className="intro-title">Jr. NTR Ultimate Fan Quiz</h1>
      <p className="intro-description">Test your knowledge about Jr. NTR's movies!</p>
      <form onSubmit={handleSubmit} className="intro-form">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter your Twitter ID (e.g., NTRFan123 or @NTR_Fan123)"
          className="intro-input"
          autoComplete="off" // Prevent browser autocomplete interference
        />
        {error && <p className="intro-error">{error}</p>}
        <button type="submit" className="intro-button">Start Quiz</button>
      </form>
    </motion.div>
  );
};

export default Intro;