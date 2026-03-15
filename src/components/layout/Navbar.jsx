import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BarChart2, UserCircle, Menu, X, Lock as LockIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = ({ user, isAuthenticated, isAnonymous, signOut }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  const navLinks = [
    { name: 'Dashboard', path: '/' },
    { name: 'History', path: '/history', gated: isAnonymous },
  ];

  const handleGatedClick = (e, path) => {
    if (isAnonymous && path === '/history') {
      // Logic managed by Link/gated prop, but we ensure sidebar closes
      closeMenu();
    }
  };

  return (
    <>
      <header className="bg-white/70 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2 text-indigo-600 z-50">
              <BarChart2 className="w-8 h-8" />
              <span className="text-xl font-bold tracking-tight">CV Matcher AI</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8 items-center">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.gated ? "/signup" : link.path}
                  className={`${
                    location.pathname === link.path
                      ? 'text-gray-900 border-indigo-600'
                      : 'text-gray-500 border-transparent hover:text-gray-700'
                  } border-b-2 px-1 py-5 text-sm font-medium transition-colors flex items-center space-x-1.5`}
                >
                  <span>{link.name}</span>
                  {link.gated && <LockIcon className="w-3.5 h-3.5 text-slate-400" />}
                </Link>
              ))}

              {isAuthenticated && !isAnonymous ? (
                <div className="flex items-center space-x-4 pl-4 border-l border-slate-200">
                  <div className="flex items-center space-x-2 text-sm font-medium text-slate-600 bg-slate-100 px-3 py-1.5 rounded-full">
                    <UserCircle className="w-5 h-5 text-indigo-500" />
                    <span className="max-w-[150px] truncate">{user?.email || `ID: ${user?.id.slice(0, 8)}`}</span>
                  </div>
                  <button
                    onClick={signOut}
                    className="text-sm text-slate-500 hover:text-slate-800 font-medium transition-colors"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-4 pl-4 border-l border-slate-200">
                  <div className="flex items-center space-x-2 text-sm font-medium text-slate-600 bg-slate-100 px-3 py-1.5 rounded-full">
                    <UserCircle className="w-5 h-5 text-slate-400" />
                    <span>Guest User</span>
                  </div>
                  <Link
                    to="/login"
                    className="text-sm text-indigo-600 hover:text-indigo-800 font-bold transition-colors"
                  >
                    Login
                  </Link>
                </div>
              )}
            </nav>

            {/* Mobile Hamburger Toggle */}
            <div className="md:hidden flex items-center">
              <button
                onClick={toggleMenu}
                className="p-2 text-slate-600 hover:text-indigo-600 transition-colors focus:outline-none"
                aria-label="Toggle Menu"
              >
                {isMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar & Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeMenu}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
            />

            {/* Sidebar */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 w-80 bg-slate-900/80 backdrop-blur-xl border-l border-white/20 z-50 md:hidden shadow-2xl flex flex-col"
            >
              <div className="p-6 flex justify-between items-center border-b border-white/10">
                <div className="flex items-center space-x-2 text-indigo-400">
                  <BarChart2 className="w-8 h-8" />
                  <span className="text-xl font-bold tracking-tight text-white">Menu</span>
                </div>
                <button
                  onClick={closeMenu}
                  className="p-2 text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-7 h-7" />
                </button>
              </div>

              <nav className="flex-1 px-4 py-8 space-y-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.gated ? "/signup" : link.path}
                    onClick={closeMenu}
                    className={`flex items-center justify-between w-full p-4 rounded-2xl text-lg font-semibold transition-all ${
                      location.pathname === link.path
                        ? 'bg-indigo-600 text-white shadow-lg'
                        : 'text-slate-300 hover:bg-white/5 hover:text-white shadow-sm'
                    } h-[60px]`}
                  >
                    <span>{link.name}</span>
                    {link.gated && <LockIcon className="w-5 h-5 text-slate-500" />}
                  </Link>
                ))}

                <div className="pt-8 border-t border-white/10 mt-8 space-y-4">
                  {isAuthenticated && !isAnonymous ? (
                    <>
                      <div className="flex items-center space-x-3 p-4 bg-white/5 rounded-2xl border border-white/10">
                        <UserCircle className="w-8 h-8 text-indigo-400" />
                        <div className="flex flex-col min-w-0">
                          <span className="text-xs text-slate-400 font-medium">Signed in as</span>
                          <span className="text-sm text-white font-bold truncate">
                            {user?.email || `ID: ${user?.id.slice(0, 8)}`}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          signOut();
                          closeMenu();
                        }}
                        className="w-full text-center p-4 text-rose-400 font-bold hover:bg-rose-500/10 rounded-2xl transition-all h-[60px]"
                      >
                        Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center space-x-3 p-4 bg-white/5 rounded-2xl border border-white/10">
                        <UserCircle className="w-8 h-8 text-slate-500" />
                        <span className="text-slate-300 font-bold">Guest Mode</span>
                      </div>
                      <Link
                        to="/login"
                        onClick={closeMenu}
                        className="flex items-center justify-center w-full p-4 bg-indigo-600 text-white font-black rounded-2xl shadow-lg hover:bg-indigo-500 transition-all h-[60px]"
                      >
                        Login / Sign Up
                      </Link>
                    </>
                  )}
                </div>
              </nav>

              <div className="p-6 text-center text-slate-500 text-xs">
                © 2026 CV Matcher AI • Premium Edition
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
