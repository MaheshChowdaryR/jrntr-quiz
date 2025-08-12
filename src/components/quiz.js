import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import questions from '../data/questions.json';
import './quiz.css';
import { db } from '../index'; // Import Firestore
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const Quiz = ({ setStage, userId, setScore }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [shuffledQuestions, setShuffledQuestions] = useState([]);
  const [timeTaken, setTimeTaken] = useState(0);
  const [email, setEmail] = useState(''); // Controlled email state

  useEffect(() => {
    const shuffled = [...questions.questions].sort(() => Math.random() - 0.5);
    const withShuffledOptions = shuffled.map(q => ({
      ...q,
      options: Object.fromEntries(
        Object.entries(q.options).sort(() => Math.random() - 0.5)
      )
    }));
    setShuffledQuestions(withShuffledOptions);

    const timer = setInterval(() => setTimeTaken((prev) => prev + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleOptionSelect = useCallback((option) => {
    setSelectedOptions((prev) => {
      const currentSelection = prev[currentQuestion];
      if (currentSelection === option) {
        const newSelections = { ...prev };
        delete newSelections[currentQuestion];
        return newSelections;
      } else {
        return {
          ...prev,
          [currentQuestion]: option,
        };
      }
    });
  }, [currentQuestion]);

  const handleNext = useCallback(async () => {
  if (currentQuestion < shuffledQuestions.length - 1) {
    setCurrentQuestion((prev) => prev + 1);
  } else {
    const finalScore = Object.entries(selectedOptions).reduce((acc, [q, opt]) => {
      return acc + (shuffledQuestions[q].correct === opt ? 1 : 0);
    }, 0);
    setScore(finalScore);

    let finalEmail = email; // Use the existing email state if available

    // Prompt for email only if not already provided
    if (!finalEmail) {
      if (window.confirm('Enter your email for potential contact?')) {
        const userEmail = prompt('Please enter your email:');
        if (userEmail) {
          setEmail(userEmail); // Update state
          finalEmail = userEmail; // Use the provided email
        }
      }
    }

    // Save to Firestore once with the final email (or null if none provided)
    await addDoc(collection(db, 'quizResults'), {
      userId,
      score: finalScore,
      timeTaken,
      timestamp: serverTimestamp(),
      email: finalEmail || null,
      rank: 0,
    });

    setStage('completion');
  }
}, [currentQuestion, selectedOptions, setStage, setScore, shuffledQuestions, userId, timeTaken, email]);

  const currentQ = shuffledQuestions[currentQuestion] || questions.questions[0];
  const questionText = currentQ.english;
  const options = currentQ.options;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      transition={{ duration: 0.5 }}
      className="quiz-container"
    >
      <motion.p
        className="prize-announcement"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        🎉 Contest Ended 🎉
      </motion.p>
      <h1 className="quiz-title">Question {currentQuestion + 1}/10</h1>
      <motion.div
        className="question-card"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <p className="quiz-question">{questionText}</p>
        <div className="options-container">
          {Object.entries(options).map(([key, value]) => (
            <motion.button
              key={key}
              onClick={() => handleOptionSelect(key)}
              className={`option ${selectedOptions[currentQuestion] === key ? 'selected' : ''}`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {value}
            </motion.button>
          ))}
        </div>
      </motion.div>
      <motion.button
        onClick={handleNext}
        className="next-button"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {currentQuestion === 9 ? 'Finish' : 'Next'}
      </motion.button>
    </motion.div>
  );
};

export default Quiz;
