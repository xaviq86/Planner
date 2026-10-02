# 🇪🇺 Erasmus+ Task Planner

A Single Page Application (SPA) task planner created as part of an Erasmus+ project task.

## 📋 Prerequisites

Before running the application, make sure you have the following installed on your computer:
* **Node.js** (version 18.x or newer recommended)
* **npm** (comes bundled with Node.js)

## 🚀 Getting Started & Installation

1. Clone or download the project repository to your local machine.
2. Open your terminal and navigate to the project's root folder.
3. Install the required dependencies:
    ```bash
    npm install
    ```

4. Start the development server:
    ```bash
    npm run dev
    ```

5. Open your web browser and go to the local address provided in the terminal (usually **`http://localhost:5173`**).

## 💡 About the Project & Tech Stack

This project was built using a modern web stack:

* **React & TypeScript** – For building a reliable, type-safe user interface.
* **Vite** – Fast bundler and development environment.
* **TailwindCSS** – Modern utility-first styling.
* **Dexie.js (IndexedDB)** – Local browser database ensuring offline persistence and real-time state synchronization.
* **Lucide React** – Clean vector icons.

### Key Features:

* Create, edit, and delete tasks along with their due dates.
* Add and check off subtasks/steps with a dynamic progress bar for each task.
* Fully offline-capable thanks to browser-based storage.
