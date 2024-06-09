import React, {MouseEvent} from "react";
import { useAuthContext } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import "./UserInfo.css"
import AdminPanel from "../adminTools/AdminPanel";

const UserInfo = () => {
  const auth = useAuthContext();

  const navigate = useNavigate();

  const logout = (e : MouseEvent) => {
    auth.logOut();
    navigate("/login");
  };

  return (
    <div className="container">
      <img src="/head.png" className="head"></img>
      <span>Logged in as: <b>{auth.authState.user}</b></span>
      <button onClick={e => {logout(e)}} className="logout">Logout</button>
      {(auth.authState.isAdmin) &&
        <AdminPanel/>  
      }
    </div>
  );
};

export default UserInfo;