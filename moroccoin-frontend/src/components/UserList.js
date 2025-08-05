import React, { useState, useEffect } from 'react';

export default function UserList({ onSelectUser }) {
  const [users, setUsers] = useState([]); // ✅ Initialisé comme tableau vide
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch('http://localhost:3001/api/users');
        
        if (!response.ok) {
          throw new Error(`Erreur HTTP: ${response.status}`);
        }
        
        const data = await response.json();
        
        // ✅ Vérifiez que data est un tableau
        if (Array.isArray(data)) {
          setUsers(data);
        } else {
          console.error('Les données reçues ne sont pas un tableau:', data);
          setUsers([]); // Fallback vers tableau vide
          setError('Format de données incorrect');
        }
        
      } catch (err) {
        console.error('Erreur lors du chargement des utilisateurs:', err);
        setUsers([]); // ✅ Assure un tableau vide en cas d'erreur
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUsers();
  }, []);
  
  // ✅ États de chargement et d'erreur
  if (loading) {
    return <div>Chargement des utilisateurs...</div>;
  }
  
  if (error) {
    return (
      <div style={{ color: 'red' }}>
        <h3>Erreur</h3>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>
          Réessayer
        </button>
      </div>
    );
  }
  
  return (
    <div>
      <h3>Utilisateurs ({users.length})</h3>
      {users.length === 0 ? (
        <p>Aucun utilisateur trouvé</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {users.map(user => (
            <li 
              key={user.id} 
              onClick={() => onSelectUser && onSelectUser(user.id)} 
              style={{ 
                cursor: 'pointer',
                padding: '10px',
                margin: '5px 0',
                border: '1px solid #ddd',
                borderRadius: '4px',
                backgroundColor: '#f9f9f9'
              }}
            >
              <strong>{user.name}</strong> - {user.email}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}