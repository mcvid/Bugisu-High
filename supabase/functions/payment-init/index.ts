
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const FLUTTERWAVE_SECRET_KEY = Deno.env.get('FLUTTERWAVE_SECRET_KEY') || 'FLWSECK_TEST-SANDBOX'; // fallback for demo
const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? '';
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const { amount, student_id, phone, email, name, student_name } = await req.json();

    // 1. Generate Unique Transaction Reference
    // Format: BHS-{YEAR}-{STUDENT_ID_SHORT}-{TIMESTAMP}
    const timestamp = Date.now();
    const shortStudentId = student_id.split('-')[0];
    const tx_ref = `BHS-${new Date().getFullYear()}-${shortStudentId}-${timestamp}`;

    // 2. Create Pending Record in Database ("Source of Truth")
    const { error: insertError } = await supabase
      .from('fee_payments')
      .insert([
        {
          student_id: student_id,
          amount_paid: amount,
          payment_method: 'mobile_money',
          provider: 'flutterwave',
          status: 'pending',
          tx_ref: tx_ref,
          external_ref: null, // Will be updated by webhook
          remarks: `Initiated via ${phone}`,
          // detailed metadata for audit
          raw_response: { initiator: 'payment-init', phone, email, name } 
        }
      ]);

    if (insertError) {
      throw new Error(`Database Init Failed: ${insertError.message}`);
    }

    // 3. Call Flutterwave API
    const flutterwavePayload = {
      tx_ref: tx_ref,
      amount: amount.toString(),
      currency: "UGX",
      redirect_url: `${req.headers.get('origin')}/parent/fees?status=verifying&tx_ref=${tx_ref}`, // Redirect back to fees page
      payment_options: "mobilemoneyuganda, card",
      meta: {
        student_id,
        student_name
      },
      customer: {
        email: email || "parent@bugisuhigh.com",
        phonenumber: phone,
        name: name || "Parent"
      },
      customizations: {
        title: "Bugisu High School Fees",
        description: `Fees Payment for ${student_name}`,
        logo: "https://bugisuhighschool.com/logo.png" // distinct logo
      }
    };

    const flwResponse = await fetch("https://api.flutterwave.com/v3/payments", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${FLUTTERWAVE_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(flutterwavePayload),
    });

    const flwData = await flwResponse.json();

    if (flwData.status !== "success") {
        // Mark as failed in DB if API call fails
        await supabase
            .from('fee_payments')
            .update({ status: 'failed', remarks: `API Error: ${flwData.message}` })
            .eq('tx_ref', tx_ref);
            
        throw new Error(`Flutterwave Error: ${flwData.message}`);
    }

    // 4. Return Payment Link
    return new Response(
      JSON.stringify({ 
        link: flwData.data.link,
        tx_ref: tx_ref 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});
