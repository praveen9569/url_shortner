import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? {
    rejectUnauthorized: false
  } : false
});

// Don't use top-level await - just export immediately
export const db = drizzle(pool);
export default db;

// Test connection asynchronously (non-blocking)
pool.connect()
  .then(client => {
    console.log('✅ Database connected');
    client.release();
  })
  .catch(err => {
    console.error('❌ Database connection failed:', err.message);
    console.error('DATABASE_URL:', process.env.DATABASE_URL ? 'exists' : 'MISSING');
  });
