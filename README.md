# Car Recommendation System

A web application that suggests cars based on user requirements. Built with HTML, CSS, JavaScript frontend and Node.js backend with MySQL database.

## Features

- **Smart Car Search**: Find cars based on budget, fuel type, body type, transmission, brand, and year
- **Modern UI**: Beautiful, responsive design with smooth animations
- **Real-time Filtering**: Dynamic filter options loaded from database
- **Detailed Car Information**: Comprehensive car details including features, specifications, and images
- **Mobile Responsive**: Works perfectly on all device sizes

## Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Backend**: Node.js with Express.js
- **Database**: MySQL
- **Styling**: Custom CSS with modern design principles

## Prerequisites

- Node.js (v14 or higher)
- MySQL (v8.0 or higher)
- npm or yarn package manager

## Installation & Setup

### 1. Clone the repository
```bash
git clone <repository-url>
cd car-recommendation-website
```

### 2. Install dependencies
```bash
npm install
```

### 3. Database Setup

#### Option A: Using MySQL Command Line
```bash
mysql -u root -p < database.sql
```

#### Option B: Using MySQL Workbench
1. Open MySQL Workbench
2. Run the SQL commands from `database.sql` file
3. Make sure the database `car_recommendation` is created with sample data

### 4. Configure Database Connection

Edit the database connection in `server.js`:
```javascript
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'your_mysql_password', // Update this
  database: 'car_recommendation'
});
```

### 5. Start the Application

#### Development Mode (with auto-restart)
```bash
npm run dev
```

#### Production Mode
```bash
npm start
```

The application will be available at `http://localhost:3000`

## API Endpoints

### GET /api/cars
Returns all cars in the database

### POST /api/recommendations
Search for cars based on criteria
```json
{
  "budget": 30000,
  "fuelType": "Petrol",
  "bodyType": "SUV",
  "transmission": "Automatic",
  "brand": "Toyota",
  "minYear": 2020
}
```

### GET /api/filters
Returns available filter options (brands, fuel types, body types, transmissions)

## Database Schema

### Cars Table
- `id`: Primary key
- `make`: Car manufacturer (VARCHAR)
- `model`: Car model (VARCHAR)
- `variant`: Car variant/trim (VARCHAR)
- `price`: Car price (DECIMAL)
- `fuel_type`: Petrol, Diesel, Electric, Hybrid, CNG (ENUM)
- `body_type`: Hatchback, Sedan, SUV, MUV, etc. (ENUM)
- `transmission`: Manual, Automatic, CVT (ENUM)
- `engine_capacity`: Engine size (VARCHAR)
- `mileage`: Fuel efficiency (DECIMAL)
- `seating_capacity`: Number of seats (INT)
- `power`: Engine power output (VARCHAR)
- `torque`: Engine torque (VARCHAR)
- `boot_space`: Trunk space (VARCHAR)
- `fuel_tank_capacity`: Fuel tank size (VARCHAR)
- `features`: Key features (TEXT)
- `image_url`: Car image URL (VARCHAR)

## Usage

1. **Open the application** in your web browser
2. **Fill in your requirements**:
   - Set your budget limit
   - Choose preferred fuel type
   - Select body type (SUV, Sedan, etc.)
   - Pick transmission type
   - Choose brand preference
   - Set minimum year
3. **Click "Find My Car"** to get recommendations
4. **Browse results** with detailed car information
5. **Adjust filters** and search again for different results

## Customization

### Adding New Cars
Insert new records into the `cars` table:
```sql
INSERT INTO cars (brand, model, year, price, fuel_type, body_type, transmission, engine_capacity, mileage, color, features, image_url) 
VALUES ('Brand', 'Model', 2023, 25000, 'Petrol', 'Sedan', 'Automatic', '2.0L', 25.0, 'White', 'Features', 'image_url');
```

### Modifying Search Criteria
Edit the search logic in `server.js` in the `/api/recommendations` endpoint.

### Styling Changes
Modify `public/styles.css` to customize the appearance.

## Troubleshooting

### Database Connection Issues
- Ensure MySQL is running
- Check username and password in `server.js`
- Verify database exists and has data

### Port Already in Use
Change the port in `server.js`:
```javascript
const PORT = process.env.PORT || 3001; // Use different port
```

### Missing Dependencies
Run `npm install` to ensure all packages are installed.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For issues and questions, please create an issue in the repository or contact the development team.
