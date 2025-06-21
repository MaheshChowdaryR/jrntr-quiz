// src/components/Leaderboard.js
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { db } from '../index';
import { collection, getDocs } from 'firebase/firestore';
import './Leaderboard.css';
import ShareOnXButton from './ShareOnXButton'; // Import Share on X button

const Leaderboard = ({ currentUserId = '' }) => {
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

      {currentUserEntry && (
        <motion.div
          className="certificate-preview"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div
            className="certificate-content"
            dangerouslySetInnerHTML={{
              __html: `
                <div style="width: 100%; height: 100%; padding: 0; text-align: center; background-color: #1a202c; color: #fff; position: relative; overflow: hidden; display: flex; flex-direction: column; justify-content: space-between; align-items: center; border: 5px solid #f6e05e; box-sizing: border-box;">
                  <img src="images/ntr-logo.jpg" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; opacity: 0.6; z-index: 1;" alt="Certificate Background"/>
                  <div style="position: relative; z-index: 2; width: 100%; height: 100%; display: flex; flex-direction: column; justify-content: space-between; align-items: center; padding: 20px;">
                    <div style="width: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; margin-bottom: 10px;">
                      <img src="images/ntr-background.jpg" style="width: 50px; height: auto; margin-bottom: 10px; border-radius: 50%; border: 2px solid #f6e05e;" alt="NTR Logo"/>
                      <h1 style="font-family: 'Playfair Display', serif; font-size: 24px; margin: 0; color: #f6e05e; text-shadow: 2px 2px 5px rgba(0,0,0,0.7); line-height: 1.1; font-weight: 700; letter-spacing: 1px;">Certificate of Achievement</h1>
                    </div>
                    <div style="flex-grow: 1; display: flex; flex-direction: column; justify-content: center; align-items: center; width: 100%;">
                      <p style="font-family: 'Poppins', sans-serif; font-size: 14px; margin-bottom: 5px; color: #eee; text-shadow: 2px 2px 5px rgba(0,0,0,0.7);">Tiger Nation presented to</p>
                      <h2 style="font-family: 'Playfair Display', serif; font-size: 20px; margin-bottom: 10px; text-transform: uppercase; color: #ffffff; text-shadow: 2px 2px 5px rgba(0,0,0,0.7); border-bottom: 2px double #f6e05e; padding-bottom: 4px; line-height: 1.1; font-weight: 700; letter-spacing: 0.5px; text-shadow: 0.5px 0.5px 1px rgba(0,0,0,0.5);">${getDisplayUserId(currentUserEntry.userId)}</h2>
                      <p style="font-family: 'Poppins', sans-serif; font-size: 14px; margin-bottom: 5px; color: #eee; text-shadow: 2px 2px 5px rgba(0,0,0,0.7);">for successfully completing the</p>
                      <h3 style="font-family: 'Playfair Display', serif; font-size: 18px; margin-bottom: 10px; color: #f6e05e; text-shadow: 2px 2px 5px rgba(0,0,0,0.7); line-height: 1.2; font-weight: 600;">Jr. NTR Ultimate Fan Quiz</h3>
                      <p style="font-family: 'Poppins', sans-serif; font-size: 14px; margin-bottom: 5px; color: #eee; text-shadow: 2px 2px 5px rgba(0,0,0,0.7);">with an outstanding score of</p>
                      <p style="font-family: 'Playfair Display', serif; font-size: 24px; margin-bottom: 0; color: #ffffff; text-shadow: 2px 2px 5px rgba(0,0,0,0.7); font-weight: bold; line-height: 1.1; text-shadow: 1px 1px 2px rgba(0,0,0,0.7);">${currentUserEntry.score}/10</p>
                    </div>
                    <div style="width: 100%; margin-top: auto; padding-top: 15px; border-top: 1px dashed rgba(255,255,255,0.4); display: flex; justify-content: space-between; align-items: flex-end;">
                      <p style="font-family: 'Poppins', sans-serif; font-size: 10px; margin: 0; color: #eee;">Date: ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                      <p style="font-family: 'Poppins', sans-serif; font-size: 10px; margin: 0; color: #eee;">@TaRRRock_Twin3</p>
                    </div>
                    <p style="font-family: 'Poppins', sans-serif; font-size: 12px; margin-top: 10px; margin-bottom: 0;"><a href="https://jntrquiz.web.app" style="color: #f6e05e; text-decoration: none; font-weight: bold;">www.jntrquiz.web.app</a></p>
                  </div>
                </div>
              `
            }}
          />
        </motion.div>
      )}

      {currentUserEntry && (
        <ShareOnXButton
          userId={currentUserEntry.userId}
          score={currentUserEntry.score}
        />
      )}
    </motion.div>
  );
};

export default Leaderboard;