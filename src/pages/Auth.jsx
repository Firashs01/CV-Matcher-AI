import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useSupabase } from '../hooks/useSupabase';

const Auth = ({ onSuccess, onCancel, isModal = false, initialIsLogin = true }) => {
  const [isLogin, setIsLogin] = useState(initialIsLogin);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signIn, signUp } = useSupabase();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    
    // Validation for Signup
    if (!isLogin && password !== confirmPassword) {
      setErrorMsg("Passwords do not match");
      return;
    }

    setIsLoading(true);

    let res;
    if (isLogin) {
      res = await signIn(email, password);
    } else {
      res = await signUp(email, password);
    }

    if (res?.error) {
      let msg = res.error.message;
      if (msg === "Invalid login credentials" && isLogin) {
        setErrorMsg("Invalid email or password. Please try again.");
      } else if (msg === "Email not confirmed") {
        setErrorMsg("Please confirm your email address before signing in. Check your inbox for a confirmation link.");
      } else {
        setErrorMsg(msg);
      }
    } else {
      if (onSuccess) onSuccess();
    }
    setIsLoading(false);
  };

  const containerClasses = isModal
    ? "bg-white/80 backdrop-blur-xl p-8 rounded-3xl border border-white/50 shadow-2xl max-w-md w-full mx-4"
    : "max-w-md w-full mx-auto bg-white/70 backdrop-blur-md p-8 rounded-3xl border border-white/20 shadow-sm mt-20";

  const content = (
    <div className={containerClasses}>
      <h2 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">
        {isLogin ? 'Welcome Back' : 'Create Account'}
      </h2>
      <p className="text-slate-500 mb-8">
        {isLogin ? 'Sign in to access your CV analysis history.' : 'Sign up to permanently save your CV analysis history.'}
      </p>

      {errorMsg && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-6 text-sm">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
          <input 
            type="email" 
            required 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-white/50 focus:bg-white"
            placeholder="you@example.com"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
          <input 
            type="password" 
            required 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-white/50 focus:bg-white"
            placeholder="••••••••"
          />
        </div>

        {!isLogin && (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Confirm Password</label>
            <input 
              type="password" 
              required 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-white/50 focus:bg-white"
              placeholder="••••••••"
            />
          </div>
        )}

        <button 
          type="submit" 
          disabled={isLoading}
          className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-400 text-white font-bold tracking-tight py-3 px-8 rounded-xl shadow-[0_4px_14px_0_rgba(79,70,229,0.39)] hover:shadow-[0_6px_20px_rgba(79,70,229,0.23)] hover:-translate-y-0.5 transition-all duration-200"
        >
          {isLoading ? 'Processing...' : isLogin ? 'Sign In' : 'Sign Up'}
        </button>
      </form>

      <div className="mt-6 text-center text-sm text-slate-500">
        {isLogin ? "Don't have an account? " : "Already have an account? "}
        <button 
          onClick={() => setIsLogin(!isLogin)} 
          className="text-indigo-600 hover:text-indigo-800 font-bold tracking-tight"
        >
          {isLogin ? 'Sign Up' : 'Sign In'}
        </button>
      </div>

      {isModal && onCancel && (
        <button 
          onClick={onCancel}
          className="mt-6 w-full py-2 text-sm text-slate-500 hover:text-slate-800 font-medium transition-colors"
        >
          Cancel
        </button>
      )}
    </div>
  );

  if (!isModal) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="min-h-screen pt-10 px-4"
      >
        {content}
      </motion.div>
    );
  }

  return content;
};

export default Auth;
