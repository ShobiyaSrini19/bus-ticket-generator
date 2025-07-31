import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

export default function Login() {
  const [conductorId, setConductorId] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      await axios.post('http://localhost:5000/api/auth/login', {
        conductorId,
        password,
      });
      localStorage.setItem('loggedIn', conductorId);
      navigate('/dashboard');
    } catch (err) {
      alert('Invalid ID or password');
    }
  };

  return (
    <div>
      <h2>Conductor Login</h2>
      <input
        type="text"
        placeholder="Conductor ID"
        onChange={(e) => setConductorId(e.target.value)}
      />
      <input
        type="password"
        placeholder="Phone Number"
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
      <p>Don't have an account? <Link to="/signup">Sign up here</Link></p>
    </div>
  );
}
