# AI Development Guide: Meme AI Agent Dashboard Replication

**Version:** 1.0
**Date:** March 30, 2024
**Related PRD:** `prd.md` (Version 1.1)

## Introduction

This guide outlines a suggested step-by-step process for an AI developer to build the Meme AI Agent Dashboard application, based on the requirements specified in `prd.md`. The approach emphasizes incremental development, building core functionality first and then adding features individually.

**Goal:** To construct a working application matching the PRD by completing each step sequentially.

**Note:** Refer to `prd.md` for detailed functional, non-functional, and UI/UX requirements for each feature.

## Phase 1: Project Setup & Core Infrastructure

**Objective:** Establish the basic project structure, development environments, and core backend/frontend frameworks.

1.  **Environment Setup:**
    *   Set up the chosen backend environment (e.g., Python virtual environment, Node.js). Install the selected backend framework (e.g., Django, Flask, FastAPI, Express).
    *   Set up the chosen frontend development environment (Node.js). Install the selected frontend library/framework (e.g., React, Vue, Svelte) and necessary build tools (e.g., Vite, `react-scripts`).
    *   Configure the chosen database (e.g., PostgreSQL, MySQL, SQLite) and ensure the backend can connect to it.
    *   Initialize version control (Git) and create a `.gitignore` file.
2.  **Project Structure:**
    *   Create root directories (e.g., `backend/`, `frontend/`).
    *   Establish basic internal structure within backend and frontend (e.g., `src/`, `components/`, `services/` for frontend; app structure, `views/`, `models/` for backend).
3.  **Backend - Basic API Setup:**
    *   Configure the backend framework to serve a basic API.
    *   Implement a simple health check endpoint (e.g., `/api/health`) to verify the backend is running.
    *   Set up CORS configuration to allow requests from the frontend development server (e.g., `http://localhost:3000` or similar).
    *   Implement secure handling/loading mechanism for external API keys (DexTools, StockGeist) - e.g., environment variables, configuration files.
4.  **Frontend - Basic Setup:**
    *   Initialize the frontend application using the chosen framework/tools.
    *   Create basic layout components: `Navbar` and `Footer` (initially static placeholders).
    *   Implement basic routing if the application requires multiple pages (even if only the main dashboard page exists initially).
    *   Create a basic API service module to handle communication with the backend API. Test connection with the backend `/api/health` endpoint.

## Phase 2: Feature Implementation - Top Traded Tokens

**Objective:** Implement the core data display feature for top traded tokens.

5.  **Backend - DexTools Integration & Endpoint:**
    *   Install and utilize a DexTools API wrapper library (e.g., `dextools-python==0.3.2`). Initialize the client with the API key.
    *   Implement the logic to fetch **Hot Pools** data using library functions (e.g., `dextools.get_ranking_hotpools`).
    *   *Handle potential empty results:* Note that some API plans might return 0 results for `/hotpools`.
    *   Iterate through the results (if any) and attempt to identify the pool address. Use another library function (e.g., `dextools.get_pool_price`) to fetch details like price and variation for each pool/token.
    *   Combine and process the data obtained from the library calls into the required structure (Rank, Name, Symbol, Price, Change, Volume), noting potentially unavailable fields.
    *   Create the API endpoint (e.g., `/api/top-rated-tokens`) that serves this processed data.
    *   Include robust error handling for library function calls and potential missing data.
6.  **Frontend - Top Traded Tokens Component:**
    *   Create the `TopTradedTokens` display component.
    *   Implement logic to fetch data from the backend `/api/top-rated-tokens` endpoint using the API service module.
    *   Display the data in a table format as specified in the PRD (Rank, Name/Icon/Symbol, Price, Change, Volume).
    *   Implement the interactive tabs ("24H", "6H", "5M") to update the displayed Price, Change, and Volume data based on the selected timeframe.
    *   Implement styling according to PRD visual requirements (colors for change, number formatting, layout).
    *   Implement the auto-refresh mechanism (e.g., fetching data every 40 seconds).
    *   Implement error handling for data fetching and image loading (fallback icon).

## Phase 3: Feature Implementation - Trending on X

**Objective:** Implement the display for social media trending data.

7.  **Backend - StockGeist Integration & Endpoint:**
    *   Implement the logic to fetch data from the StockGeist API (`/crypto/global/hist/message-metrics` for predefined tokens) using the securely stored API key.
    *   Process the data if necessary.
    *   Create the API endpoint (e.g., `/api/token-score`) to serve this data.
    *   Include error handling for StockGeist API calls (including timeouts).
8.  **Frontend - Trending on X Component:**
    *   Create the `TrendingOnX` display component.
    *   Implement logic to fetch data from the backend `/api/token-score` endpoint.
    *   Display the data using a suitable format (e.g., cards or list) as per PRD requirements.
    *   Implement styling.

## Phase 4: Feature Implementation - User Authentication

**Objective:** Implement user registration, login, and logout functionality.

9.  **Backend - Authentication Logic & Endpoints:**
    *   Configure the backend framework's authentication system or implement custom logic.
    *   Set up the User model in the database.
    *   Implement secure password hashing.
    *   Create API endpoints for: User Registration, User Login (verify credentials, create session/token), User Logout (invalidate session/token).
    *   Implement endpoint protection if necessary (e.g., ensure only logged-in users can access certain future features, though not strictly required by current core features).
10. **Frontend - Authentication UI & State Management:**
    *   Create UI components for Login and Registration forms.
    *   Implement logic to send form data to the backend authentication endpoints.
    *   Handle responses (success/error) from the backend.
    *   Implement frontend state management to track user authentication status (logged in/out).
    *   Update the Navbar to conditionally display Login/Register buttons or User Profile/Logout options based on auth state.

## Phase 5: Static Content & Final Touches

**Objective:** Add remaining static sections and refine the application.

11. **Frontend - Static Sections:**
    *   Create placeholder components for `HeroSection`, `AISmartSignals`, and `SmartMoney` as defined in the PRD.
    *   Apply styling to match the desired look and feel.
    *   (Note: If `AISmartSignals` or `SmartMoney` require specific backend data not yet defined, use dummy data or implement their respective backend endpoints/frontend fetching logic now if requirements are clear).
12. **Refinement & Testing:**
    *   Review and refine overall application styling and responsiveness (primarily desktop).
    *   Perform thorough testing of all features: data display, timeframe switching, auto-refresh, authentication flow, error handling.
    *   Ensure all non-functional requirements (performance, reliability, security basics) from the PRD are reasonably addressed.
13. **Documentation:**
    *   Create/update a `README.md` file with setup instructions (environment, dependencies, database setup, running the app) and API key configuration details.

## Completion

Following these steps should result in a functional replica of the Meme AI Agent Dashboard application meeting the requirements outlined in `prd.md`, built in an incremental and manageable way. 