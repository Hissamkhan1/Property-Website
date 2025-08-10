import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { HomeIcon, UserIcon, SettingsIcon, LogOutIcon } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Navbar: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      setShowProfileMenu(false);
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <HomeIcon className="h-6 w-6 text-black mr-2" />
          <span className="text-xl font-bold">NESTIFY</span>
        </div>
        
        <div className="hidden md:flex items-center space-x-8">
          <NavLink 
            to="/" 
            className={({ isActive }) => 
              isActive ? "text-blue-600 font-medium" : "text-gray-700 hover:text-gray-900"
            }
          >
            Home
          </NavLink>
          <NavLink 
            to="/properties" 
            className={({ isActive }) => 
              isActive ? "text-blue-600 font-medium" : "text-gray-700 hover:text-gray-900"
            }
          >
            Properties
          </NavLink>
          <NavLink 
            to="/contact" 
            className={({ isActive }) => 
              isActive ? "text-blue-600 font-medium" : "text-gray-700 hover:text-gray-900"
            }
          >
            Contact Us
          </NavLink>
        </div>
        
        <div className="flex items-center space-x-4">
          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-300"
              >
                <UserIcon className="h-4 w-4" />
                <span>{currentUser.email?.split('@')[0]}</span>
              </button>
              
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                  <Link
                    to="/admin"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setShowProfileMenu(false)}
                  >
                    <SettingsIcon className="h-4 w-4 mr-2" />
                    Admin Panel
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <LogOutIcon className="h-4 w-4 mr-2" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link 
              to="/login"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-300"
            >
              Property Owner Login
            </Link>
          )}
        </div>
        
        <button className="md:hidden flex items-center">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;