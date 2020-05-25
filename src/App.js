import React, { useState } from "react";
import "./App.css";
import SearchBooks from "./components/form";
import searchUtil from "./searchEngine/index";
import BookList from "./components/list";

function App() {
  const [selectedBook, setSelectedBook] = useState("");
  const [booksList, setBooksList] = useState([]);

  const handleSubmit = () => {
    if (booksList.find((d) => d.title === selectedBook.title) === undefined) {
      setBooksList(booksList.concat(selectedBook));
    }
  };

  return (
    <div className="app-container">
      <div className="form-container">
        <div className="search-box">
          <SearchBooks
            searchUtil={searchUtil}
            numOfSuggestions={3}
            onSelect={setSelectedBook}
          />
        </div>
        <div className="submit-container">
          <button onClick={handleSubmit}>Submit</button>
        </div>
      </div>
      <div className="list-container">
        <BookList data={booksList} />
      </div>
    </div>
  );
}

export default App;
