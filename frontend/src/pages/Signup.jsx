import { useState } from 'react';
import { Link } from 'react-router-dom'; 
import api from '../services/api.js';

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
  });

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('auth/signup', formData);
      console.log('Signup successful:', response.data);
      alert('SignUp successful. You can now log in');
    } catch (error) {
      console.error('Signup failed:', error.response?.data || error.message);
      alert('Signup failed: ' + (error.response?.data?.message || 'Something went wrong.'));
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center">
      <div className="flex flex-col justify-center items-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="flex flex-col items-center gap-2 group">
              <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center 
                group-hover:bg-primary/20 transition-colors">
              </div>
              <h1 className="text-2xl font-bold mt-2">Create Account</h1>
              <p className="text-base-content/60">Get started with your free account</p>
            </div>
          </div>

          <form onSubmit={handleSignup} className="space-y-6">
            {/* Full Name Input */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Full Name</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  className="input input-bordered w-full"
                  placeholder="John Doe"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                />
              </div>
            </div>

            {/* Email Input */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Email</span>
              </label>
              <div className="relative">
                <input
                  type="email"
                  className="input input-bordered w-full"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Password</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className="input input-bordered w-full"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            {/* Signup Button */}
            <button type="submit" className="btn btn-primary w-full">
              Create Account
            </button>
          </form>

          <div className="text-center">
            <p className="text-base-content/60">
              Already have an account?{' '}
              <Link to="/" className="link link-primary">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
