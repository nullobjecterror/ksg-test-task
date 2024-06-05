# Web Server with Fastify, TypeScript, and PostgreSQL

## Overview

This project is a simple web server implemented with Fastify, TypeScript, and PostgreSQL. It has two endpoints:

1. `/items`: Fetches a list of items with tradable and non tradable min price from the Skinport API and caches the result.
2. `/users/:id/purchase`: Updates the balance of a user in the database.

## Setup and Installation

### Prerequisites

- Node.js
- Docker

### Installation

1. Clone the repository:

2. Install dependencies:

   ```
   npm install
   ```

3. Set up the PostgreSQL database and configure the `.env` file.

   ```
   docker-compose up -d
   ```

4. Run the server:

   ```
   npm run dev
   ```

### Environment Variables

Create a `.env` file in the project root with the following variables:

```
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=postgres
PORT=3000
SKINPORT_API_URL=https://api.skinport.com/v1
CACHE_TTL=600 // Cache Time-To-Live in seconds
```

or copy from example.env

```
cp example.env .env
```
