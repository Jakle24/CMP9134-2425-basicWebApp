import React, { useState } from 'react';
import RecentSearches from './RecentSearches';

const ImageSearch = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const searchImages = (term = query) => {
    if (!term.trim()) return;
    fetch(`/search?query=${encodeURIComponent(term)}`, {
      credentials: 'include',
    })
      .then((res) => res.json())
      .then(setResults)
      .catch((err) => {
        console.error(err);
        setResults([]);
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    searchImages();
  };

  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
      <div className="cool-card text-center w-100">
        <h1>Image Searcher</h1>
        <form onSubmit={handleSubmit} className="my-4 d-flex justify-content-center">
          <input
            type="text"
            className="form-control w-50 me-2"
            placeholder="Search images..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button className="btn btn-cool" type="submit">Search</button>
        </form>
        <RecentSearches onSearch={searchImages} />
        <div className="row mt-4">
          {results.map((img, idx) => (
            <div key={idx} className="col-md-4 mb-3">
              <div className="card bg-dark text-white">
                <img src={img.url} className="card-img-top" alt={img.title || "Search result"} style={{ height: "200px", objectFit: "cover" }} />
                <div className="card-body">
                  <h5 className="card-title">{img.title || 'Untitled'}</h5>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ImageSearch;
