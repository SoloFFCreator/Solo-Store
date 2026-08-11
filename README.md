# SoloMarket — Tailwind rebuild

- No `css/` directory.
- No external custom CSS file.
- Every HTML page loads Tailwind through the Tailwind Play CDN.
- Small global animation/glass rules are embedded directly in each HTML `<style>` block.
- Responsive mobile-first UI.
- Seller product creation generates a non-null unique `slug` before inserting into `products`.
- The Supabase browser client uses only the publishable key.

For production, compile Tailwind locally instead of relying on the Play CDN.
Never expose a Supabase service-role/secret key in frontend code.
