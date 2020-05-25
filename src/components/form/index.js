import React, { useState, useEffect } from "react";
import "./style.css";

function SearchBooks({ searchUtil, numOfSuggestions, onSelect }) {
  const [query, setQuery] = useState("");
  const [selectedItem, setSelectedItem] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (query.length === 0 || selectedItem === query) {
      setSuggestions([]);
    } else {
      const suggestions = searchUtil(query, numOfSuggestions);
      setSuggestions(suggestions);
    }
  }, [query, searchUtil, numOfSuggestions, selectedItem]);

  const handleInputChange = (event) => {
    const { value } = event.target;

    setQuery(value);
  };

  const handleSelect = (title) => {
    setSelectedItem(title);
    setQuery(title);
    onSelect(suggestions.find((d) => d.title === title));
  };

  const handleKeyPress = (event) => {
    const { key } = event;

    console.log('key : ', key)
  };

  return (
    <div className="AutocompleteText" onKeyPress={handleKeyPress}>
      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        placeholder="Enter keywords to search for books..."
      />
      <span className="search-input"></span>
      <ul>
        {suggestions &&
          suggestions.map((suggestion) => (
            <li
              onClick={() => handleSelect(suggestion.title)}
              key={suggestion.title}
            >
              {suggestion.title}
            </li>
          ))}
      </ul>
    </div>
  );
}

export default SearchBooks;
