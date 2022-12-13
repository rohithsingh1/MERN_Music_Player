import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { HideLoading, ShowLoading } from "../redux/alertsSlice";
import { SetUser, SetAllSongs } from "../redux/usersSlice";
import DefaultLayout from "./DefaultLayout";
import toast from "react-hot-toast";

function ProtectedRoute({ children }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => {
    return state.users;
  });
  const [readyToRender, setReadyToRender] = useState(false);
  const validateToken = async () => {
    try {
      dispatch(ShowLoading());
      const response = await axios.post(
        "/api/users/get-user-data",
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(HideLoading());
      if (response.data.success) {
        dispatch(SetUser(response.data.data));
      } else {
        toast.error(response.data.message);
        localStorage.removeItem("token");
        navigate("/login");
      }
      setReadyToRender(true);
    } catch (error) {
      dispatch(HideLoading());
      toast.error(error);
      console.log("error in home page = ", error);
      setReadyToRender(true);
      localStorage.removeItem("token");
      navigate("/login");
    }
  };
  useEffect(() => {
    if (localStorage.getItem("token")) {
      validateToken();
    } else {
      navigate("/login");
    }
  }, []);

  const getAllSongs = async () => {
    try {
      dispatch(ShowLoading());
      const response = await axios.post(
        "/api/songs/get-all-songs",
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.data.success) {
        dispatch(SetAllSongs(response.data.data));
        dispatch(HideLoading());
      } else {
        dispatch(HideLoading());
        toast.error(response.data.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      toast.error(error);
      console.log("error in protected route", error);
    }
  };
  useEffect(() => {
    getAllSongs();
  }, []);

  return (
    <div>{readyToRender && <DefaultLayout>{children}</DefaultLayout>}</div>
  );
}

export default ProtectedRoute;
