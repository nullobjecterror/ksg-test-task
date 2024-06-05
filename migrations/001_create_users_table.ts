import { Client } from 'pg';
import { config } from 'dotenv';

config();

const client = new Client({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432', 10),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

async function createUsersTable() {
  try {
    await client.connect();
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        balance INTEGER NOT NULL CHECK (balance >= 0)
      );
    `);
    console.log('Users table created successfully');
  } catch (err) {
    console.error('Error creating users table', err);
  } finally {
    await client.end();
  }
}

createUsersTable();
