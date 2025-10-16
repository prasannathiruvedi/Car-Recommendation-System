-- Create database
CREATE DATABASE IF NOT EXISTS car_recommendation;
USE car_recommendation;

-- Drop existing table if it exists
DROP TABLE IF EXISTS cars;

-- Create cars table with essential fields
CREATE TABLE cars (
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
);

-- Insert sample car data
INSERT INTO cars (make, model, variant, price, fuel_type, body_type, transmission, engine_capacity, mileage, seating_capacity, power, torque, boot_space, fuel_tank_capacity, features, image_url) VALUES
('Maruti Suzuki', 'Swift', 'VXI', 550000, 'Petrol', 'Hatchback', 'Manual', '1.2L', 23.2, 5, '82PS@6000rpm', '113Nm@4200rpm', '268 litres', '37 litres', 'ABS, Airbags, Power Steering, Central Locking, Music System', 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=400'),
('Maruti Suzuki', 'Swift', 'ZXI', 650000, 'Petrol', 'Hatchback', 'Manual', '1.2L', 23.2, 5, '82PS@6000rpm', '113Nm@4200rpm', '268 litres', '37 litres', 'ABS, Airbags, Power Steering, Central Locking, Music System, Alloy Wheels, Fog Lights', 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=400'),
('Hyundai', 'i20', 'Sportz', 750000, 'Petrol', 'Hatchback', 'Manual', '1.2L', 20.35, 5, '83PS@6000rpm', '115Nm@4000rpm', '295 litres', '45 litres', 'ABS, Airbags, Power Steering, Central Locking, Music System, Alloy Wheels, Fog Lights, Rear Camera', 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=400'),
('Hyundai', 'Creta', 'SX', 1200000, 'Petrol', 'SUV', 'Manual', '1.5L', 17.4, 5, '115PS@6300rpm', '144Nm@4500rpm', '433 litres', '50 litres', 'ABS, Airbags, Power Steering, Central Locking, Music System, Alloy Wheels, Fog Lights, Rear Camera, Sunroof', 'https://images.unsplash.com/photo-1549317336-206569e8475c?w=400'),
('Hyundai', 'Creta', 'SX Automatic', 1350000, 'Petrol', 'SUV', 'Automatic', '1.5L', 16.8, 5, '115PS@6300rpm', '144Nm@4500rpm', '433 litres', '50 litres', 'ABS, Airbags, Power Steering, Central Locking, Music System, Alloy Wheels, Fog Lights, Rear Camera, Sunroof, Automatic Transmission', 'https://images.unsplash.com/photo-1549317336-206569e8475c?w=400'),
('Tata', 'Nexon', 'XZ+', 950000, 'Petrol', 'SUV', 'Manual', '1.2L Turbo', 17.4, 5, '120PS@5500rpm', '170Nm@1750-4000rpm', '350 litres', '44 litres', 'ABS, Airbags, Power Steering, Central Locking, Music System, Alloy Wheels, Fog Lights, Rear Camera, Touchscreen', 'https://images.unsplash.com/photo-1549317336-206569e8475c?w=400'),
('Tata', 'Nexon', 'XZ+ Automatic', 1100000, 'Petrol', 'SUV', 'Automatic', '1.2L Turbo', 16.5, 5, '120PS@5500rpm', '170Nm@1750-4000rpm', '350 litres', '44 litres', 'ABS, Airbags, Power Steering, Central Locking, Music System, Alloy Wheels, Fog Lights, Rear Camera, Touchscreen, Automatic Transmission', 'https://images.unsplash.com/photo-1549317336-206569e8475c?w=400'),
('Honda', 'City', 'VX', 1100000, 'Petrol', 'Sedan', 'Manual', '1.5L', 17.4, 5, '121PS@6600rpm', '145Nm@4300rpm', '506 litres', '40 litres', 'ABS, Airbags, Power Steering, Central Locking, Music System, Alloy Wheels, Fog Lights, Rear Camera, Sunroof, Leather Seats', 'https://images.unsplash.com/photo-1606152421802-db97b9c7a11b?w=400'),
('Honda', 'City', 'VX Automatic', 1250000, 'Petrol', 'Sedan', 'Automatic', '1.5L', 16.8, 5, '121PS@6600rpm', '145Nm@4300rpm', '506 litres', '40 litres', 'ABS, Airbags, Power Steering, Central Locking, Music System, Alloy Wheels, Fog Lights, Rear Camera, Sunroof, Leather Seats, Automatic Transmission', 'https://images.unsplash.com/photo-1606152421802-db97b9c7a11b?w=400'),
('Toyota', 'Innova Crysta', 'GX', 1800000, 'Diesel', 'MUV', 'Manual', '2.4L', 15.1, 7, '150PS@3400rpm', '360Nm@1400-2800rpm', '300 litres', '65 litres', 'ABS, Airbags, Power Steering, Central Locking, Music System, Alloy Wheels, Fog Lights, Rear Camera, Third Row AC', 'https://images.unsplash.com/photo-1549317336-206569e8475c?w=400'),
('Toyota', 'Innova Crysta', 'GX Automatic', 1950000, 'Diesel', 'MUV', 'Automatic', '2.4L', 14.5, 7, '150PS@3400rpm', '360Nm@1400-2800rpm', '300 litres', '65 litres', 'ABS, Airbags, Power Steering, Central Locking, Music System, Alloy Wheels, Fog Lights, Rear Camera, Third Row AC, Automatic Transmission', 'https://images.unsplash.com/photo-1549317336-206569e8475c?w=400'),
('Mahindra', 'XUV700', 'AX7', 1500000, 'Petrol', 'SUV', 'Manual', '2.0L Turbo', 15.0, 7, '200PS@5000rpm', '380Nm@1750-3000rpm', '262 litres', '60 litres', 'ABS, Airbags, Power Steering, Central Locking, Music System, Alloy Wheels, Fog Lights, Rear Camera, Sunroof, Touchscreen, Third Row AC', 'https://images.unsplash.com/photo-1549317336-206569e8475c?w=400'),
('Mahindra', 'XUV700', 'AX7 Automatic', 1650000, 'Petrol', 'SUV', 'Automatic', '2.0L Turbo', 14.5, 7, '200PS@5000rpm', '380Nm@1750-3000rpm', '262 litres', '60 litres', 'ABS, Airbags, Power Steering, Central Locking, Music System, Alloy Wheels, Fog Lights, Rear Camera, Sunroof, Touchscreen, Third Row AC, Automatic Transmission', 'https://images.unsplash.com/photo-1549317336-206569e8475c?w=400'),
('Kia', 'Seltos', 'HTX', 1300000, 'Petrol', 'SUV', 'Manual', '1.5L', 16.5, 5, '115PS@6300rpm', '144Nm@4500rpm', '433 litres', '50 litres', 'ABS, Airbags, Power Steering, Central Locking, Music System, Alloy Wheels, Fog Lights, Rear Camera, Sunroof, Touchscreen', 'https://images.unsplash.com/photo-1549317336-206569e8475c?w=400'),
('Kia', 'Seltos', 'HTX Automatic', 1450000, 'Petrol', 'SUV', 'Automatic', '1.5L', 16.0, 5, '115PS@6300rpm', '144Nm@4500rpm', '433 litres', '50 litres', 'ABS, Airbags, Power Steering, Central Locking, Music System, Alloy Wheels, Fog Lights, Rear Camera, Sunroof, Touchscreen, Automatic Transmission', 'https://images.unsplash.com/photo-1549317336-206569e8475c?w=400'),
('Volkswagen', 'Polo', 'Highline', 850000, 'Petrol', 'Hatchback', 'Manual', '1.0L Turbo', 18.24, 5, '110PS@5000rpm', '175Nm@1750-4000rpm', '280 litres', '45 litres', 'ABS, Airbags, Power Steering, Central Locking, Music System, Alloy Wheels, Fog Lights, Rear Camera, Touchscreen', 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=400'),
('Skoda', 'Rapid', 'Ambition', 950000, 'Petrol', 'Sedan', 'Manual', '1.0L Turbo', 18.24, 5, '110PS@5000rpm', '175Nm@1750-4000rpm', '460 litres', '50 litres', 'ABS, Airbags, Power Steering, Central Locking, Music System, Alloy Wheels, Fog Lights, Rear Camera, Touchscreen, Climate Control', 'https://images.unsplash.com/photo-1606152421802-db97b9c7a11b?w=400'),
('Nissan', 'Magnite', 'XV Premium', 750000, 'Petrol', 'SUV', 'Manual', '1.0L', 20.35, 5, '72PS@6250rpm', '96Nm@3500rpm', '336 litres', '40 litres', 'ABS, Airbags, Power Steering, Central Locking, Music System, Alloy Wheels, Fog Lights, Rear Camera, Touchscreen', 'https://images.unsplash.com/photo-1549317336-206569e8475c?w=400'),
('Renault', 'Kiger', 'RXZ', 700000, 'Petrol', 'SUV', 'Manual', '1.0L', 20.5, 5, '72PS@6250rpm', '96Nm@3500rpm', '405 litres', '40 litres', 'ABS, Airbags, Power Steering, Central Locking, Music System, Alloy Wheels, Fog Lights, Rear Camera, Touchscreen', 'https://images.unsplash.com/photo-1549317336-206569e8475c?w=400'),
('MG', 'Hector', 'Sharp', 1600000, 'Petrol', 'SUV', 'Manual', '1.5L Turbo', 14.0, 5, '143PS@5000rpm', '250Nm@1600-3600rpm', '587 litres', '60 litres', 'ABS, Airbags, Power Steering, Central Locking, Music System, Alloy Wheels, Fog Lights, Rear Camera, Sunroof, Touchscreen, Third Row AC, Premium Audio', 'https://images.unsplash.com/photo-1549317336-206569e8475c?w=400');

INSERT INTO cars (make, model, variant, price, fuel_type, body_type, transmission, engine_capacity, mileage, seating_capacity, power, torque, boot_space, fuel_tank_capacity, features, image_url) VALUES
('Maruti Suzuki', 'Baleno', 'Alpha', 599000, 'Petrol', 'Hatchback', 'Manual', '1.2L', 22.0, 5, '90PS@6000rpm', '113Nm@4200rpm', '339 litres', '37 litres', 'ABS, Airbags, Push Start, SmartPlay Studio, Rear Camera, Alloy Wheels', ''),
('Maruti Suzuki', 'Dzire', 'VXi', 717000, 'Petrol', 'Sedan', 'Manual', '1.2L', 24.79, 5, '80PS@6000rpm', '113Nm@4200rpm', '378 litres', '37 litres', 'ABS, Airbags, Power Steering, Central Locking, Music System', ''),
('Maruti Suzuki', 'Brezza', 'VXi', 926000, 'Petrol', 'SUV', 'Manual', '1.5L', 17.8, 5, '99PS@6000rpm', '136Nm@4400rpm', '328 litres', '40 litres', 'ABS, Airbags, Touchscreen, Rear Camera, Alloy Wheels', ''),
('Maruti Suzuki', 'Grand Vitara', 'Alpha', 1077000, 'Petrol', 'SUV', 'Manual', '1.5L Hybrid', 21.11, 5, '102PS@6000rpm', '136Nm@4400rpm', '375 litres', '43 litres', 'Hybrid Assist, ABS, Airbags, Adaptive Cruise, Sunroof', ''),
('Hyundai', 'Venue', 'S (O) Plus 1.2 Petrol', 726000, 'Petrol', 'SUV', 'Manual', '1.2L', 17.5, 5, '82PS@6000rpm', '113Nm@4000rpm', '350 litres', '37 litres', 'ABS, Airbags, Touchscreen, BlueLink, Wireless Android Auto/Apple CarPlay', ''),
('Hyundai', 'Alcazar', 'Signature 1.5 Diesel', 1639000, 'Diesel', 'SUV', 'Automatic', '1.5L', 16.0, 7, '115PS@4000rpm', '250Nm@1500-2750rpm', '180 litres (third row down varies)', '45 litres', '7-seater, Sunroof, 360° Camera, Ventilated Seats, Touchscreen', ''),
('Hyundai', 'Verna', 'SX 1.5 Petrol', 1270000, 'Petrol', 'Sedan', 'Manual', '1.5L', 18.6, 5, '113PS@6300rpm', '143.8Nm@4500rpm', '528 litres', '45 litres', 'ABS, 6 Airbags, Sunroof, Touchscreen, Rear Camera', ''),
('Hyundai', 'Aura', 'S 1.2 Petrol', 675000, 'Petrol', 'Sedan', 'Manual', '1.2L', 20.0, 5, '82PS@6000rpm', '114Nm@4000rpm', '402 litres', '37 litres', 'ABS, Airbags, AMT option, Touchscreen, Rear Camera', ''),
('Tata', 'Altroz', 'Smart Petrol', 630000, 'Petrol', 'Hatchback', 'Manual', '1.2L', 18.0, 5, '87PS@6000rpm', '113Nm@3300rpm', '345 litres', '37 litres', '5-star safety, ABS, Airbags, Rear Camera, Touchscreen', ''),
('Tata', 'Tiago', 'XM', 531000, 'Petrol', 'Hatchback', 'Manual', '1.2L', 19.0, 5, '86PS@6000rpm', '113Nm@3300rpm', '242 litres', '35 litres', 'ABS, Airbags, Infotainment, LED DRLs', ''),
('Tata', 'Tigor', 'XMA', 549000, 'Petrol', 'Sedan', 'Automatic', '1.2L', 19.6, 5, '86PS@6000rpm', '113Nm@3300rpm', '316 litres', '35 litres', 'ABS, Airbags, AMT, Rear Camera', ''),
('Tata', 'Nexon EV', 'Creative Plus (MR)', 1249000, 'Electric', 'SUV', 'Automatic', '—', 325.0, 5, '143 bhp (EV)', '215 Nm (EV)', '350 litres', '—', 'EV, Regenerative Braking, 7-inch Touchscreen, ADAS (varies by variant)', ''),
('Mahindra', 'Thar', 'LX Hard Top', 999000, 'Petrol', 'SUV', 'Manual', '2.0L', 12.4, 4, '150PS@5000rpm', '320Nm@1600-2800rpm', '160 litres approx', '57 litres', '4x4 options, Removable Top, Offroad Features, ABS, Airbags', ''),
('Mahindra', 'Scorpio N', 'Z6 Diesel MT', 1628000, 'Diesel', 'SUV', 'Manual', '2.0L', 14.0, 7, '140-200PS (variant)', '300-380Nm (variant)', '262 litres (typical)', '60 litres', '7-seater, Terrain Modes, Sunroof (higher trims), ADAS (top trims)', ''),
('Jeep', 'Compass', 'Sport 2.0 Diesel', 1773000, 'Diesel', 'SUV', 'Manual', '2.0L', 14.0, 5, '172PS@3750rpm', '350Nm@1750rpm', '438 litres', '60 litres', '4x4 option, ADAS (top), Leather (top), Infotainment', ''),
('MG', 'ZS EV', 'Standard', 1799000, 'Electric', 'SUV', 'Automatic', '—', 340.0, 5, '148PS (approx)', '353Nm (approx)', '448 litres', '—', 'EV, Panoramic Roof, 10.1" Touchscreen, ADAS (varies)', ''),
('Skoda', 'Kushaq', 'Style 1.5 TSI', 1400000, 'Petrol', 'Sedan', 'Manual', '1.5L Turbo', 18.0, 5, '150PS@5000-6000rpm', '250Nm@1500-3500rpm', '415 litres', '50 litres', 'ABS, Airbags, Virtual Cockpit (higher trims), Touchscreen', ''),
('Volkswagen', 'Taigun', 'Highline Plus 1.5 TSI', 1350000, 'Petrol', 'SUV', 'Manual', '1.5L Turbo', 18.0, 5, '150PS@5000rpm', '250Nm@1500-3500rpm', '385 litres', '50 litres', 'ABS, Airbags, Digital Cockpit, Sunroof (top), Touchscreen', ''),
('Honda', 'Amaze', 'VX CVT', 850000, 'Petrol', 'Sedan', 'Automatic', '1.2L', 18.0, 5, '90PS@6000rpm', '110Nm@4800rpm', '420 litres', '40 litres', 'CVT, ABS, Airbags, Touchscreen, Rear Camera', '');
