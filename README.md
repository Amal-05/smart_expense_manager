# 🚀 Smart Expense Manager

A professional, production-ready full-stack application designed to help users track their finances with ease and precision. Built with a focus on security, performance, and modern aesthetics.

[![Live Website](https://img.shields.io/badge/Live-Website-blue?style=for-the-badge&logo=vercel)](https://smart-expense-manager-app.vercel.app)

---

## 🌟 Key Features

- **Secure Authentication**: Real-time registration and login using JWT (JSON Web Tokens) and hashed passwords (bcrypt).
- **Dashboard Overview**: Interactive progress rings showing monthly budget usage and financial summaries.
- **Transaction Management**: Seamlessly add, view, and delete income and expense entries.
- **Data Persistence**: Robust SQLite database integration for reliable data storage.
- **Modular Architecture**: Decoupled frontend (Vite) and backend (Node.js) for optimal scalability.
- **Responsive Design**: Premium dark-mode UI that looks stunning on any device.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: [Vite](https://vitejs.dev/)
- **Logic**: Vanilla JavaScript (ES6+ Modules)
- **Styling**: Modern CSS3 (Custom properties, Flexbox, Grid)
- **Icons**: SVG-based iconography

### Backend
- **Environment**: [Node.js](https://nodejs.org/)
- **Framework**: [Express.js](https://expressjs.com/)
- **Database**: [SQLite](https://www.sqlite.org/)
- **Security**: [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken), [bcryptjs](https://www.npmjs.com/package/bcryptjs)
- **CORS**: Enabled for cross-origin frontend communication

---

## 🚀 Getting Started

### Prerequisites
- Node.js installed on your machine.
- A GitHub account for version control.

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Amal-05/smart_expense_manager.git
   ```

2. **Backend Setup**:
   ```bash
   cd backend
   npm install
   # Create a .env file with JWT_SECRET
   node server.js
   ```

3. **Frontend Setup**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

---

## ☁️ Deployment

- **Frontend**: Hosted on [Vercel](https://vercel.com/) with automated GitHub integration.
- **Backend**: Deployed on [Render](https://render.com/) with SQLite data management.

---

## 👨‍💻 Author

**MADE WITH ❤️ BY AMAL**

---

© 2026 Smart Expense Manager. All rights reserved.
