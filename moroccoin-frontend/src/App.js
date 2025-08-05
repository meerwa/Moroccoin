import React, { useState } from 'react';

// Mock data
const mockUsers = [
  { id: 1, name: 'Ahmed Benali', email: 'ahmed@moroccoin.ma' },
  { id: 2, name: 'Fatima Zahra', email: 'fatima@moroccoin.ma' },
  { id: 3, name: 'Mohamed Alami', email: 'mohamed@moroccoin.ma' },
  { id: 4, name: 'Aicha Kabbaj', email: 'aicha@moroccoin.ma' }
];

const mockTransactions = [
  { id: 1, user_id: 1, amount: 1500, status: 'completed', date: '2024-01-15' },
  { id: 2, user_id: 2, amount: 2300, status: 'pending', date: '2024-01-14' },
  { id: 3, user_id: 1, amount: 850, status: 'completed', date: '2024-01-13' },
  { id: 4, user_id: 3, amount: 3200, status: 'refunded', date: '2024-01-12' },
  { id: 5, user_id: 2, amount: 750, status: 'completed', date: '2024-01-11' }
];

// Login Component
function Login({ onLogin }) {
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!user || !pass) {
      setError('Veuillez remplir tous les champs');
      return;
    }

    setLoading(true);
    setError('');
    
    // Simulate API call
    setTimeout(() => {
      if (user.trim() === 'admin' && pass.trim() === 'admin123') {
        onLogin();
      } else {
        setError('Identifiants incorrects');
      }
      setLoading(false);
    }, 800);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <div style={{ 
      maxWidth: '400px', 
      margin: '50px auto', 
      padding: '30px', 
      border: '1px solid #ddd', 
      borderRadius: '8px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      backgroundColor: 'white',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h2 style={{ textAlign: 'center', marginBottom: '30px', color: '#333' }}>
        🏛️ Moroccoin Admin
      </h2>
      
      {error && (
        <div style={{ 
          color: '#d32f2f', 
          textAlign: 'center', 
          marginBottom: '20px',
          padding: '10px',
          backgroundColor: '#ffebee',
          border: '1px solid #ffcdd2',
          borderRadius: '4px'
        }}>
          {error}
        </div>
      )}
      
      <input 
        placeholder="Nom d'utilisateur" 
        value={user} 
        onChange={e => setUser(e.target.value)}
        onKeyPress={handleKeyPress}
        disabled={loading}
        style={{ 
          width: '100%', 
          margin: '10px 0', 
          padding: '12px', 
          boxSizing: 'border-box',
          border: '1px solid #ccc',
          borderRadius: '4px',
          fontSize: '16px'
        }}
      />
      
      <input 
        placeholder="Mot de passe" 
        type="password" 
        value={pass} 
        onChange={e => setPass(e.target.value)}
        onKeyPress={handleKeyPress}
        disabled={loading}
        style={{ 
          width: '100%', 
          margin: '10px 0', 
          padding: '12px', 
          boxSizing: 'border-box',
          border: '1px solid #ccc',
          borderRadius: '4px',
          fontSize: '16px'
        }}
      />
      
      <button 
        onClick={handleLogin}
        disabled={loading || !user || !pass}
        style={{ 
          width: '100%', 
          padding: '12px', 
          backgroundColor: loading ? '#ccc' : '#007bff', 
          color: 'white', 
          border: 'none',
          borderRadius: '4px',
          cursor: loading ? 'not-allowed' : 'pointer',
          fontSize: '16px',
          fontWeight: 'bold',
          marginTop: '10px'
        }}
      >
        {loading ? 'Connexion en cours...' : 'Se connecter'}
      </button>
      
      <div style={{ 
        marginTop: '20px', 
        padding: '15px',
        backgroundColor: '#f8f9fa',
        borderRadius: '4px',
        fontSize: '14px', 
        color: '#666'
      }}>
        <p style={{ margin: '0 0 10px 0', fontWeight: 'bold' }}>Identifiants de test :</p>
        <p style={{ margin: '5px 0' }}>👤 Utilisateur: <strong>admin</strong></p>
        <p style={{ margin: '5px 0' }}>🔑 Mot de passe: <strong>admin123</strong></p>
      </div>
    </div>
  );
}

// UserList Component
function UserList({ onSelectUser, selectedUser }) {
  return (
    <div style={{ 
      margin: '20px', 
      padding: '20px', 
      border: '1px solid #ddd', 
      borderRadius: '8px',
      backgroundColor: 'white'
    }}>
      <h3 style={{ color: '#333', marginBottom: '15px' }}>
        👥 Utilisateurs ({mockUsers.length})
      </h3>
      {mockUsers.map(user => (
        <div 
          key={user.id} 
          onClick={() => onSelectUser && onSelectUser(user.id)} 
          style={{ 
            cursor: 'pointer',
            padding: '15px',
            margin: '8px 0',
            border: '1px solid #ddd',
            borderRadius: '6px',
            backgroundColor: selectedUser === user.id ? '#e3f2fd' : '#f9f9f9',
            transition: 'all 0.2s ease',
            borderLeft: selectedUser === user.id ? '4px solid #2196f3' : '4px solid transparent'
          }}
          onMouseEnter={e => {
            if (selectedUser !== user.id) {
              e.target.style.backgroundColor = '#f0f0f0';
            }
          }}
          onMouseLeave={e => {
            if (selectedUser !== user.id) {
              e.target.style.backgroundColor = '#f9f9f9';
            }
          }}
        >
          <div style={{ fontWeight: 'bold', color: '#333' }}>{user.name}</div>
          <div style={{ color: '#666', fontSize: '14px' }}>{user.email}</div>
        </div>
      ))}
    </div>
  );
}

// TransactionList Component
function TransactionList() {
  return (
    <div style={{ 
      margin: '20px', 
      padding: '20px', 
      border: '1px solid #ddd', 
      borderRadius: '8px',
      backgroundColor: 'white'
    }}>
      <h3 style={{ color: '#333', marginBottom: '15px' }}>
        💳 Transactions ({mockTransactions.length})
      </h3>
      {mockTransactions.map(tx => (
        <div 
          key={tx.id} 
          style={{ 
            padding: '12px',
            margin: '8px 0',
            border: '1px solid #eee',
            borderRadius: '4px',
            backgroundColor: '#fafafa',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <div>
            <div style={{ fontWeight: 'bold' }}>
              Utilisateur #{tx.user_id} - {tx.amount} MAD
            </div>
            <div style={{ fontSize: '12px', color: '#666' }}>{tx.date}</div>
          </div>
          <span style={{ 
            padding: '4px 8px',
            borderRadius: '12px',
            fontSize: '12px',
            fontWeight: 'bold',
            backgroundColor: 
              tx.status === 'completed' ? '#4caf50' :
              tx.status === 'pending' ? '#ff9800' : '#f44336',
            color: 'white'
          }}>
            {tx.status === 'completed' ? 'Terminé' :
             tx.status === 'pending' ? 'En attente' : 'Remboursé'}
          </span>
        </div>
      ))}
    </div>
  );
}

// UserDetails Component
function UserDetails({ userId }) {
  if (!userId) return null;

  const user = mockUsers.find(u => u.id === userId);
  const userTransactions = mockTransactions.filter(t => t.user_id === userId);

  return (
    <div style={{ 
      margin: '20px', 
      padding: '20px', 
      border: '1px solid #ddd', 
      borderRadius: '8px',
      backgroundColor: 'white'
    }}>
      <h3 style={{ color: '#333', marginBottom: '15px' }}>
        🔍 Détails de l'utilisateur
      </h3>
      <div style={{ marginBottom: '20px' }}>
        <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#333' }}>
          {user.name}
        </div>
        <div style={{ color: '#666' }}>{user.email}</div>
      </div>
      
      <h4 style={{ color: '#333', marginBottom: '10px' }}>
        Transactions ({userTransactions.length})
      </h4>
      {userTransactions.map(t => (
        <div key={t.id} style={{ 
          padding: '10px',
          margin: '5px 0',
          border: '1px solid #eee',
          borderRadius: '4px',
          backgroundColor: '#f9f9f9',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <span style={{ fontWeight: 'bold' }}>{t.amount} MAD</span>
            <span style={{ marginLeft: '10px', fontSize: '12px', color: '#666' }}>
              {t.date}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ 
              padding: '2px 6px',
              borderRadius: '8px',
              fontSize: '11px',
              fontWeight: 'bold',
              backgroundColor: 
                t.status === 'completed' ? '#4caf50' :
                t.status === 'pending' ? '#ff9800' : '#f44336',
              color: 'white'
            }}>
              {t.status === 'completed' ? 'Terminé' :
               t.status === 'pending' ? 'En attente' : 'Remboursé'}
            </span>
            {t.status !== 'refunded' && (
              <button 
                onClick={() => alert('Remboursement simulé pour la transaction ' + t.id)}
                style={{ 
                  padding: '4px 8px',
                  backgroundColor: '#f44336',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '11px'
                }}
              >
                Rembourser
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

// SupportChat Component
function SupportChat() {
  const [msg, setMsg] = useState('');
  const [userId, setUserId] = useState('');
  
  const send = () => {
    if (userId && msg) {
      alert(`Message envoyé à l'utilisateur ${userId}: "${msg}"`);
      setMsg('');
      setUserId('');
    }
  };
  
  return (
    <div style={{ 
      margin: '20px', 
      padding: '20px', 
      border: '1px solid #ddd', 
      borderRadius: '8px',
      backgroundColor: 'white'
    }}>
      <h3 style={{ color: '#333', marginBottom: '15px' }}>
        💬 Support Chat (Simulation)
      </h3>
      <input 
        placeholder="ID Utilisateur" 
        value={userId} 
        onChange={e => setUserId(e.target.value)}
        style={{ 
          width: '100%', 
          margin: '5px 0', 
          padding: '8px', 
          border: '1px solid #ccc',
          borderRadius: '4px'
        }}
      />
      <textarea 
        placeholder="Votre message..."
        value={msg} 
        onChange={e => setMsg(e.target.value)}
        style={{ 
          width: '100%', 
          height: '80px',
          margin: '5px 0', 
          padding: '8px', 
          border: '1px solid #ccc',
          borderRadius: '4px',
          resize: 'vertical'
        }}
      />
      <button 
        onClick={send}
        disabled={!userId || !msg}
        style={{ 
          padding: '8px 16px',
          backgroundColor: userId && msg ? '#4caf50' : '#ccc',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: userId && msg ? 'pointer' : 'not-allowed'
        }}
      >
        Envoyer
      </button>
    </div>
  );
}

// Main App Component
function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  if (!loggedIn) {
    return <Login onLogin={() => setLoggedIn(true)} />;
  }

  return (
    <div style={{ 
      backgroundColor: '#f5f5f5', 
      minHeight: '100vh',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{ 
        backgroundColor: '#2196f3', 
        padding: '20px', 
        color: 'white',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h1 style={{ margin: 0 }}>🏛️ Moroccoin Admin Panel</h1>
        <button 
          onClick={() => {
            setLoggedIn(false);
            setSelectedUser(null);
          }}
          style={{ 
            padding: '8px 16px',
            backgroundColor: 'rgba(255,255,255,0.2)',
            color: 'white',
            border: '1px solid rgba(255,255,255,0.3)',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Déconnexion
        </button>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0' }}>
        <UserList onSelectUser={setSelectedUser} selectedUser={selectedUser} />
        <TransactionList />
      </div>
      
      {selectedUser && <UserDetails userId={selectedUser} />}
      <SupportChat />
    </div>
  );
}

export default App;