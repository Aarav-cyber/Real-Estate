import  { useEffect, useState } from "react";
import PropertyCard from "./components/property-card";
import main from "./assets/card-component/main-img.png";
import Sidebar from "./components/sidebar";

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const user_id = localStorage.getItem("user_id");

  useEffect(() => {
    fetch(`http://localhost:3001/api/favorites/${user_id}`)
      .then((res) => res.json())
      .then((data) => setFavorites(data));
  }, [user_id]);

  return (
    <div className="flex">
      <Sidebar />

      <div className="pl-6 pt-4">
        <h1 className="title">Favorites</h1>

        <div className="  flex flex-wrap   gap-12 ">
          {favorites.map((item) => (
            <PropertyCard
              key={item.property_id}
              property_id={item.property_id}
              img={
                item.image_urls && item.image_urls[0]
                  ? `http://localhost:3001${item.image_urls[0]}`
                  : main
              }
              location={item.location}
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

export default Favorites;
