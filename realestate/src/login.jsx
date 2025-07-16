import googleImg from "./assets/gogle.png";
import guestImg from "./assets/guest.png";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

import "./index.css";
import { Navigate, useNavigate } from "react-router";

export default function Login() {
  const navigate = useNavigate();
  return (
    <div className="flex">
      <div
        className={`bg-[url('./assets/login-bg.gif')] bg-cover bg-center h-screen w-2/3  rounded-r-full`}
      ></div>
      <div className="w-[55%]">
        <h1 className="title bg-gradient-to-r from-[#2E5287] to-[#48A530] bg-clip-text text-transparent">
          RealEstate.com
        </h1>
        <div className="border max-w-[522px] mx-auto box">
          <h1 className="login">Login/Register</h1>

          <div className="btn">
            <img src={googleImg} alt="google" />
            <GoogleLogin
              onSuccess={(credentialResponse) => {
                localStorage.setItem(
                  "googleToken",
                  credentialResponse.credential
                );

                const decoded = jwtDecode(credentialResponse.credential);
                localStorage.setItem("data", JSON.stringify(decoded));
                navigate(`/home`);

                // Send data to PHP backend
                fetch("http://localhost:3001/api/login", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    full_name: decoded.name,
                    email: decoded.email,
                    google_id: decoded.sub, // This is the Google user ID
                    is_guest: false,
                  }),
                })
                  .then((res) => res.json())
                  .then((data) => localStorage.setItem("user_id", data.user_id))
                  .catch((error) => console.error("Error:", error));
              }}
              onError={() => {
                console.log("Login Failed");
              }}
            />
          </div>

          <div className="btn">
            <img src={guestImg} alt="Guest" />
            <button>Use as a guest</button>
          </div>
        </div>
      </div>
    </div>
  );
}
