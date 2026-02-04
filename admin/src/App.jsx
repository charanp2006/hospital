import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Login from './pages/Login'
import Navbar from './components/Navbar'
import { ToastContainer, toast } from 'react-toastify';
import { useContext } from 'react'
import { AdminContext } from './context/AdminContext'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Admin/Dashboard'
import AddDoctor from './pages/Admin/AddDoctor'
import DoctorsList from './pages/Admin/DoctorsList'
import AllAppointments from './pages/Admin/AllAppointments'

const App = () => {

  const {aToken} = useContext(AdminContext);

  return aToken ? (
    <div className='bg-[#f8f9fd]'>
    <div className=''>
      <ToastContainer/>
      <Navbar />
      <div className='flex items-start'>
        <Sidebar />
        <Routes>
          <Route path='/' element={<Dashboard />} />
          <Route path='/admin-dashboard' element={<Dashboard />} />
          <Route path='/all-appointments' element={<AllAppointments />} />
          {/* <Route path='/login' element={<Login />} /> */}
          <Route path='/add-doctor' element={<AddDoctor />} />
          <Route path='/doctor-list' element={<DoctorsList />} />
        </Routes>
      </div>
    </div>
    </div>
  ) : (
    <>
      <Login />
      <ToastContainer/>
    </>
  )
}

export default App
