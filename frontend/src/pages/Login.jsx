import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [state, setState] = useState("Sign up");

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const {backendURL, token, setToken} = useContext(AppContext);

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {

      if (state === 'Sign up') {
        const {data} = await axios.post(`${backendURL}/api/user/register`, {
          name, email, password
        });

        if(data.success){
          localStorage.setItem("token", data.token);
          setToken(data.token);
        } else {
          toast.error(data.message);
        }
      }else if (state === 'Login') {
        const {data} = await axios.post(`${backendURL}/api/user/login`, {
          email, password
        });

        if(data.success){
          localStorage.setItem("token", data.token);
          setToken(data.token);
        } else {
          toast.error(data.message);
        }
      }

    } catch (error) {
      toast.error(error.message);
      console.log("Error in authentication", error);
    }

  };

  useEffect( () => {
    if(token){
      navigate('/');
    }
    },[token])

  return (
    <form onSubmit={onSubmitHandler} className="min-h-[80vh] flex items-center ">
      <div className="flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-[#5E5E5E] text-sm shadow-lg">
        <p className="text-2xl font-semibold">
          {state === "Sign up" ? "Create Account" : "Login"}
        </p>
        <p>
          Please {state === "Sign up" ? "sign-up" : "log-in"} to book your
          appointment
        </p>
        {
          state === "Sign up" && (
            <div className="w-full">
              <p>Full Name</p>
              <input
                className="border border-[#DADADA] rounded w-full p-2 mt-1"
                type="text"
                onChange={(e) => setName(e.target.value)}
                value={name}
                required
              />
            </div>)
          }
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
          className="bg-primary text-white w-full py-2 my-2 rounded-md text-base"
          type="submit"
        >
          {state === "Sign up" ? "Create Account" : "Login"}
        </button>

        {state === "Sign up" ? (
          <p>
            Already have an account? <span onClick={()=>setState("Login")} className="text-primary underline cursor-pointer">login here</span>
          </p>
        ) : (
          <p>
            Don't have an account? <span onClick={()=>setState("Sign up")} className="text-primary underline cursor-pointer">create account here</span>
          </p>
        )}
      </div>
    </form>
  );
};

export default Login;
