import React, { useState } from 'react';
import RecentSearches from './RecentSearches';

const ImageSearch = () => {
  const [query, setQuery] = useState('');
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (searchTerm) => {
    setLoading(true);
    const q = searchTerm !== undefined ? searchTerm : query;
    try {
      const res = await fetch(`/search_images?q=${encodeURIComponent(q)}`);
      if (!res.ok) throw new Error('Failed to fetch images');
      const data = await res.json();
      setImages(data.results || []);
    } catch (e) {
      setImages([]);
    }
    setLoading(false);
  };

  return (
    <div className="container py-4">
      <h2>Search for images</h2>
      <div className="mb-3">
        <input
          type="text"
          placeholder="Search for images"
          value={query}
          onChange={e => setQuery(e.target.value)}
          className="form-control"
        />
        <button
          className="btn btn-cool mt-2"
          onClick={() => handleSearch()}
          disabled={loading}
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
      </div>
      <RecentSearches onSearch={handleSearch} />
      <div className="row mt-4">
        {images.length === 0 && !loading && (
          <p>No images to display</p>
        )}
        {images.map((img, idx) => (
          <div className="col-md-3 mb-3" key={idx}>
            <div className="card">
              <img src={img.thumbnail} alt={img.title} className="card-img-top" />
              <div className="card-body">
                <h5 className="card-title">{img.title}</h5>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageSearch;