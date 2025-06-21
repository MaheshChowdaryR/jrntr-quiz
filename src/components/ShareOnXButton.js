// src/components/ShareOnXButton.js
import React from 'react';
import { motion } from 'framer-motion';
import html2canvas from 'html2canvas'; // Import html2canvas for certificate generation

const ShareOnXButton = ({ userId, score }) => {
  // Helper function to get display userId (same as previously)
  const getDisplayUserId = (fullUserId) => {
    return fullUserId.split('-')[0];
  };

  const handleShareOnX = async () => { // Make this function async to handle html2canvas
    const displayUserId = getDisplayUserId(userId);

    // --- Start Certificate Generation and Download Logic (Now integrated with ORIGINAL HTML) ---
    console.log('Attempting to generate and download certificate image with original format before sharing on X.');

    // THIS IS THE ORIGINAL certificateContent HTML from your DownloadCertificateButton.js
    const certificateContent = `
      <div style="width: 1100px; height: 750px; padding: 0; text-align: center; background-color: #1a202c; color: #fff; position: relative; overflow: hidden; display: flex; flex-direction: column; justify-content: space-between; align-items: center; border: 10px solid #f6e05e; box-sizing: border-box;">
        
        <img src="images/ntr-logo.jpg" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; opacity: 0.6; z-index: 1;" alt="Certificate Background"/>
        
        <div style="position: relative; z-index: 2; width: 100%; height: 100%; display: flex; flex-direction: column; justify-content: space-between; align-items: center; padding: 50px 70px;">
            
            <div style="width: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; margin-bottom: 20px;">
                <img src="images/ntr-background.jpg" style="width: 100px; height: auto; margin-bottom: 15px; border-radius: 50%; border: 3px solid #f6e05e;" alt="NTR Logo"/>
                <h1 style="font-family: 'Playfair Display', serif; font-size: 60px; margin: 0; color: #f6e05e; text-shadow: 4px 4px 10px rgba(0,0,0,0.7); line-height: 1.1; font-weight: 700; letter-spacing: 2px;">Certificate of Achievement</h1>
            </div>

            <div style="flex-grow: 1; display: flex; flex-direction: column; justify-content: center; align-items: center; width: 100%;">
                <p style="font-family: 'Poppins', sans-serif; font-size: 28px; margin-bottom: 10px; color: #eee;text-shadow: 4px 4px 10px rgba(0,0,0,0.7);">Tiger Nation presented to</p>
                <h2 style="font-family: 'Playfair Display', serif; font-size: 58px; margin-bottom: 25px; text-transform: uppercase; color: #ffffff;text-shadow: 4px 4px 10px rgba(0,0,0,0.7); border-bottom: 4px double #f6e05e; padding-bottom: 8px; line-height: 1.1; font-weight: 700; letter-spacing: 1px; text-shadow: 1px 1px 3px rgba(0,0,0,0.5);"> ${displayUserId}</h2>
                <p style="font-family: 'Poppins', sans-serif; font-size: 28px; margin-bottom: 10px; color: #eee;text-shadow: 4px 4px 10px rgba(0,0,0,0.7);">for successfully completing the</p>
                <h3 style="font-family: 'Playfair Display', serif; font-size: 45px; margin-bottom: 25px; color: #f6e05e;text-shadow: 4px 4px 10px rgba(0,0,0,0.7); line-height: 1.2; font-weight: 600;">Jr. NTR Ultimate Fan Quiz</h3>
                <p style="font-family: 'Poppins', sans-serif; font-size: 28px; margin-bottom: 10px; color: #eee;text-shadow: 4px 4px 10px rgba(0,0,0,0.7);">with an outstanding score of</p>
                <p style="font-family: 'Playfair Display', serif; font-size: 60px; margin-bottom: 0; color: #ffffff;text-shadow: 4px 4px 10px rgba(0,0,0,0.7); font-weight: bold; line-height: 1.1; text-shadow: 2px 2px 5px rgba(0,0,0,0.7);">${score}/10</p>
            </div>
            
            <div style="width: 100%; margin-top: auto; padding-top: 35px; border-top: 1px dashed rgba(255,255,255,0.4); display: flex; justify-content: space-between; align-items: flex-end;">
                <p style="font-family: 'Poppins', sans-serif; font-size: 12px; margin: 0; color: #eee;">Date: ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                <p style="font-family: 'Poppins', sans-serif; font-size: 12px; margin: 0; color: #eee;">@TaRRRock_Twin3</p>
            </div>
            <p style="font-family: 'Poppins', sans-serif; font-size: 20px; margin-top: 25px; margin-bottom: 0;"><a href="https://jntrquiz.web.app" style="color: #f6e05e; text-decoration: none; font-weight: bold;">www.jntrquiz.web.app</a></p>
        </div>
      </div>
    `;

    // Temporary element to render certificate HTML for html2canvas
    const element = document.createElement('div');
    element.innerHTML = certificateContent;
    element.style.position = 'absolute';
    element.style.left = '-9999px'; // Hide it off-screen
    element.style.width = '1100px'; // Crucial: Match the intended render width
    element.style.height = '750px'; // Crucial: Match the intended render height
    element.style.backgroundColor = 'transparent'; // Ensure no default background for the temp div
    document.body.appendChild(element);

    try {
      const canvas = await html2canvas(element, {
        scale: 2, // High scale for better image quality
        useCORS: true, // Important for images loaded from different origins (if any)
        logging: true,
        backgroundColor: null // Prevents default white background from html2canvas
      });

      // Create a temporary link element to trigger download
      const link = document.createElement('a');
      link.download = `JrNTR_Certificate_${displayUserId}.png`; // Set filename
      link.href = canvas.toDataURL('image/png'); // Get image data as PNG
      link.click(); // Simulate a click to start download

      console.log('Certificate image downloaded successfully with original format.');
      alert("Your certificate has been downloaded! Now you can manually attach it to the tweet.");

    } catch (error) {
      console.error('Certificate image generation or download error:', error);
      alert('Failed to generate and download certificate. Check console for details. Ensure all images (ntr-logo.jpg, ntr-background.jpg) are in /public/ or use valid URLs.');
      return; // Stop execution if certificate fails to generate/download
    } finally {
      // Clean up the temporary element from the DOM
      if (element && document.body.contains(element)) {
        document.body.removeChild(element);
      }
    }
    // --- End Certificate Generation and Download Logic ---


    // --- Start X (Twitter) Share Logic ---
    const quizLink = encodeURIComponent("https://jntrquiz.web.app"); // Your actual quiz URL
    const hashtags = encodeURIComponent("JrNTRQuiz,FanQuiz");

    const tweetText = encodeURIComponent(
      `I just scored ${score}/10 in the Jr. NTR Ultimate Fan Quiz! Check out my certificate! 🎉 Think you can beat my score? Take the quiz now!`
    );

    const xUrl = `https://twitter.com/intent/tweet?text=${tweetText}&url=${quizLink}&hashtags=${hashtags}`;

    window.open(xUrl, '_blank'); // Open Twitter share dialog
    // --- End X (Twitter) Share Logic ---
  };

  return (
    <motion.button
      onClick={handleShareOnX}
      className="share-on-x-button" // Ensure this class is defined in your CSS
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
        <path d="M18.901 1.153h3.684l-8.667 9.946L23.472 22h-4.321l-7.46-8.91L7.153 22H3.59L12.518 11.055 3.393 1.153H7.81L14.07 8.35L18.901 1.153zm-.486 18.067h2.898L5.617 3.86H2.719l15.696 15.36z" />
      </svg>
      Share Score on X
    </motion.button>
  );
};

export default ShareOnXButton;