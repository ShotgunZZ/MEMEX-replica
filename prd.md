# PRD: Meme AI Agent Dashboard Replication

**Version:** 1.1
**Date:** March 30, 2024
**Author:** AI Assistant (based on user request)

## 1. Introduction

### 1.1. Overview
This document outlines the requirements for building a web application that replicates the **functionality and user experience** of the Meme AI Agent Dashboard. The application serves as a real-time dashboard displaying cryptocurrency token data, social media trends, and AI-driven signals to help users make informed trading decisions.

### 1.2. Goal
The primary goal is to create a web application that **functionally replicates** the Meme AI Agent Dashboard's user interface and features. The underlying technology stack can be chosen for **simplicity, efficiency, and maintainability**, rather than strictly mirroring the original implementation.

### 1.3. Target Audience
Crypto traders, investors, and enthusiasts looking for aggregated, real-time market data and sentiment analysis.

## 2. Functional Requirements

### 2.1. General
*   The application must provide a web-based frontend and a backend capable of serving data via API endpoints.
*   The frontend should consume data from the backend API.
*   The backend will integrate with external data sources/APIs (DexTools, StockGeist) and potentially process/cache data before serving it to the frontend.
*   **Implementation Note:** While the original used React/Django, the choice of frontend/backend frameworks is flexible, provided all functional requirements are met. Prioritize solutions that are efficient and maintainable.

### 2.2. Frontend Components & Features (User Experience Replication)

*   **Navbar:**
    *   Displays application branding/logo.
    *   Provides clear "Login" and "Register" actions (or user profile/logout status).
*   **Hero Section:**
    *   A visually distinct area presenting introductory content or key application highlights. (Placeholder content acceptable initially).
*   **AI Smart Signals Display:**
    *   A component dedicated to displaying AI-driven trading signals or insights.
    *   (Note: The specific data source and exact presentation need replication based on the original's visual output, even if the backend fetching method differs).
*   **Trending on X Display:**
    *   Consumes data equivalent to the original `/api/token-score/` endpoint (likely StockGeist metrics).
    *   Displays data related to cryptocurrency mentions/sentiment on platform X (Twitter).
    *   Uses a clear presentation format (e.g., cards or lists) showing relevant tokens and their metrics.
*   **Top Traded Tokens Display:**
    *   Consumes data from the backend `/api/top-rated-tokens` endpoint (attempting to fetch Hot Pools).
    *   Displays a list/table format.
    *   Essential columns: Rank, Name (with Token Icon & Symbol), Price, Change (%), and Volume.
    *   NOTE: Due to potential API plan limitations or missing fields in the API response, some data (Hot Pools list, Logo, Volume, specific Change % timeframes) may not be available or populated.
    *   Must provide interactive elements (e.g., tabs) to switch between "24H", "6H", and "5M" timeframes, updating Price, Change, and Volume accordingly if data is available.
    *   Data must refresh automatically at a reasonable interval (e.g., ~40 seconds).
    *   Handles missing data/API errors gracefully in the UI (e.g., display "-", provide fallback image).
*   **Smart Money Display:**
    *   A component displaying information related to significant wallet activities ("smart money").
    *   (Note: Replicate the visual presentation and the type of data shown in the original).
*   **Footer:**
    *   Displays copyright information and any other essential links.
*   **User Authentication Flow:**
    *   Clear UI for user registration and login.
    *   Backend must securely handle user creation, password hashing, authentication, and session management.

### 2.3. Backend API Functionality (Data Provisioning)

*   **Top Rated Tokens Endpoint:**
    *   Provides data equivalent to the original `GET /api/top-rated-tokens/` (attempts to fetch DexTools Hot Pools).
    *   Must fetch data from DexTools API v2 (e.g., using the `dextools-python` library with functions like `get_ranking_hotpools` and `get_pool_price`).
    *   Processes the fields available in the API response (Rank, Name, Symbol, Price, Change, Volume if available).
    *   Requires secure handling of a DexTools API key.
    *   Must handle external API errors gracefully (including potential empty list responses from `/hotpools` or failed detail fetches).
    *   Output: JSON data structure suitable for the frontend component, noting potentially missing fields depending on API response/plan.
*   **Token Score/Social Sentiment Endpoint:**
    *   Provides data equivalent to the original `GET /api/token-score/`.
    *   Must fetch and process data from StockGeist API (message metrics for predefined tokens).
    *   Requires secure handling of a StockGeist API key.
    *   Must handle external API errors/timeouts.
    *   Output: JSON data structure suitable for the "Trending on X" frontend component.
*   **User Authentication Endpoints:**
    *   Provide endpoints for user registration, login (credential verification), and logout (session invalidation).

## 3. Non-Functional Requirements

*   **Performance:** Fast frontend load times, responsive UI, and reasonably quick API responses (consider caching strategies if external APIs are slow). Auto-refresh should be efficient.
*   **Reliability:** Robust error handling for external API failures. Stable backend and frontend operation. Clear communication of data unavailability to the user.
*   **Usability:** Intuitive interface, clear data presentation, consistent look and feel.
*   **Security:** Secure storage and handling of API keys and user credentials (hashed passwords). Standard web security practices (input validation, protection against common vulnerabilities like XSS, CSRF if applicable to the chosen stack).
*   **Maintainability:** **Prioritize clean, well-structured, and documented code.** Choose technologies known for good maintainability. Simpler solutions are preferred over complex ones if they meet functional requirements.
*   **Scalability:** While high scalability isn't the primary initial goal, the chosen architecture shouldn't preclude future scaling.

## 4. UI/UX Requirements

*   **Look and Feel:** Replicate the modern, clean, data-focused aesthetic of the original dashboard.
*   **Layout:** Responsive design (adapting well to standard desktop sizes is the minimum).
*   **Components:** Use appropriate UI elements (tables, cards, tabs, buttons) as observed in the original to present information effectively.
*   **Visual Style:** Aim to replicate the color palette, typography, and spacing for visual consistency with the original.
*   **Data Visualization:** Primarily tables and numerical data. Implement charts only if they were present and essential in the original.

## 5. Data Requirements

*   **External APIs:** Need access to functionalities equivalent to:
    *   DexTools API V2 (`get_ranking_hotpools`, `get_token`, `get_pool_price`).
    *   StockGeist API (`/crypto/global/hist/message-metrics`).
    *   **Requires valid API keys for both services.**
*   **Internal Data:** Need a persistent store (database) for User Data (credentials).
*   **Database:** Choice of database is flexible (e.g., PostgreSQL, MySQL, SQLite for simplicity if sufficient), must support user authentication needs.

## 6. Technical Specifications (Flexible)

*   **Frontend:** A modern JavaScript framework/library (e.g., React, Vue, Svelte, or even potentially simpler solutions if suitable) capable of building interactive components and consuming APIs. Tooling for development builds and bundling (e.g., Vite, Webpack/`react-scripts`).
*   **Backend:** A framework capable of building RESTful APIs, interacting with external services, and managing user authentication (e.g., Python with Django/Flask/FastAPI, Node.js with Express, etc.).
*   **API Communication:** Standard HTTP requests (e.g., using `fetch` or `axios` on the frontend).
*   **Environment:** Appropriate runtime environments (Node.js for frontend tooling/JS backend, Python interpreter for Python backend) and dependency management (npm/yarn, pip). Use of containerization (Docker) is recommended for consistency.
*   **Database:** See Section 5.

## 7. Project Structure

*   Organize code logically (e.g., separate frontend/backend directories, clear module/component structure within each).

## 8. Assumptions & Dependencies

*   Valid API keys for DexTools and StockGeist will be provided.
*   Access to a suitable database is available.
*   The AI building the application understands core web development principles (HTTP, APIs, frontend rendering, backend logic, databases, security) and can select appropriate tools to meet the functional and non-functional requirements efficiently.

## 9. Out of Scope (for initial replication)

*   Mobile-specific UI implementations beyond basic responsiveness.
*   Advanced/complex charting features not present in the original.
*   Any functionality not explicitly described or observed in the original application.
*   Production deployment configurations (focus is on a functional local setup). 