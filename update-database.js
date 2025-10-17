const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function updateDatabase() {
  const config = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'prasanna',
    password: process.env.DB_PASSWORD || '0462',
    database: process.env.DB_NAME || 'car_recommendation',
    multipleStatements: true
  };

  try {
    console.log('Connecting to database...');
    const connection = await mysql.createConnection(config);
    
    console.log('Reading database.sql file...');
    const sqlFile = fs.readFileSync(path.join(__dirname, 'database.sql'), 'utf8');
    
    // Split the SQL file into individual statements and filter out problematic ones
    const statements = sqlFile
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.toLowerCase().startsWith('use '))
      .map(stmt => stmt + ';');
    
    console.log(`Found ${statements.length} SQL statements to execute...`);
    
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (statement.trim()) {
        console.log(`Executing statement ${i + 1}/${statements.length}...`);
        try {
          await connection.execute(statement);
        } catch (error) {
          console.warn(`Warning: Statement ${i + 1} failed:`, error.message);
          // Continue with other statements
        }
      }
    }
    
    console.log('Database updated successfully!');
    console.log('You can now restart your server with: npm start');
    
    await connection.end();
  } catch (error) {
    console.error('Error updating database:', error.message);
    process.exit(1);
  }
}

updateDatabase();
