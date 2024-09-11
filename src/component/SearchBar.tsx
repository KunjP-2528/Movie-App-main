import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Style/SearchBar.css'; 

const SearchBar: React.FC = () => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = () => {
    if (query.trim()) {
      navigate(`/search?query=${query}`);
    }
  };

  return (
    <div className="search-bar">
      <input 
        type="text" 
        value={query} 
        onChange={(e) => setQuery(e.target.value)} 
        placeholder="Search movies..." 
      />
      <button className='search-button' onClick={handleSearch}>Search</button>
    </div>
  );
};

export default SearchBar;
