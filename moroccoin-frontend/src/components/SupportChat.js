import React, { useState } from 'react';

export default function SupportChat() {
  const [msg, setMsg] = useState('');
  const [userId, setUserId] = useState('');
  
  const send = () => {
    fetch('http://localhost:3001/api/support/message', { // Changé de 5000 à 3001
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, message: msg })
    })
    .then(() => {
      alert('Message sent!');
      setMsg('');
      setUserId('');
    })
    .catch(err => console.error('Erreur:', err));
  };
  
  return (
    <div>
      <h4>Support Chat (simulation)</h4>
      <input placeholder="User ID" value={userId} onChange={e => setUserId(e.target.value)} />
      <textarea value={msg} onChange={e => setMsg(e.target.value)} />
      <button onClick={send}>Send</button>
    </div>
  );
}