import bath from "../assets/card-component/bathroom.png";
import sofa from "../assets/card-component/sofa.png";
import bed from "../assets/card-component/bed-icon.png";
import size from "../assets/card-component/size.png";
import "./property-card.css";
import { Link, useLocation } from "react-router-dom";

const PropertyCard = ({
  img,
  location,
  latitude,
  longitude,
  price,
  size_sqft,
  bedrooms,
  kitchen,
  bathrooms,
  property_id,
}) => {
  const from = useLocation().pathname;
  return (
    <Link
      to={{
        pathname: `/details/${property_id}`,
      }}
      state={{
        img,
        location,
        price,
        size_sqft,
        longitude,
        latitude,
        bedrooms,
        kitchen,
        bathrooms,
        property_id,
        from, // Pass the current path to the details page
      }}
      className="no-underline"
    >
      <div className="property-card">
        <img src={img} alt="Property image" />
        <div className="property-details">
          <h2 className="property-title">{location}</h2>
          <b>
            <p className="property-price">{price}</p>
          </b>
          <div className="Details">
            <img src={size} alt="Size icon" className="imgg" />
            <p>{size_sqft}</p>
            <img src={bed} alt="Bed icon" className="imgg" />
            <p>{bedrooms}</p>
            <img src={sofa} alt="sofa icon" className="imgg" />
            <p>{kitchen}</p>
            <img src={bath} alt="Bath icon" className="imgg" />
            <p>{bathrooms} </p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PropertyCard;

