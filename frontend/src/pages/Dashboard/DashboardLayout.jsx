import axios from 'axios';
import React, { useState } from 'react'

import Loading from '../../components/Loading';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { 
  HiViewGridAdd, 
  HiOutlineChartBar, 
  HiOutlineBookOpen, 
  HiOutlineCog, 
  HiOutlineLogout,
  HiOutlineUserGroup 
} from "react-icons/hi";
import { IoSearchOutline, IoNotificationsOutline } from 'react-icons/io5';

const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate("/")
  }

  return (
    <div className='flex min-h-screen bg-gray-100 overflow-hidden'>
      {/* Mobile Sidebar */}
      <div className={`fixed inset-0 z-40 lg:hidden ${isSidebarOpen ? 'block' : 'hidden'}`} role='dialog' aria-modal='true'>
        <div className='fixed inset-0 bg-gray-600 opacity-75' onClick={() => setIsSidebarOpen(false)}></div>
        <div className='relative flex-1 flex flex-col max-w-xs w-full bg-gray-800'>
          <div className='absolute top-0 right-0 -mr-12 pt-2'>
            <button 
              onClick={() => setIsSidebarOpen(false)}
              className='ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white'
            >
              <span className='sr-only'>Close sidebar</span>
              <HiOutlineLogout className='h-6 w-6 text-white' />
            </button>
          </div>
          <div className='flex-1 h-0 pt-5 pb-4 overflow-y-auto'>
            <div className='flex-shrink-0 flex items-center px-4'>
              <img className='h-8 w-auto' src='/fav-icon.png' alt='Logo' />
            </div>
            <nav className='mt-5 px-2 space-y-1'>
              {[
                { name: 'Dashboard', icon: HiOutlineChartBar, href: '/dashboard' },
                { name: 'Add Book', icon: HiViewGridAdd, href: '/dashboard/add-new-book' },
                { name: 'Manage Books', icon: HiOutlineBookOpen, href: '/dashboard/manage-books' },
                { name: 'User Details', icon: HiOutlineUserGroup, href: '/dashboard/user-details' }
              ].map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className='text-gray-300 hover:bg-gray-700 hover:text-white group flex items-center px-2 py-2 text-base font-medium rounded-md'
                >
                  <item.icon className='mr-4 h-6 w-6 text-gray-400 group-hover:text-gray-300' />
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
          <div className='flex-shrink-0 flex border-t border-gray-700 p-4'>
            <button 
              onClick={handleLogout}
              className='flex items-center text-gray-300 hover:text-white'
            >
              <HiOutlineLogout className='h-6 w-6 mr-3' />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div className='hidden lg:flex lg:flex-shrink-0'>
        <div className='flex flex-col w-64 bg-gray-800'>
          <div className='flex-1 flex flex-col pt-5 pb-4 overflow-y-auto'>
            <div className='flex items-center flex-shrink-0 px-4'>
              <img className='h-8 w-auto' src='/fav-icon.png' alt='Logo' />
            </div>
            <nav className='mt-5 flex-1 px-2 space-y-1'>
              {[
                { name: 'Dashboard', icon: HiOutlineChartBar, href: '/dashboard' },
                { name: 'Add Book', icon: HiViewGridAdd, href: '/dashboard/add-new-book' },
                { name: 'Manage Books', icon: HiOutlineBookOpen, href: '/dashboard/manage-books' },
                { name: 'User Details', icon: HiOutlineUserGroup, href: '/dashboard/user-details' }
              ].map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className='text-gray-300 hover:bg-gray-700 hover:text-white group flex items-center px-2 py-2 text-sm font-medium rounded-md'
                >
                  <item.icon className='mr-3 h-6 w-6 text-gray-400 group-hover:text-gray-300' />
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
          <div className='flex-shrink-0 flex border-t border-gray-700 p-4'>
            <button 
              onClick={handleLogout}
              className='flex items-center text-gray-300 hover:text-white'
            >
              <HiOutlineLogout className='h-6 w-6 mr-3' />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className='flex flex-col w-0 flex-1 overflow-hidden'>
        <div className='relative z-10 flex-shrink-0 flex h-16 bg-white shadow lg:border-none'>
          <button
            onClick={() => setIsSidebarOpen(true)}
            className='px-4 border-r border-gray-200 text-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 lg:hidden'
          >
            <span className='sr-only'>Open sidebar</span>
            <HiOutlineChartBar className='h-6 w-6' />
          </button>
          <div className='flex-1 px-4 flex justify-between sm:px-6 lg:max-w-6xl lg:mx-auto lg:px-8'>
            <div className='flex-1 flex'>
              <form className='w-full flex md:ml-0' action='#' method='GET'>
                <label htmlFor='search_field' className='sr-only'>
                  Search
                </label>
                <div className='relative w-full text-gray-400 focus-within:text-gray-600'>
                  <div className='absolute inset-y-0 left-0 flex items-center pointer-events-none'>
                    <IoSearchOutline className='h-5 w-5' />
                  </div>
                  <input
                    id='search_field'
                    className='block w-full h-full pl-8 pr-3 py-2 border-transparent text-gray-900 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-0 focus:border-transparent sm:text-sm'
                    placeholder='Search'
                    type='search'
                    name='search'
                  />
                </div>
              </form>
            </div>
            <div className='ml-4 flex items-center md:ml-6'>
              <button
                type='button'
                className='bg-white p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
              >
                <span className='sr-only'>View notifications</span>
                <IoNotificationsOutline className='h-6 w-6' />
              </button>

              <div className='ml-3 relative'>
                <div>
                  <button
                    type='button'
                    className='max-w-xs bg-white rounded-full flex items-center text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                    id='user-menu'
                    aria-expanded='false'
                    aria-haspopup='true'
                  >
                    <span className='sr-only'>Open user menu</span>
                    <img
                      className='h-8 w-8 rounded-full'
                      src='https://randomuser.me/api/portraits/women/68.jpg'
                      alt=''
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <main className='flex-1 relative overflow-y-auto focus:outline-none'>
          <div className='py-6'>
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
              <h1 className='text-3xl font-bold text-gray-900 mb-4'>Dashboard</h1>
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout