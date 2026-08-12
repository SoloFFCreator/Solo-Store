# SoloMarket React Production v3
React + Vite + Tailwind CSS v4 + Motion + Supabase.

## Run
npm install
cp .env.example .env.local
npm run dev

Set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY.

The browser must only receive the Supabase publishable key. Never expose a service-role key.

The frontend matches the existing marketplace schema: profiles, categories, products, product_files, orders, order_items, payment_submissions, seller_payment_methods and download_entitlements.

Product creation always generates a non-null unique slug before insert.
