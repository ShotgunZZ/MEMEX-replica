import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import TopTradedTokens from './components/TopTradedTokens';
import './App.css'; // Keep or modify default styles as needed

/**
 * Main application component.
 * Sets up the basic layout and includes a health check for the backend.
 * @returns {React.ReactElement} The main App component.
 */
function App() {
  const [backendStatus, setBackendStatus] = useState('checking...');

  // Effect to check backend health on component mount
  useEffect(() => {
    // Fetch health status from the backend
    fetch('http://127.0.0.1:5000/api/health') // Explicitly use 127.0.0.1
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        // Update state with backend message
        setBackendStatus(`Backend: ${data.message}`);
      })
      .catch(error => {
        // Log error and update state
        console.error('Error fetching backend health:', error);
        setBackendStatus('Backend: Error connecting');
      });
  }, []); // Empty dependency array means this runs once on mount

  return (
    <div className="app-container" style={styles.appContainer}>
      <Navbar />
      <main style={styles.mainContent}>
        {/* Remove placeholder text */}
        {/* <h1>Welcome to the Meme AI Dashboard Replica</h1> */}
        {/* <p>Dashboard components will go here.</p> */}

        {/* Add the TopTradedTokens component */}
        <TopTradedTokens />

        {/* Display backend health status */}
        <p style={styles.statusText}>Status: {backendStatus}</p>
      </main>
      <Footer />
    </div>
  );
}

const styles = {
  appContainer: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh', // Ensure footer stays at the bottom
  },
  mainContent: {
    flex: 1, // Allow main content to grow and fill space
    padding: '2rem',
  },
  statusText: {
    marginTop: '1rem',
    fontStyle: 'italic',
    color: '#555',
  }
};

export default App;
