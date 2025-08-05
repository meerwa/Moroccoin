import React, { useEffect, useState } from 'react';

export default function TransactionList() {
  const [txs, setTxs] = useState([]); // ✅ Initialisé comme tableau
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:3001/api/transactions');
        
        if (!response.ok) {
          throw new Error(`Erreur HTTP: ${response.status}`);
        }
        
        const data = await response.json();
        setTxs(Array.isArray(data) ? data : []);
        
      } catch (err) {
        console.error('Erreur transactions:', err);
        setTxs([]);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTransactions();
  }, []);
  
  if (loading) return <div>Chargement des transactions...</div>;
  if (error) return <div style={{color: 'red'}}>Erreur: {error}</div>;
  
  return (
    <div>
      <h3>Transactions ({txs.length})</h3>
      {txs.length === 0 ? (
        <p>Aucune transaction trouvée</p>
      ) : (
        <ul>
          {txs.map(t => (
            <li key={t.id}>
              Utilisateur {t.user_id} - Montant: {t.amount} - Statut: {t.status}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}