const { app, BrowserWindow, ipcMain, globalShortcut } = require('electron');
const path = require('path');
const sqlite3 = require('sqlite3').verbose(); // For verbose logging in SQLite

// Use process.cwd() to get the current working directory (project root) and add the db to that area
const dbPath = path.join(process.cwd(), 'app.db');
console.log('Database path:', dbPath);

// Initialize the database
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    return console.error('Failed to connect to the database:', err.message);
  }
  console.log('Connected to the SQLite database.');
});

// Create tables asynchronously
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS components (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      tags TEXT,
      languages TEXT,
      code1 TEXT,
      code2 TEXT,
      code3 TEXT,
      isPinned INTEGER DEFAULT 0
    )
  `, (err) => {
    if (err) {
      console.error('Error creating components table:', err.message);
    }
  });

  db.run(`
    CREATE TABLE IF NOT EXISTS settings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      themeSet TEXT
    )
  `, (err) => {
    if (err) {
      console.error('Error creating settings table:', err.message);
    }
  });

  // Default theme setup
  db.run(`
    INSERT OR IGNORE INTO settings (id, themeSet) VALUES (1, 'light')
  `, (err) => {
    if (err) {
      console.error('Error inserting default theme:', err.message);
    }
  });
});

console.log('Database initialized and tables created.');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    titleBarStyle: 'hidden',
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
      contextIsolation: true, // Enable context isolation
      nodeIntegration: false, // Disable Node.js integration
      enableRemoteModule: false, // Disable remote module for better security
      webSecurity: true // Ensure web security is enable
    },
  });

  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
  mainWindow.webContents.openDevTools();

  // Register global shortcut for refreshing the window
  const ret = globalShortcut.register('CommandOrControl+R', () => {
    console.log('CommandOrControl+R is pressed: refreshing the window');
    mainWindow.reload();
  });
  if (!ret) {
    console.log('Global shortcut registration failed');
  }

  // IPC handler for reloading the window/application
  ipcMain.handle('reload-window', () => {
    mainWindow.reload();
  });
};

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// IPC handlers for window actions
//Minimise application
ipcMain.handle('minimize-window', (event) => {
  const window = BrowserWindow.fromWebContents(event.sender);
  window.minimize();
});
//Maximise application
ipcMain.handle('maximize-window', (event) => {
  const window = BrowserWindow.fromWebContents(event.sender);
  if (window.isMaximized()) {
    window.unmaximize();
  } else {
    window.maximize();
  }
});
// Close Application
ipcMain.handle('close-window', (event) => {
  const window = BrowserWindow.fromWebContents(event.sender);
  window.close();
});

// ----------------- Database Operations ----------------- //

// Insert component
ipcMain.handle('insert-component', async (event, component) => {
  const { name, tags, languages, code1, code2, code3 } = component;
  return new Promise((resolve, reject) => {
    const stmt = db.prepare(`
      INSERT INTO components (name, tags, languages, code1, code2, code3) 
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    stmt.run(name, JSON.stringify(tags), JSON.stringify(languages), code1, code2, code3, function (err) {
      if (err) {
        console.error('Error inserting component:', err.message);
        return reject(err);
      }
      resolve(this.lastID); // Return the last inserted row ID
    });
  });
});

// Get components
ipcMain.handle('get-components', async () => {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM components', (err, rows) => {
      if (err) {
        console.error('Error fetching components:', err.message);
        return reject(err);
      }
      const components = rows.map(component => ({
        ...component,
        tags: JSON.parse(component.tags),  // Parse JSON array
        languages: JSON.parse(component.languages)  // Parse JSON array
      }));
      resolve(components);
    });
  });
});

// Search components
ipcMain.handle('search-components', async (event, searchQuery) => {
  return new Promise((resolve, reject) => {
    const likeQuery = `%${searchQuery}%`;
    db.all(`
      SELECT * FROM components 
      WHERE name LIKE ? OR tags LIKE ? OR languages LIKE ?
    `, [likeQuery, likeQuery, likeQuery], (err, rows) => {
      if (err) {
        console.error('Error searching components:', err.message);
        return reject(err);
      }
      const components = rows.map(component => ({
        ...component,
        tags: JSON.parse(component.tags),  // Parse JSON array
        languages: JSON.parse(component.languages)  // Parse JSON array
      }));
      resolve(components);
    });
  });
});

// Delete component
ipcMain.handle('delete-component', async (event, componentId) => {
  return new Promise((resolve, reject) => {
    db.run('DELETE FROM components WHERE id = ?', [componentId], (err) => {
      if (err) {
        console.error('Error deleting component:', err.message);
        return reject(err);
      }
      resolve({ success: true });
    });
  });
});

// Update component
ipcMain.handle('update-component', async (event, updatedComponent) => {
  const { id, name, tags, languages, code1, code2, code3 } = updatedComponent;
  return new Promise((resolve, reject) => {
    const stmt = db.prepare(`
      UPDATE components
      SET name = ?, tags = ?, languages = ?, code1 = ?, code2 = ?, code3 = ?
      WHERE id = ?
    `);
    stmt.run(name, JSON.stringify(tags), JSON.stringify(languages), code1, code2, code3, id, (err) => {
      if (err) {
        console.error('Error updating component:', err.message);
        return reject(err);
      }
      resolve({ success: true });
    });
  });
});

// IPC handler to pin/unpin a component
ipcMain.handle('toggle-pin-component', async (event, componentId, isPinned) => {
  try {
    return new Promise((resolve, reject) => {
      const stmt = db.prepare('UPDATE components SET isPinned = ? WHERE id = ?');
      stmt.run(isPinned ? 1 : 0, componentId, function(err) {
        if (err) {
          console.error(`Error updating pin state for component ID ${componentId}:`, err.message);
          return reject(err);
        }
        console.log(`Component with ID ${componentId} pinned state updated to ${isPinned}`);
        resolve({ success: true });
      });
    });
  } catch (error) {
    console.error('Error updating pin state:', error);
    throw error;
  }
});



// ------------------- Search History ------------------- //

// Insert search history
ipcMain.handle('insert-search-history', async (event, searchQuery) => {
  return new Promise((resolve, reject) => {
    const checkStmt = db.prepare(`
      SELECT COUNT(*) AS count FROM search_history WHERE search_query = ?
    `);
    checkStmt.get(searchQuery, (err, row) => {
      if (err) {
        console.error('Error checking search query:', err.message);
        return reject(err);
      }
      if (row.count > 0) {
        console.log('Search query already exists. Not inserting.');
        return resolve({ success: false, message: 'Query already exists' });
      }

      // Insert the new search history entry
      const insertStmt = db.prepare(`INSERT INTO search_history (search_query) VALUES (?)`);
      insertStmt.run(searchQuery, function (err) {
        if (err) {
          console.error('Error inserting search history entry:', err.message);
          return reject(err);
        }

        // Check total number of entries and delete if necessary
        db.get('SELECT COUNT(*) AS count FROM search_history', (err, row) => {
          if (err) {
            console.error('Error counting search history:', err.message);
            return reject(err);
          }

          const max_history_entries = 5;
          if (row.count > max_history_entries) {
            const deleteStmt = db.prepare(`
              DELETE FROM search_history
              WHERE id IN (SELECT id FROM search_history ORDER BY timestamp ASC LIMIT ?)
            `);
            deleteStmt.run(row.count - max_history_entries, (err) => {
              if (err) {
                console.error('Error deleting oldest search history:', err.message);
              }
              resolve({ success: true, id: this.lastID });
            });
          } else {
            resolve({ success: true, id: this.lastID });
          }
        });
      });
    });
  });
});

// Get search history
ipcMain.handle('get-search-history', async () => {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM search_history ORDER BY timestamp DESC', (err, rows) => {
      if (err) {
        console.error('Error fetching search history:', err.message);
        return reject(err);
      }
      resolve(rows);
    });
  });
});

// ------------------- Theme Settings ------------------- //

// Get theme setting
ipcMain.handle('get-theme-setting', async () => {
  return new Promise((resolve, reject) => {
    db.get('SELECT themeSet FROM settings WHERE id = 1', (err, row) => {
      if (err) {
        console.error('Error fetching theme setting:', err.message);
        return reject(err);
      }
      resolve(row.themeSet);
    });
  });
});

// Set theme setting
ipcMain.handle('set-theme-setting', async (event, theme) => {
  return new Promise((resolve, reject) => {
    db.run('UPDATE settings SET themeSet = ? WHERE id = 1', [theme], (err) => {
      if (err) {
        console.error('Error updating theme setting:', err.message);
        return reject(err);
      }
      resolve({ success: true });
    });
  });
});
