import React from 'react'
import { Link } from 'react-router-dom'
import { HiMiniBars3CenterLeft } from "react-icons/hi2"
import { IoSearchCircle } from "react-icons/io5"
import { HiOutlineUser } from "react-icons/hi"

import { MdLibraryBooks } from "react-icons/md"
import avatarImg from "../assets/avatar.png"
import Login from './Login'
import Register from './Register'
import { useAuth } from '../context/AuthContext'

const navigation = [
  {name: "Dashboard", href:"/user-dashboard"},
  {name: "Borrowed Books", href:"/borrowed-books"},
]

const Navbar  = () => {

  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
  console.log(isDropdownOpen)


  const {currentUser, logoutUser} = useAuth();

  const handleLogout = () => {
    logoutUser();

  }

  return (
    <header className='max-w-screen-2xl mx-auto px-20 py-10'>
        <nav className='flex justify-between items-center'>
            {/*left side*/}
         <div className="flex items-center md:gap-10 gap-6">
           {/* Menu Icon */}
            <Link to="/">
             <HiMiniBars3CenterLeft className="size-6 text-gray-700" />
            </Link>

            {/* Search Bar */}
            <div className="relative w-full max-w-[18rem] sm:max-w-[20rem]">
             <IoSearchCircle className="absolute left-3 top-1/2 -translate-y-1/2 size-6 text-gray-400" />
             <input 
               type="text" 
               placeholder="Search Here"
               className="bg-[#EAEAEA] w-full py-2 pl-10 pr-4 rounded-2xl focus:outline-none"
            />
            </div>
        </div>       
            {/*right side*/}
            <div className="relative flex items-center md:space-x-4 space-x-2">
                <div>
                 {
                 
                 currentUser ? <>
                 <button onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                 <img src={avatarImg} className={`w-8 h-8 rounded-full ${currentUser ? 'ring-2 ring-blue-500' : ""}`}/>
                 </button>
                 
                 {
                  isDropdownOpen && (
                    <div className='absolute right-0 mt-2 py-2 w-48 bg-white rounded-md shadow-lg'>
                      <ul className='space-y-1'>
                        {
                          navigation.map((item) => (
                            <li key={item.name} onClick={() => setIsDropdownOpen(false)}>
                              <Link to={item.href} className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'>
                              {item.name}

                              </Link>
                            </li>
                          ))
                        }
                        <li>
                          <button 
                          onClick={handleLogout}
                          className='block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100'>
                            Logout
                          </button>
                        </li>
                      </ul>
                    </div>
                  )
                 }
                 </> : <Link to ="/login"><HiOutlineUser className='size-6'/></Link> 
                 }
                </div>


                <Link 
                  to="/borrowed-books" 
                  className='hidden sm:block ml-2 p-2 rounded-full hover:bg-gray-100 transition-colors'
                  title='Borrowed Books'
                >
                  <MdLibraryBooks className='size-6 text-gray-700'/>
                </Link>

            </div> 
        </nav>                
    </header>

  )
}

export default Navbar