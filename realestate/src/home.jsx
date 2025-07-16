import React, { useEffect, useState } from "react";
import Logo from "./assets/logo.png";
import Account from "./assets/sidebar/Group.png";
import PropertyCard from "./components/property-card";
import main from "./assets/card-component/main-img.png";
import Search from "./components/search-component";
// import search from "./assets/card-component/search 1.png";
import filter from "./assets/card-component/filter.png";
import Sidebar from "./components/sidebar";

const Home = () => {
  const [properties, setProperties] = useState([]);
  const [search, setSearch] = useState(""); // Added to manage search input value

  useEffect(() => {
    fetch("http://localhost:3001/api/properties")
      .then((res) => res.json())
      .then((data) => setProperties(data))
      .catch((err) => console.error("Failed to fetch properties:", err));
  }, []);

  const filteredProperties = properties.filter((item) => {
    const query = search.toLowerCase();
    return (
      item.location?.toLowerCase().includes(query) ||
      item.price?.toString().includes(query) ||
      item.size_sqft?.toString().includes(query) ||
      item.bedrooms?.toString().includes(query) ||
      item.kitchen?.toString().includes(query) ||
      item.bathrooms?.toString().includes(query)
    );
  });

  return (
    <div className="flex">
      <Sidebar />

      <div className=" pt-4 w-[calc(100%-256px)] px-16">
        <div className="sticky top-5 ">
          <div className="mb-5  flex justify-between items-center">
            <Search
              icon={search}
              placeholder={"Search property with city, address, zip ..."}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <Search icon={search} placeholder={"Search with location"} />
            <img src={filter} alt="filter icon" className="" />
          </div>
        </div>
        <div className=" flex flex-wrap   gap-12 ">
          {filteredProperties.map((item) => (
            <PropertyCard
              key={item.property_id} //key is necessary for using map
              img={
                item.image_urls && item.image_urls[0]
                  ? `http://localhost:3001${item.image_urls[0]}`
                  : main
              }
              property_id={item.property_id}
              location={item.location}
              latitude={item.latitude}
              longitude={item.longitude}
              price={item.price}
              size_sqft={item.size_sqft}
              kitchen={item.kitchen}
              bedrooms={item.bedrooms}
              bathrooms={item.bathrooms}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
