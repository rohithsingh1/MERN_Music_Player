import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function DefaultLayout({ children }) {
  const { user } = useSelector((state) => {
    return state.users;
  });
  const navigate = useNavigate();
  const AdminHandler = () => {
    if (user?.isAdmin) {
      navigate("/admin");
    }
  };
  return (
    <div className="main">
      <div className="header flex justify-between p-2 shadow items-center">
        <h1
          className="text-xl ml-7 font-bold cursor-pointer"
          onClick={() => {
            navigate("/");
          }}
        >
          <b className="text-primary">MERN</b>{" "}
          <b className="text-secondary">MUSIC</b>
        </h1>
        <div className="flex items-center gap-2">
          <h1
            className={`text-clip cursor-pointer`}
            onClick={() => AdminHandler()}
          >
            {user?.name.toUpperCase()}
          </h1>
          <i
            className="ri-logout-circle-r-line text-clip cursor-pointer"
            onClick={() => {
              localStorage.removeItem("token");
              navigate("/login");
            }}
          ></i>
        </div>
      </div>
      <div className="content m-4">{children}</div>
    </div>
  );
}

export default DefaultLayout;
