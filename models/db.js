import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const db = await mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  dateStrings: ['DATE'],
});

const checkConnection = async () => {
  try {
    const connection = await db.getConnection();
    console.log('Database connection successful');
    connection.release();
  }
  catch (err) {
    console.error('Database connection failed:', err);
  }
}

export {db, checkConnection};
