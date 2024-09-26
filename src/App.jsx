import React, { useEffect } from 'react';
import 'devicon/devicon.min.css';
import Titlebar from './components/TitleBar.jsx';
import DashContainer from './components/DashContainer.jsx';
import AddCompPopup from './components/toolsrelated/addingComponents/AddCompPopup.jsx';

export default function App() {
    useEffect(() => {
        // Function to apply the saved theme on page load
        const applySavedTheme = async () => {
            let savedTheme = localStorage.getItem('theme');  // Check localStorage for saved theme
            if (!savedTheme) {
                // If no saved theme, fetch it from the database
                savedTheme = await window.electron.getTheme();  // Fetch theme from the database
                localStorage.setItem('theme', savedTheme);  // Save it to localStorage
            }
            document.body.classList.toggle('dark', savedTheme === 'dark');  // Apply the theme
        };

        applySavedTheme();
    }, []);

    return (
        <div className='bg-lm-background text-lm-text h-screen dark:bg-dm-background dark:text-dm-text transition-all duration-300 ease-in-out overflow-hidden'>
            <Titlebar />
            <DashContainer />
            <AddCompPopup />
        </div>
    );
}
