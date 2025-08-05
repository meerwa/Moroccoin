import React, { useState } from 'react';
import Login from './components/Login';
import UserList from './components/UserList';
import TransactionList from './components/TransactionList';
import UserDetails from './components/UserDetails';
import SupportChat from './components/SupportChat';
function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  if (!loggedIn) return <Login onLogin={() => setLoggedIn(true)} />;

  return (
    <div>
      <h1>Moroccoin Admin Panel</h1>
      <UserList onSelectUser={setSelectedUser} />
      <TransactionList />
      {selectedUser && <UserDetails userId={selectedUser} />}
      <SupportChat />
    </div>
  );
}

export default App;