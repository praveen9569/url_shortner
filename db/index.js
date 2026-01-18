import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';

const { Client } = pg;

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? {
    rejectUnauthorized: false
  } : false
});

// Connect with error handling
let isConnected = false;

const connectDB = async () => {
  try {
    await client.connect();
    console.log('✅ Database connected successfully');
    isConnected = true;
  } catch (error) {
    console.error('❌ Database connection error:', error);
    console.error('Check your DATABASE_URL in Railway variables');
    process.exit(1); // Exit if DB connection fails
  }
};

// Call connection
connectDB();

export const db = drizzle(client);
export default db;
