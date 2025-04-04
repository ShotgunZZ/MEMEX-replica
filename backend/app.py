from flask import Flask, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv
# import requests - No longer needed for Dextools calls
import logging
from dextools_python import DextoolsAPIV2 # Import the library

# Configure logging
logging.basicConfig(level=logging.INFO)

# Load environment variables from .env file
load_dotenv()
# Retrieve API key (ensure .env file is set up correctly)
DEXTOOLS_API_KEY = os.getenv("DEXTOOLS_API_KEY")

# Initialize Flask app
app = Flask(__name__)

# --- Initialize Dextools Client --- 
# Use "trial" plan as it passed the basic test, even if /hotpools returns 0.
# The library might handle plan differences internally or this might still be a limitation.
try:
    dextools = DextoolsAPIV2(DEXTOOLS_API_KEY, plan="trial") if DEXTOOLS_API_KEY else None
    if dextools:
        logging.info("DextoolsAPIV2 client initialized.")
    else:
         logging.error("Dextools API key not found. Cannot initialize client.")
except Exception as client_init_e:
    logging.error(f"Failed to initialize DextoolsAPIV2 client: {client_init_e}")
    dextools = None
# --------------------------------

# Configure CORS
# Allow requests from the typical Vite development server URL
CORS(app, resources={r"/api/*": {"origins": "http://localhost:5173"}}) 

# --- Constants ---
# Revert base URL to the one from the spec that passed the simple test
DEXTOOLS_API_BASE_URL = "https://public-api.dextools.io/trial"

# --- API Endpoints ---

@app.route('/api/health', methods=['GET'])
def health_check():
  """
  Health check endpoint to verify the backend is running.
  Returns:
      Response: JSON response indicating the status.
  """
  # Simple health check endpoint
  return jsonify({"status": "ok", "message": "Backend is running"}), 200

@app.route('/api/top-rated-tokens', methods=['GET'])
def get_top_rated_tokens():
    """
    Fetches top tokens using the dextools-python library.
    Attempts to get hotpools, then fetches details for each.
    Returns:
        Response: JSON list of top tokens with details or error message.
    """
    if not dextools:
        return jsonify({"error": "Dextools client not initialized. Check API Key."}), 500

    chain = 'ether'
    processed_tokens_data = []
    try:
        # 1. Fetch the list of hot pools using the library
        logging.info(f"Fetching hot pools list via dextools-python library ({chain})")
        # Attempt to use get_ranking_hotpools
        hot_pools_response = dextools.get_ranking_hotpools("ether")
        hot_pools = hot_pools_response.get("data", [])
        # hot_pools_response = dextools.get_ranking_hotpools(chain)
        # hot_pools = hot_pools_response if isinstance(hot_pools_response, list) else []
        logging.info(f"Library returned {len(hot_pools)} hot pools.")

        if not hot_pools:
            logging.warning("Received 0 hot pools from the library. Potential API plan limitation or no current hot pools.")
            # Return empty list if no hot pools are found
            return jsonify([]), 200

        # 2. Fetch detailed price data for each pool (Top 10)
        for i, pool_summary in enumerate(hot_pools[:10]):
            # --- Extract necessary info from pool_summary --- 
            main_token = pool_summary.get('mainToken', {})
            pool_address = pool_summary.get('address') or pool_summary.get('id') # Still assuming field name
            rank = pool_summary.get('rank', i + 1)
            name = main_token.get('name', 'N/A')
            symbol = main_token.get('symbol', 'N/A')
            logo = None # Logo likely unavailable
            # ---------------------------------------------------

            # Initialize detail fields
            price_usd = None
            change_data = {"h24": None, "h6": None, "m5": None}
            volume_data = {"h24": None, "h6": None, "m5": None}

            if pool_address:
                try:
                    logging.info(f"Fetching price details for pool {pool_address} via library")
                    price_details_response = dextools.get_pool_price(chain, pool_address)
                    
                    # --- Correctly Map library response fields --- 
                    # Access the inner 'data' dictionary
                    price_data = price_details_response.get('data', {}) if price_details_response else {}

                    price_usd = price_data.get('price') 
                    change_data['h24'] = price_data.get('variation24h')
                    change_data['h6'] = price_data.get('variation6h') # Use variation6h for 6h change
                    change_data['m5'] = price_data.get('variation5m') # Use variation5m for 5m change
                    volume_data['h24'] = price_data.get('volume24h')
                    volume_data['h6'] = price_data.get('volume6h')   # Use volume6h for 6h volume
                    volume_data['m5'] = price_data.get('volume5m')   # Use volume5m for 5m volume
                    # ----------------------------------------------

                except Exception as price_e:
                    logging.warning(f"Library failed to fetch/process price for pool {pool_address} ({name}): {price_e}")
            else:
                logging.warning(f"Could not find address for pool rank {rank} ({name}) in library response. Skipping price details.")

            # Append combined data
            processed_tokens_data.append({
                "rank": rank,
                "name": name,
                "symbol": symbol,
                "logo": logo, 
                "price": price_usd,
                "change": change_data,
                "volume": volume_data
            })

        return jsonify(processed_tokens_data), 200

    except Exception as e:
        logging.error(f"An error occurred using the dextools-python library (get_ranking_hotpools): {e}")
        return jsonify({"error": "An internal error occurred while fetching data via Dextools library."}), 500

# --- Main Execution ---

if __name__ == '__main__':
  # Get port from environment variable or default to 5000
  port = int(os.environ.get('PORT', 5000))
  # Run the app in debug mode for development
  app.run(debug=True, port=port) 