import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import api from '../services/api.js';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('auth/signup', { email, password });
      console.log('Signup successful:', response.data);
      alert('SignUp successful . You cna now log in');
    } 
    
    catch (error) {
      console.error('Signup failed:', error.response?.data || error.message);
      alert('Signup failed: ' + (error.response?.data?.message || 'Something went wrong.'));
    }
  };

  return (
    <div>
      <h1 className='flex justify-center'>Signup</h1>
      <form onSubmit={handleSignup}>

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
        
        <button type="submit">Signup</button>
      </form>

      <p className='text-center'>
        Already have an account?{' '}
        <Link to="/">Login here</Link>
      </p>
    </div>
  );
};

export default Signup;
