import express from 'express';
import sqlite3Init from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

// --- Setup paths and constants ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = process.env.PORT || 3000;

const DB_PATH = path.join(__dirname, 'bunion_doctors');
const TABLE_NAME = 'bunion_doctors';
const MAX_RESULTS = 100;

// --- SQLite helper setup ---
const sqlite3 = sqlite3Init.verbose();
let db;

// connection to database 
function connectDb() {
  return new Promise((resolve, reject) => {
    const connection = new sqlite3.Database(DB_PATH, sqlite3.OPEN_READONLY, err => {
      if (err) {
        console.error('SQLite Connection Error:', err.message);
        console.error(`Ensure the database file exists and is accessible at: ${DB_PATH}`);
        reject(err);
      } else {
        console.log('✅ Connected to SQLite database:', TABLE_NAME);
        resolve(connection);
      }
    });
  });
}

function query(sql, params = []) {
  return new Promise((resolve, reject) => {
    if (!db) {
      const err = new Error("Database not connected.");
      console.error(err.message);
      return reject(err);
    }
  

    db.all(sql, params, (err, rows) => {
      if (err) {
        console.error('SQLite Query Error:', err.message); // This will show the SQL error
        // Log details again if there's an error from the query
        console.error('Failed SQL:', sql);
        console.error('Failed SQL Params:', params);
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

// --- Express server ---
const app = express();

app.use(express.static(__dirname)); // Serves files from the directory where server.js is located

app.get('/api/search-doctors', async (req, res) => {
  const zip = req.query.location?.trim();
  if (!zip || !/^[0-9]{5}$/.test(zip)) {
    return res.status(400).json({ error: 'Invalid or missing ZIP code' });
  }

  try {
    if (!db) {
      console.log("Database not initialized, attempting to connect...");
      db = await connectDb();
    }

    //  SQL query 
    const sql = `
      SELECT
        first_name AS firstName,
        last_name AS lastName,
        organization AS organizationName,
        credentials,
        city,
        state,
        zip,
        lon,
        lat,
        complete_address AS address,
        phone
      FROM ${TABLE_NAME}
      WHERE SUBSTR(zip, 1, 5) = ?
      LIMIT ?
    `;

    const results = await query(sql, [zip, MAX_RESULTS]);

    console.log(`\n🔍 Results for ZIP ${zip} (Found: ${results.length}):`);
    results.forEach(r => {

      console.log(`• ${r.firstName || ''} ${r.lastName || ''} (${r.organizationName || 'No Org'}) - Addr: ${r.address || 'N/A'} - ZIP: ${r.zip} - Phone: ${r.phone || 'N/A'} [Lat: ${r.lat}, Lon: ${r.lon}]`);
    });

    res.json(results);
  } catch (err) {
    console.error('Error in /api/search-doctors route:', err.message);
    res.status(500).json({ error: 'Internal server error while fetching doctors.' });
  }
});

app.use((req, res) => {
  res.status(404).json({ error: `Endpoint not found: ${req.method} ${req.originalUrl}` });
});

// --- Boot ---
(async () => {
  try {
    db = await connectDb();
    app.listen(PORT, () => console.log(`🚀 Server running → http://localhost:${PORT}/finder.html`));
  } catch (e) {
    console.error('💀 Server startup failed:', e.message);
    console.error("Please ensure the SQLite database is correctly set up and the path in DB_PATH is accurate.");
    process.exit(1);
  }
})();

process.on('SIGINT', () => {
  console.log('\nSIGINT received. Closing SQLite database connection...');
  db?.close((err) => {
    if (err) {
      console.error('Error closing SQLite connection:', err.message);
      process.exit(1);
    }
    console.log('SQLite connection closed. Exiting.');
    process.exit(0);
  });
});