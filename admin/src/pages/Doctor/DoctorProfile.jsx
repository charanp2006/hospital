import React, { useState } from "react";
import { assets } from "../../assets/assets";
import axios from "axios";
import { toast } from "react-toastify";
import { DoctorContext } from "../../context/DoctorContext";
import { useContext } from "react";
import { AppContext } from "../../context/AppContext";
import { useEffect } from "react";

const DoctorProfile = () => {
  const { dToken, backendUrl, setProfileData, profileData, getProfileData } =
    useContext(DoctorContext);

  const { currencySymbol } = useContext(AppContext);

  useEffect(() => {
    if (dToken) {
      getProfileData();
    }
  }, [dToken]);

  const [isEdit, setIsEdit] = useState(false);

  const updateProfileData = async () => {

    try {

      const updateData = {
        fees: profileData.fees,
        address: profileData.address,
        available: profileData.available
      };

      const {data} = await axios.post(`${backendUrl}/api/doctor/update-profile`, updateData, {headers: {dToken}});

      if(data.success){
        toast.success(data.message);
        getProfileData();
        setIsEdit(false);
      }else{
        toast.error(data.message);
      }

    } catch (error) {
      toast.error(error.message);
      console.log("Error while updating doctor profile data", error);
    }

  };

  return (
    profileData && (
      <div className="flex flex-col gap-4 m-5">

        <div>

          <div className="inline-block relative cursor-pointer">
            <img
              className="bg-primary/80 w-full sm:max-w-64 rounded-lg border border-gray-400"
              src={profileData.image}
              alt=""
            />
          </div>

          <div className="flex-1 border border-stone-100 p-8 py-7 rounded-lg shadow-md bg-white mt-5">

            {/* --- Doctor info : name, degree, experience --- */}
            <p className="text-gray-700 flex items-center gap-2 text-3xl font-medium">{profileData.name}</p>
            <div className="flex items-center gap-2 mt-1 text-gray-600">
              <p>
                {profileData.degree} - {profileData.speciality}
              </p>
              <button className="py-0.5 px-2 border text-xs rounded-full">{profileData.experience} Years</button>
            </div>

            {/* ---- Doctor About ----- */}
            <div>
              <p className="flex items-center font-medium text-sm mt-3 text-neutral-800 gap-1">About : </p>
              <p className="text-gray-600 text-sm max-w-175 mt-1">{profileData.about}</p>
            </div>

            <p className="mt-4 font-medium text-gray-600">
              Appointment Fees :{" "}
              <span className="text-gray-800">
                {currencySymbol} {isEdit ? <input type="number" onChange={(e)=>setProfileData(prev => ({...prev, fees: e.target.value}))} value={profileData.fees} /> : profileData.fees}
              </span>
            </p>

            <div className="py-2 flex gap-2">
              <p>Address : </p>
              <div className="text-sm">
                <p>
                  {isEdit ? <input type="text" onChange={(e)=>setProfileData(prev => ({...prev, address:{...prev.address,line1: e.target.value}}))} value={profileData.address.line1} /> : profileData.address.line1} 
                  <br /> 
                  {isEdit ? <input type="text" onChange={(e)=>setProfileData(prev => ({...prev, address:{...prev.address,line2: e.target.value}}))} value={profileData.address.line2} /> : profileData.address.line2}
                </p>
              </div>
            </div>

            <div className="flex gap-1 pt-2">
              <input onChange={()=>isEdit && setProfileData(prev => ({...prev, available: !prev.available}))} checked={profileData.available} type="checkbox" name="" id="" />
              <label htmlFor="">Available</label>
            </div>

            <div>
              {isEdit ? (
                <button
                  className="border border-primary px-4 py-1 mt-5 text-sm rounded-full hover:bg-primary hover:text-white transition-all"
                  onClick={updateProfileData}
                >
                  Save
                </button>
              ) : (
                <button
                  className="border border-primary px-4 py-1 mt-5 text-sm rounded-full hover:bg-primary hover:text-white transition-all"
                  onClick={() => setIsEdit(true)}
                >
                  Edit
                </button>
              )}
            </div>
          </div>

        </div>

      </div>
    )
  );
};

export default DoctorProfile;
