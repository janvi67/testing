import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import Sidebar from '../Sidebar';
import config from '../Login/config';
//import { FcSearch } from "react-icons/fc";

const DisplayCategory = () => {
  
  const [categoryEntries, setCategoryEntries] = useState([]);
  const [filteredEntries, setFilteredEntries] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useHistory();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(config.Api);
        const result = await response.json();
        const category = localStorage.getItem('selectedCategory');
        const entries = result.entries.filter(entry => entry.Category === category);
        setCategoryEntries(entries);
        setFilteredEntries(entries);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);
    const openLink = (link) => {
    window.open(link, '_blank');
  };


  // Handle secondary search query
  const handleSecondarySearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
    // Filter category entries based on the search query
    const filtered = categoryEntries.filter(entry =>
      entry.API.toLowerCase().includes(query)
    );
    setFilteredEntries(filtered);
  };

  const handleBack = () => {
    setTimeout(() => {
      navigate.push('/JsonData') 
    }, 1500);
  };

  return (
    <Sidebar>    
      <div>
      <button className='btn' onClick={handleBack}>Back</button>
      <h1 className='category'>Category : {localStorage.getItem('selectedCategory')}</h1>
      <div className='search-box2'>
      <input
        type="text"
        placeholder="Search Category API"
        value={searchQuery}
        onChange={handleSecondarySearch}
        className='search-input2'
      />
      {/* <div className="search-icon2">
        <span><FcSearch/></span> 
      </div> */}
      </div>
      <div className="category-entries">
      {filteredEntries.map((entry, index) => (
        <div key={index} className="entry-card">
          <h4>{entry.API}</h4>
          <h5>{entry.Description}</h5>
          <button onClick={() => openLink(entry.Link)}>View</button>
        </div>
      ))}
      </div>
    </div>
    </Sidebar>

  );
};


export default DisplayCategory;
