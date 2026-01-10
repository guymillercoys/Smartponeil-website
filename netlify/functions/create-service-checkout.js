import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";
import { cleanPhone, validatePhone } from "./phone-utils.js";

// Helper function to generate random hex string
function generateRandomHex(length = 16) {
  return crypto.randomBytes(length).toString('hex');
}

export const handler = async (event) => {
  // CORS headers
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  // Handle OPTIONS request for CORS
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  // Payments kill-switch
  if (process.env.PAYMENTS_ENABLED !== "true") {
    return {
      statusCode: 403,
      headers,
      body: JSON.stringify({ error: "Payments are currently disabled" })
    };
  }

  // Check for TRANZILA_TERMINAL_NAME env var
  const terminalName = process.env.TRANZILA_TERMINAL_NAME;
  if (!terminalName) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'TRANZILA_TERMINAL_NAME environment variable is not set'
      })
    };
  }

  // Check for Supabase env vars
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !supabaseServiceRoleKey) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variable is not set'
      })
    };
  }

  // Parse JSON body
  let body;
  try {
    body = JSON.parse(event.body || '{}');
  } catch (err) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: 'Invalid JSON body' })
    };
  }

  // Validate required fields
  const { fullName, passportNumber, phone, arrivalDate, workplace, hasLocalCard } = body;

  if (!fullName || !fullName.trim()) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: 'Missing or empty field: fullName' })
    };
  }

  if (!passportNumber || !passportNumber.trim()) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: 'Missing or empty field: passportNumber' })
    };
  }

  if (!phone || !phone.trim()) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: 'Missing or empty field: phone' })
    };
  }

  if (!arrivalDate || !arrivalDate.trim()) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: 'Missing or empty field: arrivalDate' })
    };
  }

  if (!workplace || !workplace.trim()) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: 'Missing or empty field: workplace' })
    };
  }

  // Clean and validate phone
  const validation = validatePhone(phone);
  if (!validation.valid) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: validation.error || 'Invalid phone format' })
    };
  }

  const cleanedPhone = validation.cleaned;

  // Create Supabase client
  const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

  // Lookup pricing in service_pricing
  const { data: pricing, error: pricingError } = await supabase
    .from('service_pricing')
    .select('phone, amount, currency')
    .eq('phone', cleanedPhone)
    .eq('active', true)
    .single();

  if (pricingError || !pricing) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: 'No pricing found for this phone' })
    };
  }

  // Generate orderId and notifyToken
  const timestamp = Date.now();
  const randomHex = generateRandomHex(8);
  const orderId = `ord_${timestamp}_${randomHex}`;
  const notifyToken = generateRandomHex(32);

  // Insert into service_requests
  const { data: requestData, error: insertError } = await supabase
    .from('service_requests')
    .insert({
      status: 'pending_payment',
      full_name: fullName.trim(),
      passport_number: passportNumber.trim(),
      phone: cleanedPhone,
      arrival_date: arrivalDate,
      workplace: workplace.trim(),
      has_local_card: hasLocalCard === true,
      amount: pricing.amount,
      currency: pricing.currency,
      order_id: orderId,
      notify_token: notifyToken
    })
    .select()
    .single();

  if (insertError) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Failed to create service request',
        details: insertError.message
      })
    };
  }

  // Get SITE_URL
  const siteUrl = process.env.URL || process.env.DEPLOY_PRIME_URL || 'http://localhost:8888';

  // Build Tranzila iframe URL
  const baseUrl = `https://direct.tranzila.com/${terminalName}/iframe.php`;
  const params = new URLSearchParams({
    sum: pricing.amount.toString(),
    currency: (pricing.currency || 1).toString(),
    cred_type: '1',
    tranmode: 'A',
    accessibility: '2',
    success_url_address: `${siteUrl}/payment/success?order=${orderId}`,
    fail_url_address: `${siteUrl}/payment/failure?order=${orderId}`,
    notify_url_address: `${siteUrl}/.netlify/functions/tranzila-notify?token=${notifyToken}&source=service`,
    Z_field: `${orderId}|service|${cleanedPhone}`
  });

  const iframeUrl = `${baseUrl}?${params.toString()}`;

  // Update service_requests with tranzila_url
  await supabase
    .from('service_requests')
    .update({ tranzila_url: iframeUrl })
    .eq('order_id', orderId);

  // Return response
  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({
      orderId,
      phone: cleanedPhone,
      amount: pricing.amount,
      currency: pricing.currency,
      url: iframeUrl
    })
  };
};

