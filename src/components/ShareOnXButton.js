// src/components/ShareOnXButton.js
import React from 'react';
import { motion } from 'framer-motion';

const ShareOnXButton = ({ userId, score }) => {

  const handleShareOnX = () => {
    
    const quizLink = encodeURIComponent("https://your-quiz-website.com"); // IMPORTANT: Replace with your actual quiz URL
    const hashtags = encodeURIComponent("JrNTRQuiz,FanQuiz,Tollywood,Quiz");

    alert("Please download your certificate first (if you haven't) and then you can manually attach it to the tweet!");

    const tweetText = encodeURIComponent(
      `I just scored ${score}/10 in the Jr. NTR Ultimate Fan Quiz! Check out my certificate! 🎉 Think you can beat my score? Take the quiz now!`
    );

    const xUrl = `https://twitter.com/intent/tweet?text=${tweetText}&url=${quizLink}&hashtags=${hashtags}`;

    window.open(xUrl, '_blank');
  };

  return (
    <motion.button
      onClick={handleShareOnX}
      className="share-on-x-button" // Define this style in Leaderboard.css or similar
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      style={{
        backgroundColor: '#1DA1F2', // X's brand blue
        color: 'white',
        padding: '12px 25px',
        borderRadius: '8px',
        fontSize: '1rem',
        fontWeight: 'bold',
        border: 'none',
        cursor: 'pointer',
        // Removed marginTop here, let the parent container manage spacing
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px'
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M18.901 1.153h3.684l-8.042 9.176L24 22.846h-7.406l-5.964-7.082L7.537 22.846H.701l8.606-9.83L0 1.154h7.581l4.819 6.23L18.901 1.153zm-.493 2.193l-6.862 8.894-7.084-8.894H1.98L9.261 12.3l-7.394 9.49h1.76l6.63-8.586 7.085 8.586h1.763L14.773 11.02 21.666 2.65h-2.198z"/>
      </svg>
      Share on X
    </motion.button>
  );
};

export default ShareOnXButton;