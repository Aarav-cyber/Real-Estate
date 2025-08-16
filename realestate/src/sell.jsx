import { useState } from "react";
import {
  GoogleMap,
  Marker,
  useLoadScript,
  Autocomplete,
} from "@react-google-maps/api";

import { useRef } from "react";

import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import "./index.css";
import Sidebar from "./components/sidebar";

const Sell = () => {
  const { handleSubmit, register } = useForm();
  const navigate = useNavigate();
  const autocompleteRef = useRef(null);
  const [images, setImages] = useState([]);
  const [location, setLocation] = useState({ lat: 27.7172, lng: 85.324 }); // Default: Kathmandu
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "AIzaSyBnYYbpWHGiQygel5ybHF0vDaZPyt7Yy3s", // Replace with a real key
    libraries: ["places"], // 👈 This is required for Autocomplete to work
  });

  const onSubmit = async (propertyData) => {
    const formData = new FormData();

    // Append form fields
    Object.entries(propertyData).forEach(([key, value]) => {
      formData.append(key, value);
    });

    // Append latitude and longitude
    formData.append("latitude", location.lat);
    formData.append("longitude", location.lng);

    // Append images
    images.forEach((img) => {
      formData.append("images", img);
    });
    console.log(formData.entries(), "this is form data");

    // Send request
    const response = await fetch("http://localhost:3001/api/sell", {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      alert("Property added successfully!");
      navigate("/home");
    } else {
      alert("Failed to add property.");
    }
  };

  return (
    <div className="flex">
      <Sidebar />

      <div className="pl-64 pt-4 main-content">
        <h2 className="mb-6 text-2xl font-bold">
          $ What do you want to SELL...
        </h2>
        <div className="form-box">
          <h3>Post Your Property</h3>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-group">
              <label>Property Title</label>
              <input
                type="text"
                {...register("title")}
                placeholder="Give a title..."
              />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea
                {...register("description")}
                placeholder="Description..."
              />
            </div>
            <div className="form-group">
              <label>Listing Type</label>
              <select {...register("status")}>
                <option>rent</option>
                <option>sale</option>
              </select>
            </div>
            <div className="form-group">
              <label>Price</label>
              <input
                {...register("price")}
                type="number"
                placeholder="Give a price..."
              />
            </div>

            <div className="form-group">
              <label>Bedrooms</label>
              <input {...register("bedrooms")} type="number" />
            </div>
            <div className="form-group">
              <label>Bathrooms</label>
              <input {...register("bathrooms")} type="number" />
            </div>
            <div className="form-group">
              <label>Kitchens</label>
              <input {...register("kitchen")} type="number" />
            </div>
            <div className="form-group">
              <label>Size (in sqft)</label>
              <input {...register("size_sqft")} type="number" />
            </div>
            <div className="form-group">
              <label>Location/Address</label>
              <input {...register("location")} type="text" />
            </div>
            {isLoaded && (
              <>
                <div className="form-group">
                  <label>Search Location</label>
                  <Autocomplete
                    onPlaceChanged={() => {
                      const place = autocompleteRef.current.getPlace();
                      if (place && place.geometry && place.geometry.location) {
                        setLocation({
                          lat: place.geometry.location.lat(),
                          lng: place.geometry.location.lng(),
                        });
                      }
                    }}
                    onLoad={(autocomplete) =>
                      (autocompleteRef.current = autocomplete)
                    }
                  >
                    <input
                      type="text"
                      placeholder="Search for a location"
                      className="w-full p-2 border rounded"
                    />
                  </Autocomplete>
                </div>
              </>
            )}
            <div className="form-group">
              <label>Property Location (click on map)</label>
              {isLoaded && (
                <GoogleMap
                  mapContainerStyle={{ width: "100%", height: "300px" }}
                  center={location}
                  zoom={14}
                  onClick={(e) => {
                    setLocation({
                      lat: e.latLng.lat(),
                      lng: e.latLng.lng(),
                    });
                  }}
                >
                  <Marker position={location} />
                </GoogleMap>
              )}
              <input
                type="text"
                value={`${location.lat}, ${location.lng}`}
                readOnly
                name="location"
              />
            </div>

            <div className="form-group">
              <label>Upload Images</label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => setImages([...e.target.files])}
              />
            </div>
            <div className="form-group">
              <label>Phone Number</label>
              <input {...register("phone")} type="tel" />
            </div>
            <button type="submit">Submit</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Sell;
