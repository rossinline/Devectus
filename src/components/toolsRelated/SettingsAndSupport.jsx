import React from 'react';
import { Settings, CircleHelp, RefreshCw } from 'lucide-react';

const SettingsAndSupport = ({ onOpenSettings }) => {

    // Reload/Refresh button
    const refreshWindow = () => {
        window.electron.ipcRenderer.invoke('reload-window');
    };

    return (
        <div className="flex space-x-4 ml-2">
            <button
                className="group flex flex-col items-center justify-center bg-lm-foreground dark:bg-dm-foreground hover:outline hover:outline-lm-accent dark:hover:outline-dm-accent text-lm-text dark:text-dm-text rounded-default p-2 space-y-1 cursor-pointer focus:outline-none focus:ring-2 focus:ring-lm-accent transition-all duration-100 ease-in-out"
                onClick={onOpenSettings}
            >
                <Settings className="group-hover:animate-spinSlow" size={18}/>
            </button>
            <button
                className="group flex flex-col items-center justify-center bg-lm-foreground dark:bg-dm-foreground hover:outline hover:outline-lm-accent dark:hover:outline-dm-accent text-lm-text dark:text-dm-text rounded-default p-2 space-y-1 cursor-pointer focus:outline-none focus:ring-2 focus:ring-lm-accent transition-all duration-100 ease-in-out"
                onClick={refreshWindow}
            >
                <RefreshCw className="group-hover:animate-spinSlow" size={18}/>
            </button>
            <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col items-center justify-center bg-lm-foreground dark:bg-dm-foreground hover:outline hover:outline-lm-accent dark:hover:outline-dm-accent text-lm-text dark:text-dm-text rounded-default p-2 space-y-1 cursor-pointer focus:outline-none focus:ring-2 focus:ring-lm-accent transition-all duration-100 ease-in-out"
            >
                <CircleHelp className="group-hover:animate-wiggle" size={18}/>
            </a>
        </div>
    );
};

export default SettingsAndSupport;
