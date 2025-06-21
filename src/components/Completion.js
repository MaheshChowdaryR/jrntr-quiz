import { motion } from 'framer-motion';
import './Completion.css'; // Ensure this CSS file is correctly styled for the main completion page

const Completion = ({ score, userId, setStage }) => {
  const handleLeaderboard = () => {
    console.log('Attempting to navigate to leaderboard');
    setStage('Leaderboard');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="completion-container"
    >
      <h1 className="completion-title">Quiz Completed!</h1>
      <p className="completion-score">Your Score: {score}/10</p>
      <motion.div className="button-group">
        <motion.button
          onClick={handleLeaderboard}
          className="next-button"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          Leaderboard
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default Completion;