// database.js
const { Pool } = require('pg');
require('dotenv').config(); // Loads the variables from your .env file

// Connect to Supabase using the environment variables
const pool = new Pool({
  host: process.env.PGHOST,
  port: process.env.PGPORT,
  database: process.env.PGDATABASE,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  ssl: { rejectUnauthorized: false } // Required by Supabase for secure connections
});

// Test the connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Failed to connect to the database:', err.stack);
  } else {
    console.log('Successfully connected to Supabase!');
  }
});

module.exports = pool;
