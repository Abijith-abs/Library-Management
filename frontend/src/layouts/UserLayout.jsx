import React from 'react'
import { Outlet } from 'react-router-dom'
import App from '../App'

const UserLayout = () => {
  return (
    <App>
      <Outlet />
    </App>
  )
}

export default UserLayout
