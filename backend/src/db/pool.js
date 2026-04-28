const { Pool } = require('pg');
const { drizzle } = require('drizzle-orm/node-postgres');
const path = require('path');
const fs = require('fs');
const schema = require('./schema');

const rootDir = path.resolve(__dirname, '../../../');
const envPath = path.join(rootDir, '.env');
const exampleEnvPath = path.join(rootDir, '.env.example');

if (fs.existsSync(envPath)) {
  require('dotenv').config({ path: envPath });
} else if (fs.existsSync(exampleEnvPath)) {
  require('dotenv').config({ path: exampleEnvPath });
}

let connectionString = process.env.DATABASE_URL;

if (connectionString && !fs.existsSync('/.dockerenv')) {
  connectionString = connectionString.replace('@db:', '@localhost:');
}

if (!connectionString) {
  console.error('❌ FATAL: DATABASE_URL is not defined.');
  process.exit(1);
}

const pool = new Pool({
  connectionString: connectionString,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

const db = drizzle(pool, { schema });

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool,
  db,
};
