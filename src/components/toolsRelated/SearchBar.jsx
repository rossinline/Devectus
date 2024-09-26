import React, { useState } from 'react';
import { SearchCode } from 'lucide-react';

export default function SearchBar({ onSearchResults }) {
  const [query, setQuery] = useState('');

  // Set input change
  const handleInputChange = (event) => {
    const newQuery = event.target.value;
    setQuery(newQuery);
  };

  // Search submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      // Search db
      const results = await window.electron.invoke('search-components', query);
      
      // If callback, pass search results to parent 
      if (onSearchResults) {
        onSearchResults(results);
      }

      // Store search query if it matches any tags
      if (results.some(result => result.tags.includes(query))) {
        await window.electron.invoke('insert-search-history', query);
        await window.electron.invoke('delete-old-search-history');
        
        console.log("awaiting");
      }

    } catch (error) {
      console.error('Error searching components:', error);
    }
  };

  return (
    <div className="max-w-md">
      {/* Title */}
      <h2 className="text-sm font-medium text-lm-text dark:text-dm-text mb-1">Search</h2>
      
      {/* Search Form */}
      <form
        className="flex mx-2 items-center rounded-default overflow-hidden bg-lm-foreground dark:bg-dm-foreground"
        onSubmit={handleSubmit}
      >
        <input
          type="text"
          placeholder="Search..."
          value={query}
          onChange={handleInputChange}
          className="flex-1 py-1 px-2 w-1/2 border-none bg-lm-foreground dark:bg-dm-foreground focus:outline-none focus:ring-2 focus:ring-lm-accent"
        />
        <button
          type="submit"
          className="group flex flex-col items-center justify-center bg-lm-foreground dark:bg-dm-foreground text-lm-text dark:text-dm-text hover:text-lm-accent dark:hover:text-dm-accent rounded-default p-2 space-y-1 cursor-pointer focus:outline-none focus:ring-2 focus:ring-lm-accent transition-all duration-100 ease-in-out"
        >
          <SearchCode size={20} />
        </button>
      </form>
    </div>
  );
}
