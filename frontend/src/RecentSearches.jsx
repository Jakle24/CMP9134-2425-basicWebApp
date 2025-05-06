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
    <div className="p-4 bg-gray-100 rounded-xl shadow-md mt-4">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-semibold">Recent Searches</h2>
        {recentSearches.length > 0 && (
          <button
            className="text-sm text-red-500 hover:underline"
            onClick={handleClear}
          >
            Clear All
          </button>
        )}
      </div>
      {recentSearches.length === 0 ? (
        <p className="text-gray-500 text-sm">No recent searches.</p>
      ) : (
        <ul className="space-y-1">
          {recentSearches.map((item) => (
            <li key={item.id}>
              <button
                className="text-blue-600 hover:underline text-sm"
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