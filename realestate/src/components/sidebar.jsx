import React from "react";
import Logo from "../assets/logo.png";
import home from "../assets/sidebar/Home.png";
import star from "../assets/sidebar/Star border.png";
import Account from "../assets/sidebar/Group.png";
import sell from "../assets/sidebar/Shopify.png";
import "../index.css";
import { useLocation, Link } from "react-router-dom";

const Sidebar = () => {
  const pathname = useLocation().pathname;
  const logout = () => {
    alert("Want to logout?");
    localStorage.clear("googleToken");
  };

  return (
    <div className="flex w-64">
      <div className="sidebar fixed">
        <div className="logo">
          <img src={Logo} height="30px" width="36px" alt="logo" />
          <h6>RealEstate</h6>
        </div>
        <Link
          to={"/home"}
          className={"home" + (pathname === "/home" ? " activeNav" : "")}
        >
          <img src={home} alt="home logo" />
          Home
        </Link>

        <Link
          to={"/favorites"}
          className={"home" + (pathname === "/favorites" ? " activeNav" : "")}
        >
          <img src={star} alt="fav logo" />
          Favorites
        </Link>

        <Link
          to={"/sell"}
          className={"home" + (pathname === "/sell" ? " activeNav" : "")}
        >
          <img src={sell} alt="listing logo" />
          Sell property
        </Link>
        <Link
          onClick={logout}
          to={"/login"}
          className={"home" + (pathname === "/account:" ? " activeNav" : "")}
        >
          <img src={Account} alt="account logo" />
          Log out
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
