import React from 'react';

/**
 * Renders the application footer.
 * @returns {React.ReactElement} The Footer component.
 */
const Footer = () => {
  return (
    <footer style={styles.footer}>
      <p>&copy; {new Date().getFullYear()} Meme AI Dashboard Replica. All rights reserved.</p>
      {/* Add other essential links if needed */}
    </footer>
  );
};

const styles = {
  footer: {
    textAlign: 'center',
    padding: '1rem',
    marginTop: '2rem',
    backgroundColor: '#ecf0f1',
    color: '#2c3e50',
    borderTop: '1px solid #bdc3c7',
  }
};

export default Footer; 