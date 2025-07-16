// import react from "react";
import "./search-component.css";
import search from "../assets/card-component/search 1.png";


const Search = ({ placeholder, value, onChange }) => {

  return (
    <>
      <div className="search-component">
        <form className="search-form" onSubmit={e => e.preventDefault()}>
  <input
    type="text"
    placeholder={placeholder}
    className="search-input"
    value={value}
    onChange={onChange}
  />
</form>

        <img src={search} alt="search icon" className="search-icon" />
      </div>
    </>
  );
};

export default Search;
