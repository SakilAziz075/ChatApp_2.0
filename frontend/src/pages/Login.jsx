import React, { useState } from 'react';
import { Link , useNavigate} from 'react-router-dom'; // Import Link from react-router-dom
import api from '../services/api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // Initialize useNavigate

  const handleLogin = async (e) => {
    e.preventDefault();
    
    try {
      const response = await api.post('auth/login', { email, password });
      console.log('Login success:', response.data);
      alert('Login successful');
      localStorage.setItem('token', response.data.token); // Stores the JWT

      navigate('/chat');
    } 
    
    catch (error) {
      console.error('Login failed:', error.response?.data || error.message);
      alert('Login failed: ' + (error.response?.data?.message || 'Something went wrong.'));
    }
  };

  return (
    <div >
      <h1 className='flex justify-center'>Login</h1>
      <form onSubmit={handleLogin}>
        
        <input
          className='px-4 py-1 rounded-xl mx-2'
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className='px-4 py-1 rounded-xl mx-2'
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit">Login</button>
      </form>

      <p className='text-center'>
        Don't have an account? {' '}
        <Link to="/signup"> Sign up here </Link>
      </p>
    </div>
  );
};

export default Login;
