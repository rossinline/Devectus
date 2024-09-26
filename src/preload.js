// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

const { contextBridge, ipcRenderer } = require('electron');

// Rendering settings and application window setup
contextBridge.exposeInMainWorld('electron', {
    ipcRenderer: { invoke: (channel, data) => ipcRenderer.invoke(channel, data), },
    invoke: (channel, ...args) => ipcRenderer.invoke(channel, ...args),
    on: (channel, callback) => ipcRenderer.on(channel, (event, ...args) => callback(...args)),
    
    getTheme: () => ipcRenderer.invoke('get-theme-setting'),  
    setTheme: (theme) => ipcRenderer.invoke('set-theme-setting', theme), 

    getSettings: () => ipcRenderer.invoke('get-settings'),

    minimizeWindow: () => ipcRenderer.send('minimize-window'),
    maximizeWindow: () => ipcRenderer.send('maximize-window'),
    closeWindow: () => ipcRenderer.send('close-window'),
    refreshWindow: () => ipcRenderer.invoke('refresh-window'),
});

// Fetch and set the theme before the app renders
window.addEventListener('DOMContentLoaded', async () => {
    const theme = await ipcRenderer.invoke('get-theme-setting');  // Updated channel name
    if (theme === 'dark') {
        document.body.classList.add('dark');
    } else {
        document.body.classList.remove('dark');
    }
    document.body.style.visibility = 'visible'; // Show the body after setting the theme
});

console.log("!!! context bridge works !!!");
