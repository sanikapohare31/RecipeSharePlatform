import React from 'react'
import './SearchBar.css'
const SearchBar = () => {
  return (
    <div class="search-container">
        <div class="search-bar">
            <input type="text" placeholder="Search for recipes..."/>
            <button>Search</button>
        </div>
    </div>

  )
}

export default SearchBar
