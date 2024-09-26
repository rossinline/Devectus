import React from 'react';
import languageToIconClassMap from '../IconMapping.jsx';

const ComponentBox = ({ id, name, tags, languages, onClick, isSelected }) => {
    //Check that language icon is avaiable
  const allIconsAvailable = languages.every(language => languageToIconClassMap[language.toLowerCase()]);

  // Limit tags to 3
  const displayedTags = tags.slice(0, 3);

  return (
    <div 
      className={`group flex items-center justify-between p-4 rounded-default shadow-lg cursor-pointer bg-lm-background dark:bg-dm-background hover:text-lm-accent ${isSelected ? 'border-2 border-lm-accent' : ''}`} 
      onClick={onClick}
    >
      {/* Left Side - File Name */}
      <div className="flex-shrink-0 w-3/12 text-sm font-medium truncate">
        {name}
      </div>

      {/* Center - Tags */}
      <div className="flex-grow flex justify-center space-x-2">
        {displayedTags.map((tag, index) => (
          <span key={index} className="text-xs bg-lm-foreground dark:bg-dm-foreground px-2 py-1 rounded-default">
            {tag}
          </span>
        ))}
      </div>

      {/* Right Side - Languages and Icons */}
      <div className="flex-shrink-0 w-3/12 flex items-center space-x-2 justify-end">
        {allIconsAvailable ? (
          languages.map((language, index) => {
            const iconClass = languageToIconClassMap[language.toLowerCase()];
            return iconClass ? (
              <i key={index} className={`${iconClass} devicon-plain text-lg text-lm-text dark:text-dm-text group-hover:text-lm-accent dark:group-hover:text-lm-accent`} title={language}></i>
            ) : null;
          })
        ) : (
          <span className="text-xs truncate">{languages.join(', ')}</span>
        )}
      </div>
    </div>
  );
};

export default ComponentBox;
