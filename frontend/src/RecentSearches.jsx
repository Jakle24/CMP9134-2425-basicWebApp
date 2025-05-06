import React, { useEffect, useState } from 'react';

const RecentSearches = ({ onSearch }) => {
  const [recentSearches, setRecentSearches] = useState([]);

  useEffect(() => {
    fetch('/recent_searches', { credentials: 'include' })
      .then(res => res.json())
      .then(setRecentSearches)
      .catch(() => setRecentSearches([]));
  }, []);

  const handleClick = (term) => {
    onSearch(term);
  };

  const handleClear = () => {
    fetch('/recent_searches', {
      method: 'DELETE',
      credentials: 'include'
    }).then(() => setRecentSearches([]));
  };

  return (
    <div className="mt-4 p-3 bg-light rounded shadow">
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h5 className="mb-0">Recent Searches</h5>
        {recentSearches.length > 0 && (
          <button className="btn btn-sm btn-outline-danger" onClick={handleClear}>
            Clear All
          </button>
        )}
      </div>
      {recentSearches.length === 0 ? (
        <p className="text-muted mb-0">No recent searches.</p>
      ) : (
        <ul className="list-unstyled mb-0">
          {recentSearches.map((item) => (
            <li key={item.id}>
              <button
                className="btn btn-link btn-sm p-0"
                onClick={() => handleClick(item.query)}
              >
                {item.query}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default RecentSearches;
