import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { HideLoading, ShowLoading } from "../redux/alertsSlice";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";

function Login() {
  const dispatch = useDispatch();
  const naviagte = useNavigate();
  const [user, setUser] = useState({
    email: "GuestUser@gmail.com",
    password: "GuestUser",
  });
  const login = async (req, res) => {
    try {
      if (user.email !== "" && user.password !== "") {
        dispatch(ShowLoading());
        const response = await axios.post("/api/users/login", user);
        dispatch(HideLoading());
        if (response.data.success) {
          toast.success(response.data.message);
          localStorage.setItem("token", response.data.token);
          naviagte("/");
        } else {
          toast.error(response.data.message);
        }
      } else {
        toast.error("enter the email and password");
      }
    } catch (error) {
      dispatch(HideLoading());
      toast.error(error);
      console.log("error in login = ", error);
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col gap-5 w-96 p-5">
        <h1 className="text-3xl font-bold text-secondary">Welcome Back</h1>
        <hr />
        <input
          required
          type="text"
          placeholder="Email"
          value={user.email}
          onChange={(e) => setUser({ ...user, email: e.target.value })}
        />
        <input
          required
          type="password"
          placeholder="Password"
          value={user.password}
          onChange={(e) => setUser({ ...user, password: e.target.value })}
        />
        <button className="primary bg-primary" onClick={login}>
          Login
        </button>
        <Link to="/register" className="text-secondary underline">
          Not yet Registered ? Click Here To Signup
        </Link>
        <Link to="/forgot-password" className="text-secondary underline">
          forgot password ? Click Here To change
        </Link>
      </div>
      <div>
        <img
          className="h-[500px]"
          src="https://img.freepik.com/premium-photo/3d-rendering-3d-illustration-red-black-music-note-icon-isolated-white-background-song-melody-tune-symbol-concept_640106-443.jpg?w=2000"
          alt=""
        />
      </div>
    </div>
  );
}

export default Login;
