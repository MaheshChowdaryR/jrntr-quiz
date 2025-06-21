// src/components/DownloadCertificateButton.js
import React from 'react';
import { motion } from 'framer-motion';
import html2canvas from 'html2canvas';

const DownloadCertificateButton = ({ score, userId }) => {
  const getDisplayUserId = (fullUserId) => {
    return fullUserId.split('-')[0];
  };

  const handleDownloadCertificate = async () => {
    console.log('Attempting to generate certificate image');

    const displayUserId = getDisplayUserId(userId);

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
            <p style="font-family: 'Poppins', sans-serif; font-size: 20px; margin-top: 25px; margin-bottom: 0;"><a href="https://your-quiz-website.com" style="color: #f6e05e; text-decoration: none; font-weight: bold;">www.your-quiz-website.com</a></p>
        </div>
      </div>
    `;

    const element = document.createElement('div');
    element.innerHTML = certificateContent;
    element.style.position = 'absolute';
    element.style.top = '-9999px';
    element.style.left = '-9999px';
    element.style.width = '1100px'; // Crucial: Match the intended render width
    element.style.height = '750px'; // Crucial: Match the intended render height
    element.style.backgroundColor = 'transparent'; // Ensure no default background for the temp div
    document.body.appendChild(element);

    try {
      const canvas = await html2canvas(element, {
        scale: 2, // Keep scale high for better image quality (e.g., 2 for 2x resolution)
        useCORS: true, // Enable if you have cross-origin images (like background)
        logging: true,
        backgroundColor: null // Important: prevents html2canvas from adding a white background
      });

      // Create a link element for download
      const link = document.createElement('a');
      link.download = `JrNTR_Certificate_${displayUserId}.png`; // Set download file name
      link.href = canvas.toDataURL('image/png'); // Get image data as PNG
      document.body.appendChild(link); // Append to body (temporarily)
      link.click(); // Programmatically click the link to trigger download
      document.body.removeChild(link); // Clean up the link element

      console.log('Certificate image saved successfully');

    } catch (error) {
      console.error('Certificate image generation error:', error);
      alert('Failed to generate certificate image. Check console for details. Ensure image_757448.jpg and ntr-logo.jpg are in /public/ or use valid URLs.');
    } finally {
      document.body.removeChild(element); // Clean up the temporary HTML element
    }
  };

  return (
    <motion.button
      onClick={handleDownloadCertificate}
      className="next-button certificate-button"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      Download Certificate (Image)
    </motion.button>
  );
};

export default DownloadCertificateButton;