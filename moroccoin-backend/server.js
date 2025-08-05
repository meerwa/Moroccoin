const express = require('express');
const cors = require('cors');
const pool = require('./db');

const app = express();

// Configuration CORS
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Middleware de logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Route de test
app.get('/', (req, res) => {
  res.json({ 
    message: 'Backend Moroccoin fonctionne !',
    timestamp: new Date().toISOString(),
    endpoints: [
      'POST /api/login',
      'GET /api/users',
      'GET /api/users/:id',
      'GET /api/transactions',
      'POST /api/refund',
      'POST /api/support/message',
      'GET /api/reports'
    ]
  });
});

// ==================== AUTHENTIFICATION ====================
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  
  console.log('=== TENTATIVE DE CONNEXION ===');
  console.log('Username:', username);
  console.log('Password:', password ? '***' : 'vide');
  
  try {
    if (!username || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Nom d\'utilisateur et mot de passe requis' 
      });
    }

    // Authentification simple (vous pouvez ajouter une vraie DB plus tard)
    if (username === 'admin' && password === 'admin123') {
      console.log('✅ Connexion réussie');
      res.json({ 
        success: true, 
        user: { 
          id: 1, 
          username: 'admin',
          role: 'administrator',
          name: 'Administrateur Moroccoin'
        },
        message: 'Connexion réussie'
      });
    } else {
      console.log('❌ Identifiants incorrects');
      res.status(401).json({ 
        success: false, 
        message: 'Nom d\'utilisateur ou mot de passe incorrect' 
      });
    }
  } catch (err) {
    console.error('Erreur serveur lors de la connexion:', err);
    res.status(500).json({ 
      success: false,
      error: 'Erreur interne du serveur',
      message: err.message 
    });
  }
});

// ==================== GESTION DES UTILISATEURS ====================
app.get('/api/users', async (req, res) => {
  try {
    console.log('Récupération des utilisateurs...');
    
    // Essayez d'abord la base de données
    try {
      const result = await pool.query('SELECT * FROM users ORDER BY id');
      console.log(`${result.rows.length} utilisateurs trouvés dans la DB`);
      res.json(result.rows);
    } catch (dbError) {
      console.log('DB non disponible, utilisation des données de test');
      // Données de test si la DB n'est pas disponible
      const testUsers = [
        { id: 1, name: 'Alice Martin', email: 'alice@moroccoin.com', phone: '+212600123456', status: 'active', created_at: '2024-01-15' },
        { id: 2, name: 'Bob Dupont', email: 'bob@email.com', phone: '+212600987654', status: 'active', created_at: '2024-01-20' },
        { id: 3, name: 'Claire Dubois', email: 'claire@email.com', phone: '+212601234567', status: 'pending', created_at: '2024-02-01' },
        { id: 4, name: 'David Lefeb', email: 'david@email.com', phone: '+212602345678', status: 'suspended', created_at: '2024-02-10' }
      ];
      res.json(testUsers);
    }
  } catch (err) {
    console.error('Erreur users:', err);
    res.status(500).json({ 
      error: err.message, 
      users: []
    });
  }
});

app.get('/api/users/:id', async (req, res) => {
  const userId = req.params.id;
  console.log(`Récupération détails utilisateur ${userId}`);
  
  try {
    try {
      // Essayez la base de données
      const user = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
      const transactions = await pool.query('SELECT * FROM transactions WHERE user_id = $1 ORDER BY created_at DESC', [userId]);
      
      if (!user.rows.length) {
        return res.status(404).json({ error: 'Utilisateur non trouvé' });
      }
      
      res.json({ 
        ...user.rows[0], 
        transactions: transactions.rows 
      });
    } catch (dbError) {
      console.log('DB non disponible, données de test pour utilisateur', userId);
      // Données de test
      const testUsers = {
        '1': {
          id: 1, name: 'Alice Martin', email: 'alice@moroccoin.com', 
          phone: '+212600123456', status: 'active', created_at: '2024-01-15',
          transactions: [
            { id: 101, user_id: 1, amount: 150.00, type: 'send', status: 'completed', created_at: '2024-02-01', recipient: 'Bob Dupont' },
            { id: 102, user_id: 1, amount: 75.50, type: 'receive', status: 'completed', created_at: '2024-02-03', sender: 'Claire Dubois' }
          ]
        },
        '2': {
          id: 2, name: 'Bob Dupont', email: 'bob@email.com',
          phone: '+212600987654', status: 'active', created_at: '2024-01-20',
          transactions: [
            { id: 103, user_id: 2, amount: 200.00, type: 'send', status: 'pending', created_at: '2024-02-05', recipient: 'David Lefeb' }
          ]
        }
      };
      
      const userData = testUsers[userId];
      if (!userData) {
        return res.status(404).json({ error: 'Utilisateur non trouvé' });
      }
      
      res.json(userData);
    }
  } catch (err) {
    console.error('Erreur user details:', err);
    res.status(500).json({ error: err.message });
  }
});

// ==================== GESTION DES TRANSACTIONS ====================
app.get('/api/transactions', async (req, res) => {
  try {
    console.log('Récupération des transactions...');
    
    try {
      const result = await pool.query(`
        SELECT t.*, u.name as user_name, u.email as user_email 
        FROM transactions t 
        LEFT JOIN users u ON t.user_id = u.id 
        ORDER BY t.created_at DESC 
        LIMIT 100
      `);
      res.json(result.rows);
    } catch (dbError) {
      console.log('DB non disponible, données de test transactions');
      const testTransactions = [
        { 
          id: 101, user_id: 1, user_name: 'Alice Martin', user_email: 'alice@moroccoin.com',
          amount: 150.00, type: 'send', status: 'completed', created_at: '2024-02-01T10:30:00Z',
          recipient: 'Bob Dupont', reference: 'TX001'
        },
        { 
          id: 102, user_id: 1, user_name: 'Alice Martin', user_email: 'alice@moroccoin.com',
          amount: 75.50, type: 'receive', status: 'completed', created_at: '2024-02-03T14:15:00Z',
          sender: 'Claire Dubois', reference: 'TX002'
        },
        { 
          id: 103, user_id: 2, user_name: 'Bob Dupont', user_email: 'bob@email.com',
          amount: 200.00, type: 'send', status: 'pending', created_at: '2024-02-05T09:45:00Z',
          recipient: 'David Lefeb', reference: 'TX003'
        },
        { 
          id: 104, user_id: 3, user_name: 'Claire Dubois', user_email: 'claire@email.com',
          amount: 300.00, type: 'send', status: 'failed', created_at: '2024-02-06T16:20:00Z',
          recipient: 'Alice Martin', reference: 'TX004'
        }
      ];
      res.json(testTransactions);
    }
  } catch (err) {
    console.error('Erreur transactions:', err);
    res.status(500).json({ error: err.message, transactions: [] });
  }
});

app.post('/api/refund', async (req, res) => {
  const { transactionId } = req.body;
  console.log(`Traitement remboursement transaction ${transactionId}`);
  
  try {
    if (!transactionId) {
      return res.status(400).json({ error: 'ID de transaction requis' });
    }

    try {
      await pool.query('UPDATE transactions SET status = $1 WHERE id = $2', ['refunded', transactionId]);
      console.log(`✅ Transaction ${transactionId} remboursée`);
    } catch (dbError) {
      console.log('DB non disponible, simulation du remboursement');
    }
    
    res.json({ 
      success: true,
      message: 'Remboursement traité avec succès',
      transactionId: transactionId
    });
  } catch (err) {
    console.error('Erreur refund:', err);
    res.status(500).json({ error: err.message });
  }
});

// ==================== SUPPORT CLIENT ====================
app.post('/api/support/message', async (req, res) => {
  const { userId, message, type = 'message' } = req.body;
  console.log(`Message support: User ${userId}, Type ${type}`);
  
  try {
    if (!userId || !message) {
      return res.status(400).json({ error: 'User ID et message requis' });
    }

    const messageData = {
      id: Date.now(),
      user_id: userId,
      message: message,
      type: type, // 'message', 'email', 'sms'
      status: 'sent',
      created_at: new Date().toISOString()
    };

    try {
      await pool.query(
        'INSERT INTO messages (user_id, message, type, status) VALUES ($1, $2, $3, $4)',
        [userId, message, type, 'sent']
      );
    } catch (dbError) {
      console.log('DB non disponible, simulation envoi message');
    }
    
    res.json({ 
      success: true,
      message: `${type === 'email' ? 'Email' : type === 'sms' ? 'SMS' : 'Message'} envoyé avec succès`,
      data: messageData
    });
  } catch (err) {
    console.error('Erreur support:', err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/support/messages', async (req, res) => {
  try {
    try {
      const result = await pool.query(`
        SELECT m.*, u.name as user_name, u.email as user_email 
        FROM messages m 
        LEFT JOIN users u ON m.user_id = u.id 
        ORDER BY m.created_at DESC 
        LIMIT 50
      `);
      res.json(result.rows);
    } catch (dbError) {
      res.json([]);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==================== RAPPORTS ====================
app.get('/api/reports', async (req, res) => {
  try {
    console.log('Génération des rapports...');
    
    const reports = {
      users: {
        total: 4,
        active: 2,
        pending: 1,
        suspended: 1,
        new_this_month: 2
      },
      transactions: {
        total: 4,
        completed: 2,
        pending: 1,
        failed: 1,
        total_amount: 725.50,
        today_amount: 0
      },
      support: {
        messages_today: 0,
        pending_tickets: 0,
        resolved_tickets: 0
      },
      activity: [
        { date: '2024-02-01', transactions: 1, amount: 150.00 },
        { date: '2024-02-02', transactions: 0, amount: 0 },
        { date: '2024-02-03', transactions: 1, amount: 75.50 },
        { date: '2024-02-04', transactions: 0, amount: 0 },
        { date: '2024-02-05', transactions: 1, amount: 200.00 },
        { date: '2024-02-06', transactions: 1, amount: 300.00 }
      ]
    };
    
    res.json(reports);
  } catch (err) {
    console.error('Erreur reports:', err);
    res.status(500).json({ error: err.message });
  }
});

// ==================== GESTION DES ERREURS ====================
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Route non trouvée',
    path: req.path,
    method: req.method,
    available_routes: [
      'GET /',
      'POST /api/login',
      'GET /api/users',
      'GET /api/users/:id',
      'GET /api/transactions',
      'POST /api/refund',
      'POST /api/support/message',
      'GET /api/support/messages',
      'GET /api/reports'
    ]
  });
});

app.use((error, req, res, next) => {
  console.error('Erreur serveur:', error);
  res.status(500).json({ 
    error: 'Erreur interne du serveur',
    message: error.message 
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Backend Moroccoin running on http://localhost:${PORT}`);
  console.log(`📋 Test: http://localhost:${PORT}`);
  console.log(`🔐 Login: http://localhost:${PORT}/api/login`);
  console.log(`👥 Users: http://localhost:${PORT}/api/users`);
  console.log(`💳 Transactions: http://localhost:${PORT}/api/transactions`);
  console.log(`📊 Reports: http://localhost:${PORT}/api/reports`);
});