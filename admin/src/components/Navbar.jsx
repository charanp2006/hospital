import React, { useState } from 'react'
import {assets} from '../assets/assets'
import { NavLink, useNavigate } from 'react-router-dom'
import { useContext } from 'react';
import { AdminContext } from '../context/AdminContext';

const Navbar = () => {

    const navigate = useNavigate();

    const {aToken,setAToken} = useContext(AdminContext);

    const logout = () => {
        aToken && setAToken('');
        aToken && localStorage.removeItem('aToken');
        navigate('/');
    }

  return (
    <div className='flex justify-between items-center text-sm py-3 px-4 sm:px-10 border-b border-b-gray-200 '>
        
        <div className='flex items-center gap-2 text-xs'>
            <img onClick={()=>navigate('/')} className='w-36 sm:w-40 cursor-pointer' src={assets.admin_logo} alt="" />
            <p className='border px-2.5 py-0.5 rounded-full border-gray-500 text-gray-600'>{aToken ? "Admin" : "Doctor"}</p>
        </div>
        
        <button onClick={logout} className='bg-primary text-white text-sm px-10 py-2 rounded-full hover:text-black cursor-pointer'>Logout</button>
        
    </div>
  )
}

export default Navbar