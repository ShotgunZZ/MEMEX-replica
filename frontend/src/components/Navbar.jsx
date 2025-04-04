import React from 'react';

/**
 * Renders the navigation bar.
 * TODO: Implement user authentication state (Login/Register vs Profile/Logout).
 * @returns {React.ReactElement} The Navbar component.
 */
const Navbar = () => {
  return (
    <nav style={styles.navbar}>
      <div style={styles.logo}>Meme AI Dashboard</div>
      {/* Placeholder for Login/Register buttons */}
      <div style={styles.authButtons}>
        <button style={styles.button}>Login</button>
        <button style={styles.button}>Register</button>
      </div>
      {/* TODO: Conditionally render User Profile/Logout based on auth state */}
    </nav>
  );
};

const styles = {
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem 2rem',
    backgroundColor: '#2c3e50',
    color: 'white',
  },
  logo: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
  },
  authButtons: {
    display: 'flex',
    gap: '1rem',
  },
  button: {
    padding: '0.5rem 1rem',
    cursor: 'pointer',
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
  }
};

export default Navbar; 