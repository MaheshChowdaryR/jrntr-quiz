// src/components/Leaderboard.js
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { db } from '../index';
import { collection, getDocs } from 'firebase/firestore';
import './Leaderboard.css';
import ShareOnXButton from './ShareOnXButton'; // Import Share on X button
import DownloadCertificateButton from './DownloadCertificateButton'; // Import Download Certificate button

const Leaderboard = ({ setStage, currentUserId = '' }) => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Store the original currentUserId for accurate comparison
  const originalCleanCurrentUserId = currentUserId.trim().toLowerCase();

  useEffect(() => {
    console.log('Fetching leaderboard data...');
    const fetchLeaderboard = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'quizResults'));
        const results = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            userId: data.userId?.trim() || 'Unknown',
            score: data.score || 0,
            timeTaken: data.timeTaken || 99999,
            timestamp: data.timestamp?.toDate() || new Date()
          };
        });

        results.sort((a, b) => {
          if (b.score !== a.score) return b.score - a.score;
          if (a.timeTaken !== b.timeTaken) return a.timeTaken - b.timeTaken;
          return a.timestamp - b.timestamp;
        });

        const ranked = results.map((entry, index) => ({
          ...entry,
          rank: index + 1
        }));

        setLeaderboard(ranked);
        console.log('Full Leaderboard (internal storage):', ranked.map(e => ({ userId: e.userId, rank: e.rank })));
      } catch (err) {
        console.error('Firestore Error:', err);
        setError('Failed to load leaderboard.');
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  if (loading) {
    return (
      <motion.div className="leaderboard-container" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1>Loading...</h1>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div className="leaderboard-container" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1>Error</h1>
        <p>{error}</p>
      </motion.div>
    );
  }

  const getDisplayUserId = (fullUserId) => {
    return fullUserId.split('-')[0];
  };

  const top5 = leaderboard.slice(0, 5);
  console.log('Top 5 entries:', top5.map(e => ({ userId: e.userId, rank: e.rank })));

  const currentUserEntry = leaderboard.find(entry =>
    entry.userId.trim().toLowerCase() === originalCleanCurrentUserId
  );
  console.log('Current User Entry (Raw):', currentUserEntry ? { userId: currentUserEntry.userId, rank: currentUserEntry.rank } : 'Not found');

  const isUserInTop5 = top5.some(entry =>
    entry.userId.trim().toLowerCase() === originalCleanCurrentUserId
  );
  console.log('Is User in Top 5:', isUserInTop5);

  const getTrophyIcon = (rank) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return rank;
  };

  return (
    <motion.div className="leaderboard-container" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h1 className="leaderboard-title">Jr. NTR Fan Quiz Leaderboard</h1>

      <motion.div className="leaderboard-table" initial={{ y: 50 }} animate={{ y: 0 }}>
        <div className="table-header">
          <span>RANK</span>
          <span>USER ID</span>
          <span>SCORE</span>
        </div>

        {top5.map((entry, index) => {
          const isCurrentUser = entry.userId.trim().toLowerCase() === originalCleanCurrentUserId;
          return (
            <motion.div
              key={entry.id}
              className={`table-row ${isCurrentUser ? 'highlight-row' : ''}`}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <span>{getTrophyIcon(entry.rank)}</span>
              <span>{getDisplayUserId(entry.userId)}</span>
              <span>{entry.score}/10</span>
            </motion.div>
          );
        })}

        {currentUserEntry && !isUserInTop5 && (
          <>
            <div className="ellipsis-row">...</div>
            <motion.div
              className="table-row highlight-row"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ type: 'spring', stiffness: 200 }}
            >
              <span>{getTrophyIcon(currentUserEntry.rank)}</span>
              <span>{getDisplayUserId(currentUserEntry.userId)}</span>
              <span>{currentUserEntry.score}/10</span>
            </motion.div>
          </>
        )}
      </motion.div>

      <motion.div className="leaderboard-actions">
        <motion.button
          onClick={() => setStage('animation')}
          className="back-button"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          Back to Start
        </motion.button>

        {/* Render Download Certificate Button if currentUserEntry is available */}
        {currentUserEntry && (
          <DownloadCertificateButton
            userId={currentUserEntry.userId}
            score={currentUserEntry.score}
          />
        )}

        {/* Render Share on X Button if currentUserEntry is available */}
        {currentUserEntry && (
          <ShareOnXButton
            userId={currentUserEntry.userId}
            score={currentUserEntry.score}
          />
        )}
      </motion.div>
    </motion.div>
  );
};

export default Leaderboard;