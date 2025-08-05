import React, { useState } from 'react';

export default function Login({ onLogin }) {
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
    
    try {
      console.log('Tentative de connexion vers:', 'http://localhost:3001/api/login');
      
      const response = await fetch('http://localhost:3001/api/login', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ 
          username: user.trim(), 
          password: pass.trim() 
        })
      });
      
      console.log('Réponse reçue:', response.status, response.statusText);
      
      if (!response.ok) {
        throw new Error(`Erreur serveur: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Données reçues:', data);
      
      if (data.success) {
        onLogin();
      } else {
        setError(data.message || 'Identifiants incorrects');
      }
      
    } catch (err) {
      console.error('Erreur complète:', err);
      setError(`Erreur de connexion: ${err.message}`);
    } finally {
      setLoading(false);
    }
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
      backgroundColor: 'white'
    }}>
      <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>Connexion</h2>
      
      {error && (
        <div style={{ 
          color: 'red', 
          textAlign: 'center', 
          marginBottom: '20px',
          padding: '10px',
          backgroundColor: '#ffe6e6',
          border: '1px solid #ffcccc',
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