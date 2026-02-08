-- Add Mobile Money tracking columns to fee_payments table

-- 1. Status tracking (pending, successful, failed)
ALTER TABLE public.fee_payments 
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'completed'; -- Default 'completed' for existing cash/manual payments

-- 2. Transaction References
ALTER TABLE public.fee_payments 
ADD COLUMN IF NOT EXISTS tx_ref TEXT UNIQUE; -- Our internal reference (e.g., BHS-2026-...)

ALTER TABLE public.fee_payments 
ADD COLUMN IF NOT EXISTS external_ref TEXT; -- Flutterwave's transaction ID

-- 3. Provider details
ALTER TABLE public.fee_payments 
ADD COLUMN IF NOT EXISTS provider TEXT DEFAULT 'manual'; -- 'manual', 'flutterwave-mtn', 'flutterwave-airtel'

-- 4. Metadata (for debugging/audit)
ALTER TABLE public.fee_payments 
ADD COLUMN IF NOT EXISTS raw_response JSONB; -- Store full webhook payload for audit

-- 5. Index for faster lookups by reference
CREATE INDEX IF NOT EXISTS idx_fee_payments_tx_ref ON public.fee_payments(tx_ref);
