const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Mock data
const users = [
  { id: 1, name: 'John Doe', email: 'john@example.com' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com' }
];

const transactions = [
  { id: 1, user_id: 1, amount: 100, status: 'completed' },
  { id: 2, user_id: 2, amount: 250, status: 'pending' },
  { id: 3, user_id: 1, amount: 50, status: 'completed' },
  { id: 4, user_id: 3, amount: 300, status: 'refunded' }
];

// Routes
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  
  console.log('Login attempt:', { username, password });
  
  if (username === 'admin' && password === 'admin123') {
    res.json({ success: true, message: 'Login successful' });
  } else {
    res.status(401).json({ success: false, message: 'Identifiants incorrects' });
  }
});

app.get('/api/users', (req, res) => {
  res.json(users);
});

app.get('/api/users/:id', (req, res) => {
  const userId = parseInt(req.params.id);
  const user = users.find(u => u.id === userId);
  
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  const userTransactions = transactions.filter(t => t.user_id === userId);
  res.json({ ...user, transactions: userTransactions });
});

app.get('/api/transactions', (req, res) => {
  res.json(transactions);
});

app.post('/api/refund', (req, res) => {
  const { transactionId } = req.body;
  const transaction = transactions.find(t => t.id === parseInt(transactionId));
  
  if (transaction) {
    transaction.status = 'refunded';
    res.json({ success: true, message: 'Refund processed' });
  } else {
    res.status(404).json({ success: false, message: 'Transaction not found' });
  }
});

app.post('/api/support/message', (req, res) => {
  const { userId, message } = req.body;
  console.log('Support message:', { userId, message });
  res.json({ success: true, message: 'Message sent' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Mock server running on http://localhost:${PORT}`);
  console.log('📋 Available endpoints:');
  console.log('  POST /api/login');
  console.log('  GET  /api/users');
  console.log('  GET  /api/users/:id');
  console.log('  GET  /api/transactions');
  console.log('  POST /api/refund');
  console.log('  POST /api/support/message');
});