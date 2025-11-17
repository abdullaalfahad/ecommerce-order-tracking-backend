# ecommerce-order-tracking-backend

A production-ready Express + TypeScript + MongoDB + Stripe + Socket.IO
backend for an E-commerce Order Tracking System.

## Features

-   User authentication (JWT)
-   Product management
-   Cart system
-   Order creation with Stripe Payment Intents
-   Stripe webhook support
-   Real-time order tracking using Socket.IO

## Requirements

-   Node.js 18+
-   pnpm
-   Docker
-   MongoDB Atlas or local MongoDB instance

## Environment Variables

Create a `.env` file in the root:

    PORT=4000
    MONGO_URI=YOUR_MONGO_URI
    JWT_SECRET=YOUR_SECRET
    JWT_EXPIRES_IN=7d
    STRIPE_SECRET_KEY=YOUR_STRIPE_SECRET
    STRIPE_WEBHOOK_SECRET=YOUR_WEBHOOK_SECRET

------------------------------------------------------------------------

## Run with pnpm

### Install dependencies:

    pnpm install

### Start in development:

    pnpm dev

### Build:

    pnpm build

### Start production:

    pnpm start

------------------------------------------------------------------------

## Run with Docker

### Build & start containers:

    docker-compose up --build

### Start without rebuilding:

    docker-compose up

### Stop:

    docker-compose down

Your API will be available at:

    http://localhost:4000

------------------------------------------------------------------------

## Stripe Webhook (Important)

Stripe CLI:

    stripe listen --forward-to localhost:4000/api/orders/webhook

Copy the generated webhook secret into `.env`.

------------------------------------------------------------------------

## Project Structure

    src/
     ├─ server.ts
     ├─ app.ts
     ├─ config/
     ├─ controllers/
     ├─ routes/
     ├─ models/
     ├─ services/
     ├─ middlewares/
     └─ utils/

