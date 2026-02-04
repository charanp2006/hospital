import { createContext, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";


export const AdminContext = createContext();

const AdminContextProvider = ( props ) => {

    const [aToken,setAToken] = useState(localStorage.getItem('aToken')?localStorage.getItem('aToken'):'');
    const [doctors,setDoctors] = useState([]);
    const [appointments,setAppointments] = useState([]);
    const [dashboardData,setDashboardData] = useState(false);
    
    const backendURL = import.meta.env.VITE_BACKEND_URL;

    const getAllDoctors = async () => {

        try {

            const {data} = await axios.post(`${backendURL}/api/admin/all-doctors`,{},{headers:{aToken}});
            if(data.success){
                setDoctors(data.doctors);
                // console.log(data.doctors);        // For testing if data is coming correctly
            }else{
                toast.error(data.message);
            }
            
        } catch (error) {
            toast.error(error.message);
        }

    }

    const changeAvailability = async(doctorId) => {

        try {
            
            const {data} = await axios.post(`${backendURL}/api/admin/change-availability`,{doctorId},{headers:{aToken}});
            if(data.success){
                toast.success(data.message);
                getAllDoctors();
            }else{
                toast.error(data.message);
            }

        } catch (error) {
            toast.error(error.message);
        }

    }

    const getAllAppointments = async () => {

        try {

            const {data} = await axios.get(`${backendURL}/api/admin/appointments`,{headers:{aToken}});

            if(data.success){
                console.log(data.appointments); 
                setAppointments(data.appointments);
            }else{
                toast.error(data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }

    }

    const cancelAppointment = async(appointmentId) => {

        try {
            const {data} = await axios.post(`${backendURL}/api/admin/cancel-appointment`, { appointmentId }, { headers: {aToken}} );
            if(data.success){
                toast.success(data.message);
                getAllAppointments();
            }else{
                toast.error(data.message);
            }
        } catch (error) {
            console.log('Error cancelling appointment:', error);
            toast.error(error.message);
        }
    }

    const getDashboardData = async () => {

        try {
            const {data} = await axios.get(`${backendURL}/api/admin/dashboard`, { headers: {aToken}} );
            if(data.success){
                console.log(data.dashboardData);
                setDashboardData(data.dashboardData);
            }else{
                toast.error(data.message);
            }
        } catch (error) {
            console.log('Error fetching dashboard data:', error);
            toast.error(error.message);
        }
    }

    const value = {
        aToken, setAToken,
        backendURL, doctors,
        getAllDoctors, changeAvailability,
        appointments, setAppointments,
        getAllAppointments,
        cancelAppointment,
        dashboardData, getDashboardData
    }
    return (
        <AdminContext.Provider value={value}>
            {props.children}
        </AdminContext.Provider>
    )
}

export default AdminContextProvider;