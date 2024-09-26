import React from 'react';
import ReactDOM from 'react-dom';
import { SquareX } from 'lucide-react';

const EditCompPopup = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-lm-background dark:bg-dm-background rounded-default shadow-lg w-2/3 h-4/5 relative flex flex-col">
        {/* Title Bar */}
        <div className="flex-shrink-0 flex items-center justify-between bg-lm-background dark:bg-dm-background rounded-default p-4 border-b border-lm-foreground dark:border-dm-foreground rounded-t-default">
          <h2 className="text-md font-semibold text-lm-text dark:text-dm-text">Edit Component</h2>
          <button onClick={onClose} className="text-lm-text dark:text-dm-text hover:text-red-500 dark:hover:text-red-500">
            <SquareX />
          </button>
        </div>
        {/* Scrollable Content Area */}
        <div className="p-4 overflow-y-auto overflow-x-hidden flex-grow scrollbar-thin  scrollbar-thumb-gray-400 scrollbar-track-lm-foreground dark:scrollbar-thumb-gray-500 dark:scrollbar-track-dm-foreground">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default EditCompPopup;
