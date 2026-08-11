# SoloMarket

Push this folder to GitHub and connect it to Vercel.

Supabase URL/key are configured in `js/config.js`. The publishable key is intended for browser use; never add a service-role key.

Required Supabase migrations/storage from the project setup:
- seller_payment_methods
- payment_submissions
- download_entitlements
- product_files
- publish_product()
- get_download_path()
- approve_payment_submission()
- reject_payment_submission()

Private Storage buckets:
- digital-products
- payment-proofs
- seller-payment-qr

Test with separate buyer/seller accounts before public launch.
