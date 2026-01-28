import React from 'react'
import { useContext } from 'react';
import { AdminContext } from '../../context/AdminContext';
import { useEffect } from 'react';

const DoctorsList = () => {

  const { doctors, aToken, getAllDoctors, changeAvailability } = useContext(AdminContext);

  useEffect(() =>{
    if(aToken){
      getAllDoctors();
    }
  },[aToken])

  return (
    <div className='m-5 max-h-[90vh] overflow-y-scroll'>
      <h1 className='text-lg font-medium'>All Doctors</h1>

      <div className="w-full flex flex-wrap gap-4 pt-5 gap-y-6 px-3 sm:px-0">
        {doctors.map((item, index) => (
          <div
            key={index}
            className="border border-indigo-200 rounded-xl overflow-hidden max-w-56 group cursor-pointer hover:-translate-y- 5 transition-all duration-500"
          >
            <img className="bg-indigo-50 group-hover:bg-primary transition-all duration-500" src={item.image} alt="" />
            <div className="p-4">
              {/* <div className="flex items-center gap-2 text-sm text-center text-green-500">
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                <p>Available</p>
              </div> */}
              <p className="text-[#262626] text-lg font-medium">{item.name}</p>
              <p className="text-[#5C5C5C] text-sm">{item.speciality}</p>

              <div className="flex items-center gap-1 text-sm mt-2">
                <input onChange={()=>changeAvailability(item._id)} type="checkbox" checked={item.available} name="" id="" />
                <p>Available</p>
              </div>

            </div>
          </div>
        ))}
      </div>
      
    </div>
  )
}

export default DoctorsList
