const express = require('express');
const cors = require('cors');
const Database = require('better-sqlite3');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.static(__dirname));

// Initialize SQLite database file
const db = new Database('clan_database.sqlite');

// Create tables if they do not exist
db.exec(`
    CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        data TEXT NOT NULL
    )
`);

// API Routes
app.get('/api/users', (req, res) => {
    try {
        const rows = db.prepare('SELECT data FROM users').all();
        const users = rows.map(r => JSON.parse(r.data));
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/users', (req, res) => {
    try {
        const user = req.body;
        if (!user || !user.id) return res.status(400).json({ error: 'User ID required' });
        
        const stmt = db.prepare('INSERT OR REPLACE INTO users (id, data) VALUES (?, ?)');
        stmt.run(user.id, JSON.stringify(user));
        res.json({ success: true, user });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/users/:id', (req, res) => {
    try {
        const stmt = db.prepare('DELETE FROM users WHERE id = ?');
        stmt.run(req.params.id);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`Clan Server running at http://localhost:${PORT}`);
});
