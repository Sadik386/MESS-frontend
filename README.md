  # Mess Management System (Meal Management)

A full-stack MERN (MongoDB, Express, React, Node.js) application designed to manage meals, expenses, and payments for a mess or hostel environment. It provides a dashboard for tracking meal activity, calculating costs, and managing member contributions.

## 🚀 Features

- **User Authentication**: Secure Login and Registration system.
- **Dashboard**: Overview of meal activity, total expenses, and remaining balance.
- **Meal Tracking**: Record daily meal consumption for members.
- **Expense Management**: Track mess expenses and categorize them.
- **Payment Records**: Log member payments and track dues.
- **Reports**: Generate detailed reports for specific periods.
- **Member Settings**: Manage profile settings and mess configurations.

## 🛠️ Tech Stack

### Frontend
- **React**: UI library.
- **React Router**: For navigation.
- **Axios**: HTTP client for API calls.
- **Tailwind CSS**: Styling.
- **Vite**: Modern build tool.

### Backend
- **Node.js & Express**: Server-side runtime and framework.
- **MongoDB & Mongoose**: NoSQL database and ODM.
- **JSON Web Token (JWT)**: For secure authentication.
- **Bcrypt.js**: For password hashing.

---

## ⚙️ Installation & Setup

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB (Local or Atlas)
- npm or yarn

### 1. Clone the Repository
```bash
git clone <repository-url>
cd meal-management
```

### 2. Backend Setup
Go to the `server` directory and install dependencies:
```bash
cd server
npm install
```

Create a `.env` file in the `server` directory and add your configurations:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

Start the server:
```bash
# Development mode
npm run dev

# Production mode
npm start
```

### 3. Frontend Setup
Go to the `client` directory and install dependencies:
```bash
cd ../client
npm install
```

Create a `.env` file in the `client` directory:
```env
VITE_API_URL=http://localhost:5000/api
```

Start the client:
```bash
npm run dev
```

---

## 📂 Project Structure

```text
meal-management/
├── client/              # React frontend
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # Page components (Dashboard, Login, etc.)
│   │   ├── context/     # Auth & State management
│   │   └── config/      # API configurations
└── server/              # Express backend
    ├── models/          # Mongoose schemas (User, Meal, Expense, etc.)
    ├── routes/          # API endpoints
    ├── middleware/      # Auth & Error handling
    └── index.js         # Entry point
```

## 📜 License
ISC License
