// Tools.jsx
import React, { useState, useEffect } from 'react';
import { SquarePlus, Pencil, Trash2, Pin, PinOff } from 'lucide-react';
import ComponentAddForm from './addingComponents/AddCompForm.jsx';
import AddCompPopup from './addingComponents/AddCompPopup.jsx';
import EditCompForm from './editingComponents/EditCompForm.jsx';
import EditCompPopup from './editingComponents/EditCompPopup.jsx';
import DeleteCompPopup from './deleteComponents/DeleteCompPopup.jsx';  // Import the new component

const Tools = ({ selectedComponent }) => {
  const [isAddCompPopupOpen, setIsAddCompPopupOpen] = useState(false);
  const [isEditCompPopupOpen, setIsEditCompPopupOpen] = useState(false);
  const [isDeleteCompPopupOpen, setIsDeleteCompPopupOpen] = useState(false);  // State for Delete Popup
  const [isPinned, setIsPinned] = useState(false);

  useEffect(() => {
    if (selectedComponent) {
      setIsPinned(selectedComponent.isPinned);
    }
  }, [selectedComponent]);

  const openAddCompPopup = () => setIsAddCompPopupOpen(true);
  const closeAddCompPopup = () => setIsAddCompPopupOpen(false);

  const openEditCompPopup = () => setIsEditCompPopupOpen(true);
  const closeEditCompPopup = () => setIsEditCompPopupOpen(false);

  const openDeleteCompPopup = () => setIsDeleteCompPopupOpen(true);  // Open Delete Popup
  const closeDeleteCompPopup = () => setIsDeleteCompPopupOpen(false);  // Close Delete Popup

  const handlePinClick = async () => {
    if (selectedComponent) {
      const newPinStatus = !isPinned;
      setIsPinned(newPinStatus);
      await window.electron.invoke('toggle-pin-component', selectedComponent.id, newPinStatus);
    }
  };

  const handleDeleteClick = () => {
    if (selectedComponent) {
      openDeleteCompPopup();  // Trigger the delete confirmation popup
    }
  };

  const handleConfirmDelete = async () => {
    if (selectedComponent) {
      await window.electron.invoke('delete-component', selectedComponent.id);
      closeDeleteCompPopup();  // Close the confirmation popup
    }
  };

  const handleEditClick = () => {
    if (selectedComponent) {
      openEditCompPopup();
    }
  };

  const ToolsSetup = [
    { icon: <SquarePlus size={20} />, label: 'Add', onClick: openAddCompPopup },
    { icon: <Pencil size={20} />, label: 'Edit', onClick: handleEditClick },
    { icon: <Trash2 size={20} />, label: 'Delete', onClick: handleDeleteClick },
    { icon: isPinned ? <PinOff size={20} /> : <Pin size={20} />, label: 'Pin', onClick: handlePinClick },
  ];

  return (
    <div>
      <h2 className="text-sm font-medium text-lm-text dark:text-dm-text mb-1">Tools</h2>
      <div className="max-w-4xl mx-auto px-2">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
          {ToolsSetup.map((widget, index) => (
            <button
              key={index}
              className="group flex flex-col items-center justify-center bg-lm-foreground dark:bg-dm-foreground hover:outline hover:outline-lm-accent dark:hover:outline-dm-accent text-lm-text dark:text-dm-text dark:hover:text-dm-accent rounded-default px-6 py-2 space-y-1 cursor-pointer focus:outline-none focus:ring-2 focus:ring-lm-accent transition-all duration-100 ease-in-out"
              aria-label={widget.label}
              onClick={widget.onClick}
            >
              <div className="group-hover:animate-wiggle">{widget.icon}</div>
              <span className="text-xs font-medium hidden lg:block">{widget.label}</span>
            </button>
          ))}
        </div>
      </div>

      <AddCompPopup isOpen={isAddCompPopupOpen} onClose={closeAddCompPopup}>
        <ComponentAddForm />
      </AddCompPopup>

      <EditCompPopup isOpen={isEditCompPopupOpen} onClose={closeEditCompPopup}>
        <EditCompForm component={selectedComponent} onClose={closeEditCompPopup} />
      </EditCompPopup>

      <DeleteCompPopup
        isOpen={isDeleteCompPopupOpen}
        onClose={closeDeleteCompPopup}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default Tools;
