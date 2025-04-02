import React, { useState } from 'react';
import { Building2, Key, User, Mail, Lock, UserCircle } from 'lucide-react';

const Authentication = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    role: 'receptionist' // Default role
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const t = {
    login: 'Login',
    register: 'Register',
    email: 'Email',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    name: 'Full Name',
    role: 'Role',
    forgotPassword: 'Forgot Password?',
    noAccount: "Don't have an account?",
    haveAccount: 'Already have an account?',
    signUp: 'Sign Up',
    signIn: 'Sign In',
    welcomeBack: 'Welcome back',
    createAccount: 'Create a new account',
    selectRole: 'Select your role'
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!isLogin && formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    // Use the selected role directly
    setTimeout(() => {
      localStorage.setItem('userRole', formData.role);
      localStorage.setItem('userEmail', formData.email);
      setLoading(false);
      window.location.href = '/dashboard';
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center font-['Poppins',sans-serif]" 
         style={{ backgroundImage: `url('/src/assets/images/LoginBackground.jpg')`}}>
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      
      <div className="relative z-10 backdrop-blur-md bg-white/20 p-8 rounded-2xl shadow-2xl w-full max-w-md border border-white/30">
        <div className="text-center mb-6">
          <div className="flex justify-center mb-2">
            <Building2 className="h-10 w-10 text-amber-400" />
          </div>
          <h1 className="text-3xl font-extrabold text-white">PMS</h1>
          <p className="text-amber-200 mt-1 text-sm">Property Management System</p>
        </div>
        
        <h2 className="text-2xl font-bold text-center text-white mb-6">
          {isLogin ? t.welcomeBack : t.createAccount}
        </h2>
        
        {error && (
          <div className="bg-red-400/30 backdrop-blur-sm border-l-4 border-red-500 text-white px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="mb-5">
              <label className="block text-white text-sm font-medium mb-1">{t.name}</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-amber-300" />
                </div>
                <input
                  type="text"
                  name="name"
                  className="w-full pl-10 px-4 py-3 rounded-lg bg-white/10 border border-white/30 focus:border-amber-400 focus:ring-2 focus:ring-amber-300/50 transition text-white placeholder-white/60"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required={!isLogin}
                  placeholder="Name"
                />
              </div>
            </div>
          )}
          
          <div className="mb-5">
            <label className="block text-white text-sm font-medium mb-1">{t.email}</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-amber-300" />
              </div>
              <input
                type="email"
                name="email"
                className="w-full pl-10 px-4 py-3 rounded-lg bg-white/10 border border-white/30 focus:border-amber-400 focus:ring-2 focus:ring-amber-300/50 transition text-white placeholder-white/60"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                placeholder="Email"
              />
            </div>
          </div>
          
          <div className="mb-5">
            <label className="block text-white text-sm font-medium mb-1">{t.password}</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-amber-300" />
              </div>
              <input
                type="password"
                name="password"
                className="w-full pl-10 px-4 py-3 rounded-lg bg-white/10 border border-white/30 focus:border-amber-400 focus:ring-2 focus:ring-amber-300/50 transition text-white placeholder-white/60"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                placeholder="••••••••"
              />
            </div>
          </div>
          
          {!isLogin && (
            <div className="mb-5">
              <label className="block text-white text-sm font-medium mb-1">{t.confirmPassword}</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Key className="h-5 w-5 text-amber-300" />
                </div>
                <input
                  type="password"
                  name="confirmPassword"
                  className="w-full pl-10 px-4 py-3 rounded-lg bg-white/10 border border-white/30 focus:border-amber-400 focus:ring-2 focus:ring-amber-300/50 transition text-white placeholder-white/60"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  required={!isLogin}
                  placeholder="••••••••"
                />
              </div>
            </div>
          )}
          
          {/* Role selection dropdown - added for both login and registration */}
          <div className="mb-5">
            <label className="block text-white text-sm font-medium mb-1">{t.role}</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <UserCircle className="h-5 w-5 text-amber-300" />
              </div>
              <select
                name="role"
                className="w-full pl-10 px-4 py-3 rounded-lg bg-white/10 border border-white/30 focus:border-amber-400 focus:ring-2 focus:ring-amber-300/50 transition text-white placeholder-white/60 appearance-none"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                required
              >
                <option value="receptionist" className="bg-gray-800 text-white">Receptionist</option>
                <option value="admin" className="bg-gray-800 text-white">Administrator</option>
              </select>
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-amber-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>
            </div>
          </div>
          
          {isLogin && (
            <div className="mb-5 text-right">
              <a href="/forgot-password" className="text-sm text-amber-300 hover:text-amber-100 transition">
                {t.forgotPassword}
              </a>
            </div>
          )}
          
          <div className="mb-5">
            <button
              type="submit"
              className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 rounded-lg shadow-lg hover:shadow-amber-500/30 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 transition"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {isLogin ? t.signIn : t.signUp}
                </span>
              ) : (
                isLogin ? t.signIn : t.signUp
              )}
            </button>
          </div>
          
          <div className="text-center">
            <p className="text-sm text-white/80">
              {isLogin ? t.noAccount : t.haveAccount}
              <button
                type="button"
                className="ml-1 text-amber-300 hover:text-amber-100 font-medium transition"
                onClick={() => setIsLogin(!isLogin)}
              >
                {isLogin ? t.register : t.login}
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Authentication;