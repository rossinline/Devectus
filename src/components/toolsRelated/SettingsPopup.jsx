import React, { useEffect, useState } from 'react';
import { SquareX, Sun, Moon } from 'lucide-react';

const SettingsPopup = ({ onClose }) => {
    const [dark, setDark] = useState(false);

    // Get theme user has selected
    useEffect(() => {
        const savedTheme = localStorage.getItem('theme') || 'light';
        setDark(savedTheme === 'dark');
        document.body.classList.toggle('dark', savedTheme === 'dark');
    }, []);

    // Set dark mode
    const setDarkMode = async () => {
        try {
            setDark(true);
            document.body.classList.add('dark');
            localStorage.setItem('theme', 'dark');
            await window.electron.setTheme('dark'); // Update theme in main process
        } catch (error) {
            console.error('Error setting dark theme:', error);
        }
    };

    // Set light mode
    const setLightMode = async () => {
        try {
            setDark(false);
            document.body.classList.remove('dark');
            localStorage.setItem('theme', 'light');
            await window.electron.setTheme('light'); // Update theme in main process
        } catch (error) {
            console.error('Error setting light theme:', error);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-lm-background dark:bg-dm-background rounded-default shadow-lg w-2/3 h-4/5 relative flex flex-col">
                {/* Title Bar */}
                <div className="flex-shrink-0 flex items-center justify-between bg-lm-background rounded-default p-4 border-b border-lm-foreground rounded-t-default dark:bg-dm-background dark:border-dm-foreground">
                    <h2 className="text-md font-semibold text-lm-text dark:text-dm-text">Settings</h2>
                    <button onClick={onClose} className="text-lm-text hover:text-red-500 dark:text-dm-text dark:hover:text-red-500">
                        <SquareX />
                    </button>
                </div>
                <div className="p-4 overflow-y-auto overflow-x-hidden flex-grow">
                    {/* Settings Content */}
                    <h2 className="mb-4 text-sm text-lm-text dark:text-dm-text">Choose App Theme -</h2>
                    <div className="flex space-x-4">
                        <button 
                            onClick={setDarkMode} 
                            className={`group flex flex-col items-center justify-center bg-lm-foreground dark:bg-dm-foreground text-lm-text dark:text-dm-text hover:text-lm-accent dark:hover:text-dm-accent rounded-default p-2 space-y-1 cursor-pointer focus:outline-none focus:ring-2 focus:ring-lm-accent transition-all duration-100 ease-in-out ${dark ? 'outline outline-lm-accent' : ''}`}
                        >
                            <Moon size={24} />
                            <span>Dark Mode</span>
                        </button>
                        <button 
                            onClick={setLightMode} 
                            className={`group flex flex-col items-center justify-center bg-lm-foreground dark:bg-dm-foreground text-lm-text dark:text-dm-text hover:text-lm-accent dark:hover:text-dm-accent rounded-default p-2 space-y-1 cursor-pointer focus:outline-none focus:ring-2 focus:ring-lm-accent transition-all duration-100 ease-in-out ${!dark ? 'outline outline-lm-accent' : ''}`}
                        >
                            <Sun size={24} />
                            <span>Light Mode</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsPopup;
