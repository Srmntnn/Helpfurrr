import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'

function Main(){
  return (
    <div className='mt-32'>
        <Navbar/>
        <Outlet/>
    </div>
  )
}

export default Main