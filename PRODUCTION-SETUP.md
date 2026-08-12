# Production deployment

## Vercel
1. Push this repository to GitHub.
2. Import the repo into Vercel.
3. Framework preset: Vite.
4. Build command: `npm run build`.
5. Output directory: `dist`.
6. Add:
   - `VITE_SUPABASE_URL=https://xfnnjhpzzktmmcqsauve.supabase.co`
   - `VITE_SUPABASE_PUBLISHABLE_KEY=<your publishable key>`
7. Redeploy.

## Storage buckets matched to the current marketplace backend
- `digital-products` — private
- `payment-proofs` — private
- `seller-payment-qr` — private
- `product-media` — public
- `avatars` — public

The React app uses short-lived signed URLs for private QR, payment-proof and digital-product files.

## Important
Do not put a service-role/secret key into Vercel client environment variables or source code. The publishable key is intended for browser use when RLS is correctly configured.
