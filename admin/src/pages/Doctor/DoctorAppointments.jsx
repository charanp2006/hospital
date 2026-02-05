import React, { useContext } from 'react'
import { AppContext } from '../../context/AppContext';
import { DoctorContext } from '../../context/DoctorContext';
import { useEffect } from 'react';
import { assets } from '../../assets/assets';

const DoctorAppointments = () => {

  const {dToken, appointments, getDoctorAppointments, cancelDoctorAppointment, completeDoctorAppointment} = useContext(DoctorContext);
  const {calculateAge, slotDateFormat, currencySymbol} = useContext(AppContext);

  useEffect(() => {
    if(dToken){
      getDoctorAppointments();
    }
  }, [dToken])

  return (
    <div className='w-full max-w-6xl m-5'>
      <p className='mb-3 text-lg font-medium'>All Appointments</p>

      <div className='bg-white border rounded text-sm max-h-[80vh] min-h-[60vh] overflow-y-scroll'>
        <div className='hidden sm:grid grid-cols-[0.5fr_2fr_1fr_1fr_2fr_1fr_1fr] grid-flow-col py-3 px-6 border-b'>
          <p>#</p>
          <p>Patient</p>
          <p>Payment</p>
          <p>Age</p>
          <p>Date & Time</p>
          <p>Fees</p>
          <p>Action</p>
        </div>

        {appointments.length === 0 ? (
              <p className='p-40 text-gray-500 text-xl text-center'>No appointments found</p>
          ) :
          (
          appointments.reverse().map((appointment, index) => (
          <div key={index} className='flex flex-wrap justify-between max-sm:gap-2 sm:grid sm:grid-cols-[0.5fr_2fr_1fr_1fr_2fr_1fr_1fr] py-3 px-6 border-b items-center hover:bg-gray-50'>
            <p className='max-sm:hidden'>{index + 1}</p>
            <div className='flex items-center gap-2'>
              <img className='w-8 rounded-full' src={appointment.userData.image} alt="" />
              <div>
                <p className='font-medium'>{appointment.userData.name}</p>
                <p className='text-xs text-gray-500'>{appointment.userData.email}</p>
              </div>
            </div>
            <div>
              <p className='text-xs inline border border-primary px-2 rounded-full'>{appointment.payment ? 'Online' : 'Cash'}</p>
            </div>
            <p className='max-sm:hidden'>{calculateAge(appointment.userData.dob)}</p>
            <div>
              <p className='font-medium'>{slotDateFormat(appointment.slotDate)}</p>
              <p className='text-xs text-gray-500'>{appointment.slotTime}</p>
            </div>
            <p>{currencySymbol} {appointment.amount}</p>
            {
              appointment.cancelled ? 
                <p className='text-red-500 font-medium'>Cancelled</p>
              : appointment.isCompleted ?
                <p  className='text-green-500 font-medium'>Completed</p>
              :
                <div className='flex'>
                  <img onClick={()=>cancelDoctorAppointment(appointment._id)} className='w-10 cursor-pointer' src={assets.cancel_icon} alt="" />
                  <img onClick={()=>completeDoctorAppointment(appointment._id)} className='w-10 cursor-pointer' src={assets.tick_icon} alt="" />
                </div>
            }
          </div>
        )))}
      </div>
    </div>
  )
}

export default DoctorAppointments
