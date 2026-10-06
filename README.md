# Grove Market

A modern organic grocery store built with the MEAN stack and TypeScript:

- **MongoDB** for products, accounts, and orders
- **Express** for the API
- **Angular** for the storefront
- **Node.js** to run the server

The shop is styled as a clean, colorful market: a yellow harvest hero, category crates, and cold-pressed juice.

## Run it

From this folder:

```bash
npm install
npm run install:all
npm run dev
```

- Storefront: http://localhost:4200
- API: http://localhost:4000

If `MONGODB_URI` is empty, the API starts an in-memory MongoDB and seeds the catalog. That data resets when the server stops. To keep data, set `MONGODB_URI` in `server/.env` (see `server/.env.example`).

## Demo account

- Email: `demo@grove.market`
- Password: `grove123`

You can also create your own account. Delivery is $5.95, and free once the basket reaches $40.

## What you can do

- Browse citrus, berries, nuts, and cold-pressed juice
- Search and sort the market
- Add produce to a basket (saved in the browser)
- Sign in and place an order
- Review past orders
