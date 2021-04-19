import React from "react";
import "./notsignedin.css";
import {  useMsal } from "@azure/msal-react";
import { loginRequest } from "../utils/authConfig";

function NotSignedIn() {
 const { instance } = useMsal()

  const handleLogin = () => {
    instance.loginPopup(loginRequest).catch(e => console.log(e))
  }

  return (
      <div className="not-signed-in-container">

          <button onClick={() => handleLogin()}>Log in</button>
      </div>
  );
}

export default NotSignedIn;
