
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const FLUTTERWAVE_SECRET_KEY = Deno.env.get('FLUTTERWAVE_SECRET_KEY') || 'FLWSECK_TEST-SANDBOX';
const FLUTTERWAVE_WEBHOOK_SECRET = Deno.env.get('FLUTTERWAVE_WEBHOOK_SECRET') || 'my_secret_hash'; 
const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? '';
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';

serve(async (req) => {
    // 1. Verify Signature (Security Critical)
    const signature = req.headers.get("verif-hash");
    if (!signature || signature !== FLUTTERWAVE_WEBHOOK_SECRET) {
        return new Response("Invalid Signature", { status: 401 });
    }

    try {
        const payload = await req.json();
        const tx_ref = payload.txRef || payload.tx_ref; // Handling variations in payload
        const flwId = payload.id;
        const status = payload.status;
        
        console.log(`Webhook Received: ${tx_ref}, Status: ${status}`);

        // 2. Double-Check Verification via API (Trust but verify)
        // Even if signature is valid, it's safer to query the status directly
        const verifyResponse = await fetch(`https://api.flutterwave.com/v3/transactions/verify_by_reference?tx_ref=${tx_ref}`, {
            headers: { Authorization: `Bearer ${FLUTTERWAVE_SECRET_KEY}` }
        });
        
        const verifyData = await verifyResponse.json();
        
        if (verifyData.status !== "success" || verifyData.data.status !== "successful") {
             // Handle failed/fraudulent attempt?
             // Mark as failed in DB if needed
             const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
             await supabase.from('fee_payments').update({
                status: 'failed',
                remarks: `Verification Failed: ${verifyData.message}`,
                raw_response: verifyData
             }).eq('tx_ref', tx_ref);

             return new Response("Verification Failed", { status: 400 });
        }

        const verifiedAmount = verifyData.data.amount;
        const verifiedCurrency = verifyData.data.currency;

        if (verifiedCurrency !== "UGX") {
             return new Response("Invalid Currency", { status: 400 });
        }

        // 3. Update Database (Idempotent update)
        const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

        // Only update if currently pending (avoid double-crediting)
        // Or upsert, but update is safer for status transitions
        const { data, error } = await supabase
            .from('fee_payments')
            .update({
                status: 'completed', // or 'verified'
                external_ref: flwId.toString(),
                provider: 'flutterwave', // confirm provider
                remarks: `Verified Webhook: ${flwId}`,
                raw_response: verifyData.data
            })
            .eq('tx_ref', tx_ref)
            .eq('status', 'pending') // Optimistic locking: only update if pending
            .select();

        if (error) {
            console.error('Database Update Error:', error);
            throw error;
        }

        if (data.length === 0) {
            console.log(`Transaction ${tx_ref} already processed or not found.`);
        } else {
             console.log(`Transaction ${tx_ref} successfully verified.`);
             // Ideally trigger email receipt here
        }

        return new Response("Webhook Processed", { status: 200 });

    } catch (err) {
        console.error('Webhook Error:', err);
        return new Response(`Error: ${err.message}`, { status: 500 });
    }
});
