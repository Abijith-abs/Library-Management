import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { 
  HiMenu, 
  HiOutlineUser 
} from 'react-icons/hi';
import { 
  IoSearchCircle, 
  IoBookOutline, 
  IoLogOutOutline, 
  IoPersonCircleOutline 
} from 'react-icons/io5';

import avatarImg from '../assets/avatar.png';
import { useAuth } from '../context/AuthContext';

const NAVIGATION_ITEMS = [
  { name: 'Dashboard', href: '/user-dashboard', icon: IoPersonCircleOutline },
  { name: 'Borrowed Books', href: '/borrowed-books', icon: IoBookOutline },
];

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const { currentUser, logoutUser } = useAuth();

  const handleLogout = async () => {
    try {
      await logoutUser();
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (error) {
      toast.error('Logout failed');
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className='sticky top-0 z-50 bg-white/90 backdrop-blur-md shadow-md'>
      <nav className='max-w-7xl mx-auto flex justify-between items-center py-4 px-4 sm:px-6 lg:px-8'>
        {/* Left Side: Logo & Menu */}
        <div className='flex items-center space-x-4 sm:space-x-6'>
          {/* Hamburger Menu with Home Link */}
          <Link 
            to='/' 
            className='text-gray-700 hover:text-indigo-600 transition-colors group p-2 rounded-full hover:bg-gray-100'
            aria-label='Home'
          >
            <HiMenu className='w-6 h-6 sm:w-8 sm:h-8 group-hover:rotate-12 transition-transform duration-300' />
          </Link>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className='relative w-full max-w-xs sm:max-w-md'>
            <IoSearchCircle className='absolute left-3 top-1/2 -translate-y-1/2 w-6 h-6 sm:w-7 sm:h-7 text-gray-400' />
            <input
              type='text'
              placeholder='Search books...'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className='w-full pl-9 sm:pl-11 pr-4 py-2 sm:py-2.5 rounded-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs sm:text-sm'
            />
          </form>
        </div>

        {/* Right Side: User Actions */}
        <div className='flex items-center space-x-3 sm:space-x-4'>
          {/* Borrowed Books Shortcut */}
          <Link 
            to='/borrowed-books' 
            className='text-gray-600 hover:text-indigo-600 transition-colors group p-2 rounded-full hover:bg-gray-100'
            title='Borrowed Books'
          >
            <IoBookOutline className='w-5 h-5 sm:w-7 sm:h-7 group-hover:scale-110 transition-transform' />
          </Link>

          {currentUser ? (
            <div className='relative' ref={dropdownRef}>
              <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className='focus:outline-none'
              >
                <img 
                  src={avatarImg} 
                  alt='User Avatar' 
                  className='w-8 h-8 sm:w-10 sm:h-10 rounded-full ring-2 ring-indigo-500 hover:ring-indigo-700 transition-all'
                />
              </button>

              {isDropdownOpen && (
                <div className='absolute right-0 mt-4 w-64 bg-white/95 backdrop-blur-md rounded-xl shadow-2xl border border-gray-200 z-50 overflow-hidden'>
                  <div className='px-5 py-4 bg-gray-50/80 border-b border-gray-200'>
                    <p className='text-xs text-gray-500 mb-1'>Signed in as</p>
                    <p className='text-sm font-semibold text-gray-900 truncate'>{currentUser.username}</p>
                  </div>
                  <div className='py-2'>
                    {NAVIGATION_ITEMS.map((item) => (
                      <Link
                        key={item.href}
                        to={item.href}
                        className='block px-5 py-3 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-900 transition-colors group'
                      >
                        <div className='flex items-center space-x-3'>
                          <item.icon className='h-5 w-5 sm:h-6 sm:w-6 text-indigo-500 group-hover:text-indigo-700 transition-colors' />
                          <span>{item.name}</span>
                        </div>
                      </Link>
                    ))}
                    <button
                      onClick={handleLogout}
                      className='w-full text-left block px-5 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors group'
                    >
                      <div className='flex items-center space-x-3'>
                        <IoLogOutOutline className='h-5 w-5 sm:h-6 sm:w-6 text-red-500 group-hover:text-red-700 transition-colors' />
                        <span>Logout</span>
                      </div>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link 
              to='/login' 
              className='text-gray-600 hover:text-indigo-600 transition-colors'
            >
              <HiOutlineUser className='w-5 h-5 sm:w-6 sm:h-6' />
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;