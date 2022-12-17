import React, { useState } from "react";

import { getFirestore, collection, getDocs } from "firebase/firestore";

const Search = () => {
  const [searchItem, setSearchItem] = useState("");

  const handleChange = (e) => {
    const { value } = e.target;
    setSearchItem(value);
    console.log(searchItem);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    console.log("searching");
  };

  return (
    <div>
      <input
        name="searchItem"
        type="text"
        placeholder="Search for books"
        onChange={handleChange}
      />
      <button onClick={handleSearch}>Login</button>
    </div>
  );
};

export default Search;
