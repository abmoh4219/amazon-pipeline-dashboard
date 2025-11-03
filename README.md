# Amazon Pipeline Dashboard

A full-stack application for tracking Amazon product prices and details. The dashboard provides real-time insights into product information scraped from Amazon, with a React/Next.js frontend and a NestJS backend.

## Screenshots

### Overview Dashboard
![Overview Dashboard](https://raw.githubusercontent.com/abmoh4219/amazon-pipeline-dashboard/main/frontend/public/overview.png)

### Products Dashboard
![Products Dashboard](https://raw.githubusercontent.com/abmoh4219/amazon-pipeline-dashboard/main/frontend/public/dashboard-preview.png)

## Features

- **Product Scraping**: Automatically fetches product details from Amazon using ScrapingBee
- **Real-time Dashboard**: Visualize product data with interactive charts and tables
- **RESTful API**: Built with NestJS for robust backend functionality
- **PostgreSQL Database**: Persistent storage for product information
- **Docker Support**: Easy setup with Docker and Docker Compose

## Prerequisites

- Node.js >= 18
- Docker & Docker Compose (recommended)
- ScrapingBee API key (for Amazon product scraping)

## Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/abmoh4219/amazon-pipeline-dashboard.git
cd amazon-pipeline-dashboard
```

### 2. Backend Setup

1. Navigate to the backend directory and set up environment variables:

```bash
cd backend
cp .env.example .env
```

2. Edit the `.env` file and add your ScrapingBee API key:

```env
SCRAPINGBEE_API_KEY=your_api_key_here
```

3. Start the backend and database with Docker Compose:

```bash
docker-compose up --build -d
```

4. Trigger the scraping process:

```bash
curl -X POST http://localhost:3000/products/scrape-by-asins
```

### 3. Frontend Setup

1. In a new terminal, navigate to the frontend directory and install dependencies:

```bash
cd frontend
npm install
```

2. Start the development server:

```bash
npm run dev
```

3. Open your browser and visit: [http://localhost:3001](http://localhost:3001)

## Project Structure

```
amazon-pipeline-dashboard/
├── backend/               # NestJS backend
│   ├── src/
│   │   ├── products/     # Product-related modules and services
│   │   ├── app.module.ts # Main application module
│   │   └── main.ts       # Application entry point
│   ├── .env.example      # Example environment variables
│   └── docker-compose.yml # Docker configuration
└── frontend/             # Next.js frontend
    ├── components/       # React components
    ├── pages/            # Next.js pages
    ├── public/           # Static files
    └── styles/           # CSS modules
```

## API Endpoints

- `GET /products` - Get all products
- `POST /products/scrape-by-asins` - Trigger product scraping

## Environment Variables

### Backend (`.env`)

```env
# Database
DB_HOST=postgres
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=amazon_dashboard

# Scraping
SCRAPINGBEE_API_KEY=your_api_key_here

# Server
PORT=3000
NODE_ENV=development
```

### Frontend (`.env.local`)

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

## Development

### Running Without Docker

#### Backend

```bash
cd backend
npm install
npm run start:dev
```

#### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Common Commands

- Rebuild and restart containers:
  ```bash
  docker-compose up --build -d
  ```

- View logs:
  ```bash
  docker-compose logs -f
  ```

- Stop containers:
  ```bash
  docker-compose down
  ```

- Reset database (WARNING: deletes all data):
  ```bash
  docker-compose down -v
  docker-compose up --build -d
  ```

## Troubleshooting

### Scraping Issues

- Ensure your ScrapingBee API key is valid and has sufficient credits
- Check backend logs for detailed error messages:
  ```bash
  docker-compose logs -f backend
  ```
- If prices show as `0.0`, the scraper might not be finding the price element in the HTML

### Database Issues

- If the database container fails to start, try removing the volume and rebuilding:
  ```bash
  docker-compose down -v
  docker-compose up --build -d
  ```

### Frontend Connection Issues

- If the frontend can't connect to the backend, ensure:
  - The backend is running and accessible at the URL specified in the frontend's environment variables
  - CORS is properly configured in the backend

## License

MIT
