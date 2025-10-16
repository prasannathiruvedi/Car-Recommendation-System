const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
const ALLOWED_ORIGIN = process.env.FRONTEND_ORIGIN || '*';
app.use(cors({ origin: ALLOWED_ORIGIN }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// MySQL Connection Pool with retry
let pool;
async function initPoolWithRetry(retries = 5, delayMs = 2000) {
  const config = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'prasanna',
    password: process.env.DB_PASSWORD || '0462',
    database: process.env.DB_NAME || 'car_recommendation',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  };
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      pool = mysql.createPool(config);
      // simple test query
      await pool.query('SELECT 1');
      console.log('Connected to MySQL database');
      return;
    } catch (err) {
      console.error(`DB connect attempt ${attempt} failed:`, err.message);
      if (attempt === retries) throw err;
      await new Promise(r => setTimeout(r, delayMs));
    }
  }
}

async function ensureSchemaAndSeed() {
  // Create table if not exists
  const createTableSql = `
    CREATE TABLE IF NOT EXISTS cars (
      id INT AUTO_INCREMENT PRIMARY KEY,
      make VARCHAR(50) NOT NULL,
      model VARCHAR(100) NOT NULL,
      variant VARCHAR(200),
      price DECIMAL(10, 2) NOT NULL,
      fuel_type ENUM('Petrol', 'Diesel', 'Electric', 'Hybrid', 'CNG') NOT NULL,
      body_type ENUM('Hatchback', 'Sedan', 'SUV', 'MUV', 'Coupe', 'Convertible', 'Wagon') NOT NULL,
      transmission ENUM('Manual', 'Automatic', 'CVT') NOT NULL,
      engine_capacity VARCHAR(20),
      mileage DECIMAL(5, 2),
      seating_capacity INT,
      power VARCHAR(50),
      torque VARCHAR(50),
      boot_space VARCHAR(50),
      fuel_tank_capacity VARCHAR(50),
      features TEXT,
      image_url VARCHAR(255),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB;
  `;

  await pool.query(createTableSql);

  // Seed only if empty
  const [rows] = await pool.query('SELECT COUNT(*) as count FROM cars');
  if (rows[0].count > 0) return;

  const seedSql = `
    INSERT INTO cars (make, model, variant, price, fuel_type, body_type, transmission, engine_capacity, mileage, seating_capacity, power, torque, boot_space, fuel_tank_capacity, features, image_url) VALUES
    ('Maruti Suzuki','Swift','VXI',550000,'Petrol','Hatchback','Manual','1.2L',23.2,5,'82PS@6000rpm','113Nm@4200rpm','268 litres','37 litres','ABS, Airbags, Power Steering, Central Locking, Music System','https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=400'),
    ('Hyundai','Creta','SX',1200000,'Petrol','SUV','Manual','1.5L',17.4,5,'115PS@6300rpm','144Nm@4500rpm','433 litres','50 litres','ABS, Airbags, Power Steering, Central Locking, Music System, Alloy Wheels, Fog Lights, Rear Camera, Sunroof','https://images.unsplash.com/photo-1549317336-206569e8475c?w=400'),
    ('Tata','Nexon','XZ+',950000,'Petrol','SUV','Manual','1.2L Turbo',17.4,5,'120PS@5500rpm','170Nm@1750-4000rpm','350 litres','44 litres','ABS, Airbags, Power Steering, Central Locking, Music System, Alloy Wheels, Fog Lights, Rear Camera, Touchscreen','https://images.unsplash.com/photo-1549317336-206569e8475c?w=400'),
    ('Honda','City','VX',1100000,'Petrol','Sedan','Manual','1.5L',17.4,5,'121PS@6600rpm','145Nm@4300rpm','506 litres','40 litres','ABS, Airbags, Power Steering, Central Locking, Music System, Alloy Wheels, Fog Lights, Rear Camera, Sunroof, Leather Seats','https://images.unsplash.com/photo-1606152421802-db97b9c7a11b?w=400'),
    ('Toyota','Innova Crysta','GX',1800000,'Diesel','MUV','Manual','2.4L',15.1,7,'150PS@3400rpm','360Nm@1400-2800rpm','300 litres','65 litres','ABS, Airbags, Power Steering, Central Locking, Music System, Alloy Wheels, Fog Lights, Rear Camera, Third Row AC','https://images.unsplash.com/photo-1549317336-206569e8475c?w=400')
  `;
  await pool.query(seedSql);
  console.log('Seeded cars table with sample data');
}

// Initialize DB
(async () => {
  try {
    await initPoolWithRetry();
    await ensureSchemaAndSeed();
  } catch (e) {
    console.error('Fatal DB init error:', e);
    process.exit(1);
  }
})();

// API Routes

// Get all cars
app.get('/api/cars', async (req, res) => {
  try {
    const [results] = await pool.query('SELECT * FROM cars');
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: 'Database query failed' });
  }
});

// Get car recommendations based on user requirements
app.post('/api/recommendations', async (req, res) => {
  const { budget, fuelType, bodyType, transmission, brand, minYear } = req.body;
  
  let query = 'SELECT * FROM cars WHERE 1=1';
  const params = [];
  
  if (budget) {
    query += ' AND price <= ?';
    params.push(budget);
  }
  
  if (fuelType && fuelType !== 'any') {
    query += ' AND fuel_type = ?';
    params.push(fuelType);
  }
  
  if (bodyType && bodyType !== 'any') {
    query += ' AND body_type = ?';
    params.push(bodyType);
  }
  
  if (transmission && transmission !== 'any') {
    query += ' AND transmission = ?';
    params.push(transmission);
  }
  
  if (brand && brand !== 'any') {
    query += ' AND make = ?';
    params.push(brand);
  }
  
  if (minYear) {
    // Since we don't have year in our sample data, we'll skip this filter
    // query += ' AND year >= ?';
    // params.push(minYear);
  }
  
  query += ' ORDER BY price ASC';
  
  try {
    const [results] = await pool.query(query, params);
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: 'Database query failed' });
  }
});

// Get unique values for filters
app.get('/api/filters', async (req, res) => {
  const queries = {
    brands: 'SELECT DISTINCT make FROM cars WHERE make IS NOT NULL ORDER BY make',
    fuelTypes: 'SELECT DISTINCT fuel_type FROM cars WHERE fuel_type IS NOT NULL ORDER BY fuel_type',
    bodyTypes: 'SELECT DISTINCT body_type FROM cars WHERE body_type IS NOT NULL ORDER BY body_type',
    transmissions: 'SELECT DISTINCT transmission FROM cars WHERE transmission IS NOT NULL ORDER BY transmission'
  };
  
  try {
    const [brands] = await pool.query(queries.brands);
    const [fuelTypes] = await pool.query(queries.fuelTypes);
    const [bodyTypes] = await pool.query(queries.bodyTypes);
    const [transmissions] = await pool.query(queries.transmissions);
    res.json({
      brands: brands.map(r => r.make),
      fuelTypes: fuelTypes.map(r => r.fuel_type),
      bodyTypes: bodyTypes.map(r => r.body_type),
      transmissions: transmissions.map(r => r.transmission)
    });
  } catch (err) {
    res.status(500).json({ error: 'Database query failed' });
  }
});

// Serve the main page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
