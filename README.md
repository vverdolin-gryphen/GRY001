<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# TRG001 - Towers One

This is the Towers One application with a modern UX/UI dashboard.

## Setup & Run Locally

**Prerequisites:** Node.js

1.  **Install dependencies:**
    ```bash
    npm install
    ```

2.  **Environment Setup:**
    Ensure you have a `.env.local` file with the following keys:
    ```env
    GEMINI_API_KEY=your_gemini_key_here
    VITE_SUPABASE_URL=your_supabase_url
    VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
    ```
    *(Note: These are pre-configured in the repository if you are using the provided `.env.local`)*

3.  **Run the app:**
    ```bash
    npm run dev
    ```

## Features

-   **Authentication:** Secure login via Supabase.
-   **Dashboard:** Real-time metrics and charts.
-   **Todo List:** Manage tasks for buildings.
-   **Design:** "UX UI Pro Max" aesthetic with glassmorphism and modern gradients.

## Tech Stack

-   React 19
-   Vite
-   Tailwind CSS v4
-   Supabase (Auth & Database)
-   Recharts
-   Lucide React
