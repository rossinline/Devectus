import React from 'react';
import { Minus, Square, X } from 'lucide-react';

const CustomTitleBar = () => {
  // Minimize application
  const minimizeWindow = () => {
    window.electron.invoke('minimize-window');
  };
  // Maximize application
  const maximizeWindow = () => {
    window.electron.invoke('maximize-window');
  };
  // Close application
  const closeWindow = () => {
    window.electron.invoke('close-window');
  };

  return (
    <div
    className="title-bar flex justify-between items-center bg-lm-foreground dark:bg-dm-foreground"
    style={{ WebkitUserSelect: 'none', WebkitAppRegion: 'drag' }}
  >
    {/* Devectus Text on the left side */}
    <div className="title-bar-logo w-auto" style={{ WebkitAppRegion: 'drag' }}>
    <p className="p-1 text-xs font-semibold">Devectus</p>
    </div>
  
    {/* Buttons on the right side */}
    <div className="title-bar-buttons flex space-x-2" style={{ WebkitAppRegion: 'no-drag' }}>
      <button className="title-bar-button flex items-center justify-center w-8 h-6 p-1 bg-transparent hover:bg-lm-background dark:hover:bg-dm-background rounded-full" onClick={minimizeWindow}>
        <Minus size={16} className="text-lm-text dark:text-dm-text" />
      </button>
      <button className="title-bar-button flex items-center justify-center w-8 h-6 p-1 bg-transparent hover:bg-lm-background dark:hover:bg-dm-background rounded-full" onClick={maximizeWindow}>
        <Square size={11} className="text-lm-text dark:text-dm-text" />
      </button>
      <button className="title-bar-button flex items-center justify-center w-8 h-6 p-1 bg-transparent hover:bg-red-500 rounded-full" onClick={closeWindow}>
        <X size={16} className="text-lm-text dark:text-dm-text" />
      </button>
    </div>
  </div>
  
  );
};

export default CustomTitleBar;
