import React from 'react'
import { useContext } from 'react';
import { AdminContext } from '../../context/AdminContext';
import { useEffect } from 'react';
import { AppContext } from '../../context/AppContext';
import { assets } from '../../assets/assets';

const AllAppointments = () => {

  const {aToken, appointments, getAllAppointments, cancelAppointment} = useContext(AdminContext);
  const {currencySymbol, calculateAge, slotDateFormat} = useContext(AppContext);

  useEffect(()=>{
    if(aToken){
      getAllAppointments();
    }
  },[aToken])

  return (
    <div className='w-full max-w-6xl m-5'>
      <p className='mb-3 text-lg font-medium'>All Appointments</p>

      <div className='bg-white border rounded text-sm max-h-[80vh] min-h-[60vh] overflow-y-scroll'>
        <div className='hidden sm:grid grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] grid-flow-col py-3 px-6 border-b'>
          <p>#</p>
          <p>Patient</p>
          <p>Age</p>
          <p>Date & Time</p>
          <p>Doctor</p>
          <p>Fee</p>
          <p>Actions</p>
        </div>
        
        {appointments.length === 0 ? (
              <p className='p-40 text-gray-500 text-xl text-center'>No appointments found</p>
          ) :
          (
          appointments.map((appointment, index) => (
          <div key={index} className='flex flex-wrap justify-between max-sm:gap-2 sm:grid sm:grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] py-3 px-6 border-b items-center hover:bg-gray-50'>
            <p className='max-sm:hidden'>{index + 1}</p>
            <div className='flex items-center gap-2'>
              <img className='w-8 rounded-full' src={appointment.userData.image} alt="" />
              <div>
                <p className='font-medium'>{appointment.userData.name}</p>
                <p className='text-xs text-gray-500'>{appointment.userData.email}</p>
              </div>
            </div>
            <p className='max-sm:hidden'>{calculateAge(appointment.userData.dob)}</p>
            <div>
              <p className='font-medium'>{slotDateFormat(appointment.slotDate)}</p>
              <p className='text-xs text-gray-500'>{appointment.slotTime}</p>
            </div>
            <div className='flex items-center gap-2'>
              <img className='w-8 rounded-full bg-gray-200' src={appointment.docData.image} alt="" />
              <div>
                <p className='font-medium'>{appointment.docData.name}</p>
                <p className='text-xs text-gray-500'>{appointment.docData.speciality}</p>
              </div>
            </div>
            <p>{currencySymbol} {appointment.amount}</p>
              {appointment.cancelled ? (
                <p className="text-red-500 font-medium">Cancelled</p>
              ) : appointment.isCompleted ? (
                <p className="text-green-500 font-medium">Completed</p>
              ) : (
                <div className="flex">
                  <img
                    onClick={() => cancelAppointment(appointment._id)}
                    className="w-10 cursor-pointer"
                    src={assets.cancel_icon}
                    alt=""
                  />
                </div>
              )}
          </div>
        )))}

      </div>

    </div>
  )
}

export default AllAppointments
