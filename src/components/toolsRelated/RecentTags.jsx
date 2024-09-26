import React, { useEffect, useState } from 'react';

export default function RecentTags({ onTagClick }) {
  const [tags, setTags] = useState([]);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        // Fetch all components
        const tagObjects = await window.electron.invoke('get-search-history');
        console.log("FETCH GOT IT", tagObjects);

        // Extract unique tags (search_query)
        const uniqueTags = tagObjects.map(tag => tag.search_query);

        // Truncate the list
        setTags(uniqueTags.slice(0, 5));
        console.log("Setting", uniqueTags);
      } catch (error) {
        console.log('no recent tags, no searches made', error);
      }
    };

    fetchTags();
  }, []);

  return (
    <div className="max-w-md">
      {/* Title */}
      <h2 className="text-sm font-medium text-lm-text dark:text-dm-text mb-1">Recent Tags</h2>

      {/* Tag Container */}
      <div className="flex flex-wrap gap-2">
        {tags.map((tag, index) => (
          <span
            key={index}
            onClick={() => onTagClick(tag)}
            className="px-3 py-1 text-xs font-medium bg-lm-foreground dark:bg-dm-foreground hover:outline hover:outline-lm-accent dark:hover:outline-dm-accent text-lm-text dark:text-dm-text rounded-default space-y-1 cursor-pointer focus:outline-none focus:ring-2 focus:ring-lm-accent transition-all duration-100 ease-in-out"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}
