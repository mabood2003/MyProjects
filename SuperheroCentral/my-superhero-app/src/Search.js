import React, { useState } from 'react';

const Search = ({ onSearch }) => {
  //initialize the use state
  const [searchParams, setSearchParams] = useState({
    name: '',
    race: '',
    power: '',
    publisher: '',
    n: '',
  });

  const handleInputChange = (e) => { //handle change in the form
    const { name, value } = e.target;
    setSearchParams((prevParams) => ({ ...prevParams, [name]: value }));
  };

  const handleSearch = () => { //function for when search button is clicked
    onSearch(searchParams);
  };

  return (
    <div>
      <label>Name:</label>
      <input type="text" name="name" value={searchParams.name} onChange={handleInputChange} />

      <label>Race:</label>
      <input type="text" name="race" value={searchParams.race} onChange={handleInputChange} />

      <label>Power:</label>
      <input type="text" name="power" value={searchParams.power} onChange={handleInputChange} />

      <label>Publisher:</label> 
      <input type="text" name="publisher" value={searchParams.publisher} onChange={handleInputChange} />

      <label>Number of Results:</label>
      <input type="text" name="n" value={searchParams.n} onChange={handleInputChange} />

      <button onClick={handleSearch}>Search</button>
    </div>
  );
};

export default Search;