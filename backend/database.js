const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'expense_tracker.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database', err.message);
  } else {
    console.log('Connected to SQLite database.');
    
    db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE,
      email TEXT UNIQUE,
      phone TEXT,
      password TEXT
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS incomes (
      id TEXT PRIMARY KEY,
      user_id INTEGER,
      source TEXT,
      amount REAL,
      date TEXT,
      category TEXT,
      notes TEXT,
      FOREIGN KEY(user_id) REFERENCES users(id)
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS expenses (
      id TEXT PRIMARY KEY,
      user_id INTEGER,
      title TEXT,
      amount REAL,
      date TEXT,
      category TEXT,
      notes TEXT,
      FOREIGN KEY(user_id) REFERENCES users(id)
    )`);
  }
});

module.exports = db;
