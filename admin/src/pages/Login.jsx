import React, { use, useState } from "react";
import { assets } from "../assets/assets";
import { AdminContext } from "../context/AdminContext";
import axios from "axios";
import { useContext } from "react";
import { toast } from "react-toastify";

const Login = () => {
  const [state, setState] = useState("Admin");

  const {setAToken, backendURL} = useContext(AdminContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    try {
      
      if(state==="Admin"){

        const {data} = await axios.post(`${backendURL}/api/admin/login`,{
          email,
          password
        });
        if(data.success){
          localStorage.setItem("aToken",data.token);
          setAToken(data.token);
        }else{
          toast.error(data.message);
        }

      }else{



      }
      
    } catch (error) {
      
    }

  };

  return (
    <form onSubmit={onSubmitHandler} className="min-h-[80vh] flex items-center ">
      <div className="flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-[#5E5E5E] text-sm shadow-lg">
        <p className="text-2xl font-semibold">
          <span className="text-primary"> {state} </span> Login
        </p>
        <div className="w-full">
          <p>Email</p>
          <input
            className="border border-[#DADADA] rounded w-full p-2 mt-1"
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            required
          />
        </div>
        <div className="w-full">
          <p>Password</p>
          <input
            className="border border-[#DADADA] rounded w-full p-2 mt-1"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            required
          />
        </div>
        <button
          className="bg-primary text-white w-full py-2 my-2 rounded-md text-base cursor-pointer hover:bg-blue-700"
          type="submit"
        >
          Login
        </button>

        {state === "Admin" ? (
          <p>
            Doctor Login? <span onClick={()=>setState("Doctor")} className="text-primary underline cursor-pointer hover:text-blue-700">click here</span>
          </p>
        ) : (
          <p>
            Admin Login? <span onClick={()=>setState("Admin")} className="text-primary underline cursor-pointer hover:text-blue-700">click here</span>
          </p>
        )}
      </div>
    </form>
  );
};

export default Login;
