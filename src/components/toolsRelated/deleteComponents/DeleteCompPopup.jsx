import React from 'react';
import { SquareX } from 'lucide-react';

export default function DeleteCompPopup({ isOpen, onClose, onConfirm }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-lm-background dark:bg-dm-background rounded-default shadow-lg max-w-sm">
          <div className="flex-shrink-0 flex items-center justify-between bg-lm-background dark:bg-dm-background rounded-default p-4 border-b border-lm-foreground dark:border-dm-foreground rounded-t-default">
          <h2 className="text-md font-semibold text-lm-text dark:text-dm-text">Confirm Deletion</h2>
          <button onClick={onClose} className="text-lm-text dark:text-dm-text hover:text-red-500 dark:hover:text-red-500">
            <SquareX />
          </button>
        </div>
        <div className='p-6'>
        <p className="mb-4">Are you sure you want to delete this component?</p>
        <p className="mb-4">This action CANNOT be undone.</p>
        <div className="flex justify-center gap-4">

          <button
            className="px-4 py-2 bg-red-700 text-dm-text rounded-default hover:outline hover:outline-lm-accent dark:hover:outline-dm-accent focus:outline-none focus:ring-2 focus:ring-lm-accent transition-all duration-100 ease-in-out"
            onClick={onConfirm}
          >
            Delete
          </button>
          <button
            className="px-4 py-2 bg-lm-foreground dark:bg-dm-foreground text-lm-text dark:text-dm-text rounded-default hover:outline hover:outline-lm-accent dark:hover:outline-dm-accent focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-100 ease-in-out"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
        </div>
      </div>
    </div>
  );
}
