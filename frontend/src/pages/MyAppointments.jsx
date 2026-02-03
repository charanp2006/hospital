import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const MyAppointments = () => {

  const {backendURL, token, getDoctorsData} = useContext(AppContext);

  const [appointments,setAppointments] = useState([]);
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "July", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const slotDateFormat = (slotDate) => {
    const dateArray = slotDate.split('-');
    const year = dateArray[0];
    const month = monthNames[parseInt(dateArray[1], 10) - 1];
    const day = dateArray[2];
    return `${day} ${month} ${year}`;
  }

  const getAppointments = async () => {
    try {

      const {data} = await axios.get(`${backendURL}/api/user/appointments`, { headers: {token}} );

      if(data.success){
        setAppointments(data.appointments.reverse());
        console.log(data.appointments);
      }

    } catch (error) {
      console.log('Error fetching appointments:', error);
      toast.error(error.message);
    }

  }

  const cancelAppointment = async(appointmentId) => {

    try {
      const {data} = await axios.post(`${backendURL}/api/user/cancel-appointment`, { appointmentId }, { headers: {token}} );
      if(data.success){
        toast.success(data.message);
        getAppointments();
        getDoctorsData();
      }else{
        toast.error(data.message);
      }

    } catch (error) {
      console.log('Error cancelling appointment:', error);
      toast.error(error.message);
    }

  }

  useEffect(() => {
    if(token){
      getAppointments();
    }
  }, [token]);

  return (
    <div>
      <p className='pb-3 mt-12 text-lg font-medium text-gray-600 border-b'>My Appointments</p>
      <div>
        {
          appointments.map((item, index) => (
            <div key={index} className='grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-4 border-b'>
              <div>
                <img className='w-36 bg-[#EAEFFF]' src={item.docData.image} alt="" />
              </div>
              <div className='flex-1 text-sm text-[#5E5E5E]'>
                <p className='text-[#262626] text-base font-semibold'>{item.docData.name}</p>
                <p>{item.docData.speciality}</p>
                <p className='text-[#464646] font-medium mt-1'>Address:</p>
                <p>{item.docData.address.line1}</p>
                <p>{item.docData.address.line2}</p>
                <p className='mt-1'> <span className='text-sm text-[#3C3C3C] font-medium'>Date & Time:</span> {slotDateFormat(item.slotDate)} | {item.slotTime} </p>
              </div>
              <div></div>
              <div className='flex flex-col gap-2 justify-end text-sm text-center'>
                {!item.cancelled && <button className='text-[#696969] sm:min-w-48 py-2 border rounded hover:bg-primary hover:text-white transition-all duration-300'>Pay Online</button> }
                {!item.cancelled && <button onClick={()=>cancelAppointment(item._id)} className='text-[#696969] sm:min-w-48 py-2 border rounded hover:bg-red-500 hover:text-white transition-all duration-300'>Cancel appointment</button> }
                {item.cancelled && <p className='text-red-500 font-medium'>Appointment Cancelled</p>}
              </div>
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default MyAppointments
