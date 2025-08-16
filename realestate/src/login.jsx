import googleImg from "./assets/gogle.png";
import guestImg from "./assets/guest.png";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import "./index.css";

export default function Login() {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;
      setRotate({ x: (y - 0.5) * 10, y: (0.5 - x) * 10 });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
      <div className="flex h-screen">
        {/* Animated Background Section */}
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className={`bg-[url('./assets/login-bg.gif')] bg-cover bg-center h-full w-2/3 rounded-r-[80px] shadow-2xl relative overflow-hidden`}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#2E5287]/80 to-[#48A530]/80 backdrop-blur-sm" />
          <motion.div
            animate={{
              scale: [1, 1.05, 1],
              rotate: [0, 1, -1, 0],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <h1 className="text-6xl font-bold text-white drop-shadow-lg">
              Find Your Dream Home
            </h1>
          </motion.div>
        </motion.div>

        {/* Login Form Section */}
        <div className="w-1/3 flex flex-col items-center justify-center p-8 relative">
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mb-12 text-center"
          >
            <h1 className="text-5xl font-extrabold bg-gradient-to-r from-[#2E5287] to-[#48A530] bg-clip-text text-transparent tracking-tight">
              RealEstate.com
            </h1>
            <p className="mt-2 text-gray-600">Your perfect home awaits</p>
          </motion.div>

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            style={{
              transform: `perspective(1000px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
            }}
            className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200 hover:shadow-2xl transition-all duration-300"
          >
            <div className="p-8">
              <motion.h2 
                className="text-3xl font-bold text-center text-gray-800 mb-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                Welcome Back
              </motion.h2>

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="mb-6"
              >
                <div
                  className={`flex items-center justify-center gap-3 px-6 py-3 rounded-lg border transition-all duration-300 cursor-pointer ${
                    isHovered
                      ? "bg-blue-50 border-blue-200 shadow-md"
                      : "bg-white border-gray-300"
                  }`}
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                >
                  <img src={googleImg} alt="google" className="h-6" />
                  <GoogleLogin
                    onSuccess={(credentialResponse) => {
                      localStorage.setItem(
                        "googleToken",
                        credentialResponse.credential
                      );

                      const decoded = jwtDecode(credentialResponse.credential);
                      localStorage.setItem("data", JSON.stringify(decoded));
                      navigate(`/home`);

                      fetch("http://localhost:3001/api/login", {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                          full_name: decoded.name,
                          email: decoded.email,
                          google_id: decoded.sub,
                          is_guest: false,
                        }),
                      })
                        .then((res) => res.json())
                        .then((data) =>
                          localStorage.setItem("user_id", data.user_id)
                        )
                        .catch((error) => console.error("Error:", error));
                    }}
                    onError={() => {
                      console.log("Login Failed");
                    }}
                    theme="filled_blue"
                    size="large"
                    text="continue_with"
                    shape="rectangular"
                    width="300"
                  />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="flex items-center my-6"
              >
                <div className="flex-1 h-px bg-gray-300"></div>
                <div className="flex-1 h-px bg-gray-300"></div>
              </motion.div>

              
            </div>

            <motion.div 
              className="bg-gray-50 px-8 py-4 text-center border-t border-gray-200"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1 }}
            >
              <p className="text-gray-600 text-sm">
                By continuing, you agree to our{" "}
                <a href="#" className="text-blue-600 hover:underline">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="text-blue-600 hover:underline">
                  Privacy Policy
                </a>
                .
              </p>
            </motion.div>
          </motion.div>

          {/* Floating decorative elements */}
          <motion.div
            animate={{
              y: [0, -15, 0],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute top-1/4 left-1/4 w-8 h-8 rounded-full bg-[#48A530]/20 blur-md"
          />
          <motion.div
            animate={{
              y: [0, 15, 0],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5,
            }}
            className="absolute bottom-1/3 right-1/4 w-10 h-10 rounded-full bg-[#2E5287]/20 blur-md"
          />
        </div>
      </div>
    </div>
  );
}