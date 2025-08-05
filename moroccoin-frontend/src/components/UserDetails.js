import React, { useEffect, useState } from 'react';

export default function UserDetails({ userId }) {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    fetch(`http://localhost:3001/api/users/${userId}`) // Changé de 5000 à 3001
      .then(res => res.json())
      .then(setUser)
      .catch(err => console.error('Erreur:', err));
  }, [userId]);
  
  if (!user) return null;

  const handleRefund = (transactionId) => {
    fetch('http://localhost:3001/api/refund', { // Changé de 5000 à 3001
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ transactionId })
    })
    .then(() => {
      alert('Refunded!');
      // Recharger les données
      fetch(`http://localhost:3001/api/users/${userId}`)
        .then(res => res.json())
        .then(setUser);
    })
    .catch(err => console.error('Erreur:', err));
  };

  return (
    <div>
      <h4>User Details</h4>
      <div>Name: {user.name}</div>
      <div>Email: {user.email}</div>
      <h5>Transactions</h5>
      <ul>
        {user.transactions?.map(t => (
          <li key={t.id}>
            Amount: {t.amount} - Status: {t.status}
            {t.status !== 'refunded' && (
              <button onClick={() => handleRefund(t.id)}>Refund</button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}