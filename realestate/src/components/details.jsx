import { useParams } from "react-router-dom";
import { Link, useLocation } from "react-router-dom";
import { Favorite } from "../assets/icons/icons";
import React, { useEffect, useState } from "react";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";

import "../index.css";
import "./details.css";
import "./property-card.css";
import Sidebar from "./sidebar";
import Arrow from "../assets/card-component/Arrow back.png";
import Main from "../assets/card-component/main-img.png";
import btn from "../assets/card-component/phone.png";
import bath from "../assets/card-component/bathroom.png";
import sofa from "../assets/card-component/sofa.png";
import bed from "../assets/card-component/bed-icon.png";
import size from "../assets/card-component/size.png";
import CommentThread from "./CommentThread";

const Details = () => {
  const { id } = useParams();

  const [property, setProperty] = useState({});
  const [isFavorite, setIsFavorite] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [loading, setloading] = useState(true);

  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  const user_id = localStorage.getItem("user_id");
  const location = useLocation();

  const from = location?.state?.from ?? "/home";

  // useEffect(() => {
  //   console.log("A");
  //   fetch(`http://localhost:3001/api/favorites/${user_id}`)
  //     .then((res) => res.json())
  //     .then((favs) =>
  //       setIsFavorite(
  //         favs.some((fav) => fav.property_id === property.property_id)
  //       )
  //     );
  // }, [property.property_id, user_id, handleFavorite]);

  useEffect(() => {
    const fetchData = async (id) => {
      try {
        const response = await fetch(
          `http://localhost:3001/api/properties/${id}/${user_id}`
        );
        const data = await response.json();
        setProperty(data);
        setIsFavorite(data.favorite);
        setIsFetching(true);
      } catch (error) {
        console.log(error);
      } finally {
        setloading(false);
      }
    };

    fetchData(id);
  }, [id, user_id]);

  //for comments useEffect
  useEffect(() => {
    if (!property.property_id) return;

    fetch(`http://localhost:3001/api/comments/${property.property_id}`)
      .then((res) => res.json())
      .then((data) => setComments(data));
  }, [property.property_id]);

  const handleFavorite = async () => {
    setIsFavorite(true);
    const res = await fetch("http://localhost:3001/api/favorites", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id, property_id: property.property_id }),
    });

    const data = await res.json();
    console.log(data);

    if (!data.status) {
      console.log(!data.status);
      setIsFavorite(false);
    }
  };
  //to handle comments async function
const handleAddComment = async (parent_id = null, content = null) => {
  const user_id = localStorage.getItem("user_id");
  const commentContent = content !== null ? content : newComment;
  if (!commentContent.trim()) return;

  await fetch("http://localhost:3001/api/comments", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      property_id: property.property_id,
      user_id,
      content: commentContent,
      parent_id,
    }),
  });

  setNewComment("");

  // Refresh comments after posting
  fetch(`http://localhost:3001/api/comments/${property.property_id}`)
    .then((res) => res.json())
    .then((data) => setComments(data));
};


  const nestComments = (comments) => {
    //nesting comments for replying to the already present comments
    const map = {};
    comments.forEach((c) => (map[c.comment_id] = { ...c, replies: [] }));
    comments.forEach((c) => {
      if (c.parent_id) map[c.parent_id]?.replies.push(map[c.comment_id]);
    });
    return comments.filter((c) => !c.parent_id).map((c) => map[c.comment_id]);
  };

  const nestedComments = nestComments(comments);



  const { longitude: locationLng, latitude: locationLat } = property;

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "AIzaSyBnYYbpWHGiQygel5ybHF0vDaZPyt7Yy3s", // Replace with your key
  });

  console.log(loading);
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-xl">
        Loading...
      </div>
    );
  }

  if (!property.property_id) {
    return <div>Not Found</div>;
  } else {
    return (
      <>
        <div className="flex">
          <Sidebar />
        </div>
        <div className="move-back pl-64 pt-4">
          <Link
            to={from == "/home" ? "/home" : "/favorites"}
            className="text-blue-500 hover:"
          >
            <img src={Arrow} alt="back arrow" /> Back to {from.slice(1)}
          </Link>
        </div>
        <div className="details-whole">
          <div className="details-container ml-64">
            <img
              src={
                property.image_urls?.[0]
                  ? `http://localhost:3001${property.image_urls[0]}`
                  : Main
              }
              alt="Property"
            />

            <h1 className="text-2xl font-bold ">{property.location}</h1>
            <h1 className="text-2xl">{property.price}</h1>
            <div className="property-info">
              <img src={size} alt="Size icon" className="imgg" />
              <p>{property.size_sqft}</p>
              <img src={bed} alt="Bed icon" className="imgg" />
              <p>{property.bedrooms}</p>
              <img src={sofa} alt="sofa icon" className="imgg" />
              <p>{property.kitchen}</p>
              <img src={bath} alt="Bath icon" className="imgg" />
              <p>{property.bathrooms} </p>

              <div
                className="faav flex items-center text-sm cursor-pointer"
                onClick={handleFavorite}
              >
                <Favorite isActive={isFavorite} />{" "}
                {isFavorite ? "Remove from favorites" : "Add to favorites"}
              </div>
            </div>
            <hr className="line" />
            <h1>Description</h1>
            <p className="description">{property.description}</p>
          </div>
          <div className="side-wallah">
            <div className="contact-info ml-64 bg-amber-50  w-48">
              <h1 className="mb-10 text-xl">Contact Info</h1>
              <p>Aarav Raj Shrestha</p>
              <a href="tel:9869664639" className="buttons shadow-lg">
                <img
                  src={btn}
                  alt="Call"
                  className="call-btn"
                  height={15}
                  width={15}
                />
                Call me
              </a>
            </div>
            <div className="map ml-5">
              {isLoaded && locationLat && locationLng && (
                <GoogleMap
                  mapContainerStyle={{ width: "100%", height: "200px" }}
                  center={{
                    lat: Number(locationLat),
                    lng: Number(locationLng),
                  }}
                  zoom={15}
                >
                  <Marker
                    position={{
                      lat: Number(locationLat),
                      lng: Number(locationLng),
                    }}
                  />
                </GoogleMap>
              )}
            </div>
          </div>
        </div>
        <div className="comments ml-64">
          <h1 className="text-2xl mb-4">Add a comment</h1>
          <input
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Join the conversation..."
            className="border p-2 w-full mb-2"
          />
          <button onClick={() => handleAddComment()} className="btn">
            Post
          </button>
          <hr className="line" />
          <div>
            {nestedComments.map((comment) => (
              <CommentThread
                key={comment.comment_id}
                comment={comment}
                handleAddComment={handleAddComment}
              />
            ))}
          </div>
        </div>
      </>
    );
  }
};

export default Details;
