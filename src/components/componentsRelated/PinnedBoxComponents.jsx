import React from 'react';
import languageToIconClassMap from '../IconMapping.jsx'; // Import the icon mapping

const PinnedBoxComponents = ({ name, tags, languages, onClick, isSelected }) => {
  // Check that language icon is available
  const allIconsAvailable = languages.every(language => languageToIconClassMap[language.toLowerCase()]);

  // Limit tags to 3
  const displayedTags = tags.slice(0, 3);

  return (
    <div
      className={`relative w-full p-4 rounded-default shadow-lg cursor-pointer ${
        isSelected ? 'border-2 border-lm-accent' : 'bg-lm-background dark:bg-dm-background'
      } hover:text-lm-accent bg-lm-background dark:bg-dm-background`}
      onClick={onClick}
    >
      <div className="absolute top-3 right-3 w-auto h-12 rounded-default overflow-hidden">
        {allIconsAvailable ? (
          // Display mapped Icon
          languages.map((language, index) => {
            const iconClass = languageToIconClassMap[language.toLowerCase()];
            return iconClass ? (
              <i key={index} className={`${iconClass} devicon-plain text-md px-1 text-lm-text dark:text-dm-text group-hover:text-lm-accent dark:group-hover:text-lm-accent`} name={language}></i>
            ) : null;
          })
        ) : (
          // Else just state language text
          <span className="text-xs truncate">{languages.join(', ')}</span>
        )}
      </div>
      
      <h3 className="text-md font-semibold mb-2">{name}</h3>
      
      <div className="flex flex-wrap gap-2">
        {displayedTags.map((tag, index) => (
          // Display tags for component
          <span key={index} className="text-xs bg-lm-foreground dark:bg-dm-foreground px-2 py-1 rounded-default">
            {tag}
          </span>
        ))}
      </div>

      <div className="flex-shrink-0 w-full flex items-center space-x-2 justify-end mt-2">
      </div>
    </div>
  );
};

export default PinnedBoxComponents;
