import React, { useState, useEffect, useCallback } from 'react';

// Helper function to format large numbers (Volume)
const formatVolume = (num) => {
  if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(2) + 'M';
  } else if (num >= 1_000) {
    return (num / 1_000).toFixed(2) + 'K';
  }
  return num ? num.toFixed(2) : '-';
};

// Helper function to format price
const formatPrice = (num) => {
  if (num == null) return '-';
  if (num < 0.000001) {
    return '$<0.000001';
  }
  return '$' + num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 8 });
};

// Helper function to get change color
const getChangeColor = (change) => {
  if (change > 0) return 'green';
  if (change < 0) return 'red';
  return 'inherit'; // Default color
};

// Default token icon if logo fails to load
const defaultIcon = 'https://via.placeholder.com/20?text=?'; 

/**
 * Fetches and displays the top traded tokens from the backend.
 * Includes timeframe selection and auto-refresh.
 * @returns {React.ReactElement} The TopTradedTokens component.
 */
const TopTradedTokens = () => {
  // State for storing token data
  const [tokens, setTokens] = useState([]);
  // State for loading status
  const [loading, setLoading] = useState(true);
  // State for error messages
  const [error, setError] = useState(null);
  // State for selected timeframe (e.g., 'h24', 'h6', 'm5')
  const [timeframe, setTimeframe] = useState('h24'); // Default to 24H

  // Callback function to fetch token data
  const fetchData = useCallback(async () => {
    setLoading(true); // Set loading true when fetching starts
    setError(null);
    try {
      // Fetch data from the backend endpoint
      const response = await fetch('http://127.0.0.1:5000/api/top-rated-tokens');
      if (!response.ok) {
        // Throw error if response is not OK
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }
      // Parse JSON data
      const data = await response.json();
      // Update tokens state
      setTokens(data);
    } catch (e) {
      // Log and set error state if fetch fails
      console.error("Failed to fetch top traded tokens:", e);
      setError(e.message);
    } finally {
      // Set loading false when fetching finishes (success or fail)
      setLoading(false);
    }
  }, []); // No dependencies, fetchData itself doesn't change

  // Effect for initial data fetch and setting up auto-refresh
  useEffect(() => {
    fetchData(); // Fetch data on initial mount

    // Set up interval for auto-refresh (e.g., every 40 seconds)
    const intervalId = setInterval(fetchData, 40000);

    // Cleanup function to clear interval on component unmount
    return () => clearInterval(intervalId);
  }, [fetchData]); // Depend on fetchData callback

  // Handler for image loading errors
  const handleImageError = (e) => {
    e.target.src = defaultIcon; // Set to default icon on error
  };

  // Render loading state
  if (loading && tokens.length === 0) return <div style={styles.message}>Loading tokens...</div>;
  // Render error state
  if (error) return <div style={styles.error}>Error loading tokens: {error}</div>;

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Top Traded Tokens</h2>
      {/* Timeframe selection tabs */}
      <div style={styles.tabs}>
        {['h24', 'h6', 'm5'].map(tf => (
          <button
            key={tf}
            style={{
              ...styles.tabButton,
              ...(timeframe === tf ? styles.activeTab : {}),
            }}
            // Update timeframe state on click
            onClick={() => setTimeframe(tf)}
          >
            {/* Display user-friendly timeframe names */}
            {tf === 'h24' ? '24H' : tf === 'h6' ? '6H' : '5M'}
          </button>
        ))}
      </div>

      {/* Tokens table */}
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Rank</th>
            <th style={styles.th}>Name</th>
            <th style={styles.th}>Price</th>
            <th style={styles.th}>Change (%)</th>
            <th style={styles.th}>Volume</th>
          </tr>
        </thead>
        <tbody>
          {tokens.map((token) => (
            <tr key={token.rank} style={styles.tr}>
              {/* Rank column */}
              <td style={styles.td}>{token.rank}</td>
              {/* Name column with icon and symbol */}
              <td style={styles.tdName}>
                <img
                  src={token.logo || defaultIcon} // Use token logo or default
                  alt={`${token.symbol} logo`}
                  style={styles.tokenIcon}
                  onError={handleImageError} // Handle image loading errors
                />
                <span style={styles.tokenName}>{token.name}</span>
                <span style={styles.tokenSymbol}>({token.symbol})</span>
              </td>
              {/* Price column */}
              <td style={styles.td}>{formatPrice(token.price)}</td>
              {/* Change column based on selected timeframe */}
              <td style={{ ...styles.td, color: getChangeColor(token.change[timeframe]) }}>
                {token.change[timeframe] != null ? `${token.change[timeframe].toFixed(2)}%` : '-'}
              </td>
              {/* Volume column based on selected timeframe */}
              <td style={styles.td}>{formatVolume(token.volume[timeframe])}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {loading && <div style={styles.loadingOverlay}>Updating...</div>} 
    </div>
  );
};

// Basic styling for the component
const styles = {
  container: {
    fontFamily: 'Arial, sans-serif',
    padding: '20px',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    position: 'relative', // For loading overlay
  },
  header: {
    textAlign: 'center',
    color: '#343a40',
    marginBottom: '20px',
  },
  tabs: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '20px',
    gap: '10px',
  },
  tabButton: {
    padding: '8px 16px',
    cursor: 'pointer',
    border: '1px solid #dee2e6',
    backgroundColor: 'white',
    borderRadius: '4px',
    fontSize: '0.9rem',
    fontWeight: '500',
  },
  activeTab: {
    backgroundColor: '#007bff',
    color: 'white',
    borderColor: '#007bff',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    backgroundColor: 'white',
  },
  th: {
    backgroundColor: '#e9ecef',
    color: '#495057',
    padding: '12px',
    textAlign: 'left',
    borderBottom: '2px solid #dee2e6',
    fontSize: '0.9rem',
    fontWeight: '600',
  },
  tr: {
    '&:hover': {
      backgroundColor: '#f1f3f5',
    },
  },
  td: {
    padding: '12px',
    borderBottom: '1px solid #dee2e6',
    fontSize: '0.9rem',
    verticalAlign: 'middle',
  },
  tdName: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '12px',
    borderBottom: '1px solid #dee2e6',
    fontSize: '0.9rem',
  },
  tokenIcon: {
    width: '20px',
    height: '20px',
    borderRadius: '50%',
    objectFit: 'cover',
  },
  tokenName: {
    fontWeight: '500',
  },
  tokenSymbol: {
    color: '#6c757d',
    fontSize: '0.85rem',
  },
  message: {
    textAlign: 'center',
    padding: '20px',
    color: '#6c757d',
  },
  error: {
    textAlign: 'center',
    padding: '20px',
    color: 'red',
    fontWeight: 'bold',
  },
  loadingOverlay: {
    position: 'absolute',
    top: '50px', // Below header and tabs
    left: '0',
    right: '0',
    bottom: '0',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: '#007bff',
    fontSize: '1.1rem',
    fontWeight: 'bold',
    zIndex: 10, 
  }
};

export default TopTradedTokens; 