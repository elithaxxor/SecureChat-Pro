/* (optional, future enhancement)
Basic login placeholder (to be extended with authentication): */ 

import React, { useState } from 'react';

const Login = ({ setUsername }) => {
  const [name, setName] = useState('');

  const handleLogin = () => {
    if (name.trim()) setUsername(name);
  };

  return (
    <div className="login-container">
      <input
        type="text"
        placeholder="Enter your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default Login;
