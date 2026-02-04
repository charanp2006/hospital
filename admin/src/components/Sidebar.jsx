import React from 'react'
import { useContext } from 'react'
import { AdminContext } from '../context/AdminContext'
import { NavLink } from 'react-router-dom';
import { assets } from '../assets/assets';

const Sidebar = () => {

    const {aToken} = useContext(AdminContext);

  return (
    <div className='min-h-screen bg-white border-r border-gray-200'>
      {
        aToken && <ul className='text-[#515151] mt-5 '>

            <NavLink className={({isActive}) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:win-w-72 cursor-pointer ${isActive? 'bg-[#f2f3ff] border-r-4 border-primary':''}`} to={"/admin-dashboard"}>
                <img src={assets.home_icon} alt="" />
                <li className=' '>Dashboard</li>
            </NavLink>
            <NavLink className={({isActive}) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:win-w-72 cursor-pointer ${isActive? 'bg-[#f2f3ff] border-r-4 border-primary':''}`} to="/all-appointments">
                <img src={assets.appointment_icon} alt="" />
                <li className=' '>Appointments</li>
            </NavLink>
            <NavLink className={({isActive}) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:win-w-72 cursor-pointer ${isActive? 'bg-[#f2f3ff] border-r-4 border-primary':''}`} to="/add-doctor">
                <img src={assets.add_icon} alt="" />
                <li className=' '>Add Doctor</li>
            </NavLink>
            <NavLink className={({isActive}) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:win-w-72 cursor-pointer ${isActive? 'bg-[#f2f3ff] border-r-4 border-primary':''}`} to="/doctor-list">
                <img src={assets.people_icon} alt="" />
                <li className=' '>Doctors List</li>
            </NavLink>

        </ul>
      }
    </div>
  )
}

export default Sidebar
