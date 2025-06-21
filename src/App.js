import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import OpeningAnimation from './components/OpeningAnimation';
import Intro from './components/Intro';
import Quiz from './components/quiz';
import Completion from './components/Completion';
import Leaderboard from './components/Leaderboard';
import './App.css';

const App = () => {
  const [stage, setStage] = useState('animation');
  const [userId, setUserId] = useState('');
  const [score, setScore] = useState(0);

  const handleStageChange = (newStage) => {
    console.log('Changing stage to:', newStage, 'with userId:', userId);
    setStage(newStage);
  };

  return (
    <div className="app-container">
      <AnimatePresence mode="wait">
        {stage === 'animation' && (
          <motion.div
            key="animation"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <OpeningAnimation setStage={handleStageChange} />
          </motion.div>
        )}
        {stage === 'intro' && (
          <motion.div
            key="intro"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Intro setStage={handleStageChange} setUserId={setUserId} />
          </motion.div>
        )}
        {stage === 'quiz' && (
          <motion.div
            key="quiz"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Quiz setStage={handleStageChange} userId={userId} setScore={setScore} />
          </motion.div>
        )}
        {stage === 'completion' && (
          <motion.div
            key="completion"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Completion setStage={handleStageChange} score={score} userId={userId} />
          </motion.div>
        )}
        {stage === 'Leaderboard' && (
          <motion.div
            key="leaderboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Leaderboard setStage={handleStageChange} currentUserId={userId} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;