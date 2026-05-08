const express = require('express');
const router = express.Router();
const db = require('../database');
const verifyToken = require('../middleware/authMiddleware');

// Middleware to protect all routes in this file
router.use(verifyToken);

// --- INCOMES ---

// Get all incomes for user
router.get('/incomes', (req, res) => {
  db.all(`SELECT * FROM incomes WHERE user_id = ? ORDER BY date DESC`, [req.user.user_id], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json(rows);
  });
});

// Add an income
router.post('/incomes', (req, res) => {
  const { id, source, amount, date, category, notes } = req.body;
  
  if (!id || !source || amount == null || !date) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const stmt = db.prepare(`INSERT INTO incomes (id, user_id, source, amount, date, category, notes) VALUES (?, ?, ?, ?, ?, ?, ?)`);
  stmt.run([id, req.user.user_id, source, amount, date, category, notes], function(err) {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.status(201).json({ message: 'Income added successfully' });
  });
  stmt.finalize();
});

// Delete an income
router.delete('/incomes/:id', (req, res) => {
  const id = req.params.id;
  db.run(`DELETE FROM incomes WHERE id = ? AND user_id = ?`, [id, req.user.user_id], function(err) {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (this.changes === 0) return res.status(404).json({ error: 'Income not found or unauthorized' });
    res.json({ message: 'Income deleted successfully' });
  });
});

// --- EXPENSES ---

// Get all expenses for user
router.get('/expenses', (req, res) => {
  db.all(`SELECT * FROM expenses WHERE user_id = ? ORDER BY date DESC`, [req.user.user_id], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json(rows);
  });
});

// Add an expense
router.post('/expenses', (req, res) => {
  const { id, title, amount, date, category, notes } = req.body;

  if (!id || !title || amount == null || !date) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const stmt = db.prepare(`INSERT INTO expenses (id, user_id, title, amount, date, category, notes) VALUES (?, ?, ?, ?, ?, ?, ?)`);
  stmt.run([id, req.user.user_id, title, amount, date, category, notes], function(err) {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.status(201).json({ message: 'Expense added successfully' });
  });
  stmt.finalize();
});

// Delete an expense
router.delete('/expenses/:id', (req, res) => {
  const id = req.params.id;
  db.run(`DELETE FROM expenses WHERE id = ? AND user_id = ?`, [id, req.user.user_id], function(err) {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (this.changes === 0) return res.status(404).json({ error: 'Expense not found or unauthorized' });
    res.json({ message: 'Expense deleted successfully' });
  });
});

module.exports = router;
