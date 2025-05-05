
import { Outlet } from 'react-router-dom'
import './App.css'
import Navbar from './components/Navbar'
import Home from './pages/Home/Home'
import Footer from './components/Footer'
import { useState, useEffect } from 'react'
import Login from './components/Login'
import Register from './components/Register'
import { AuthProvide } from './context/AuthContext'


function App() {

  return (
    <>
      <AuthProvide>
      <Navbar></Navbar>
      <main className='min-h-screen max-w-screen-2xl mx-auto px-4 py-6 font-primary'> 
      <Outlet/>
      </main>
      <Footer/>
      </AuthProvide>
     </>
  )
}

export default App
