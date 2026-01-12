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
  const { fullName, passportNumber, phone, workplace } = body;

  if (!fullName || !fullName.trim()) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: 'Missing or empty field: fullName' })
    };
  }

  if (!phone || !phone.trim()) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: 'Missing or empty field: phone' })
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

  // Normalize optional fields
  // For text fields, use empty string if column is NOT NULL, or null if nullable
  const normalizedPassportNumber = (passportNumber && passportNumber.trim()) ? passportNumber.trim() : '';
  const normalizedWorkplace = (workplace && workplace.trim()) ? workplace.trim() : '';
  // Note: arrival_date is not sent - column should be nullable or removed from DB

  // Create Supabase client
  const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

  // Lookup pricing in service_pricing
  const { data: pricing, error: pricingError } = await supabase
    .from('service_pricing')
    .select('phone, amount, currency')
    .eq('phone', cleanedPhone)
    .eq('active', true)
    .single();

  // Use default pricing if not found (90 ILS)
  const finalAmount = pricing?.amount || 90;
  const finalCurrency = pricing?.currency || 1; // 1 = ILS

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
      passport_number: normalizedPassportNumber,
      phone: cleanedPhone,
      // arrival_date is not included - column should be nullable or removed from DB
      workplace: normalizedWorkplace,
      amount: finalAmount,
      currency: finalCurrency,
      order_id: orderId,
      notify_token: notifyToken
    })
    .select()
    .single();

  if (insertError) {
    // Log the error for debugging
    console.error('Supabase insert error:', insertError);
    console.error('Insert data:', {
      status: 'pending_payment',
      full_name: fullName.trim(),
      passport_number: normalizedPassportNumber,
      phone: cleanedPhone,
      workplace: normalizedWorkplace,
      amount: finalAmount,
      currency: finalCurrency,
      order_id: orderId
    });
    
    // Don't expose stack traces or internal errors
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Failed to create service request',
        details: insertError.message || 'Unknown error'
      })
    };
  }

  // Get production domain (use env var if available, otherwise use production domain)
  const productionDomain = process.env.URL || 'https://smartponeil.com';

  // Build Tranzila iframe URL
  const baseUrl = `https://direct.tranzila.com/${terminalName}/iframenew.php`;
  const params = new URLSearchParams({
    sum: finalAmount.toString(),
    currency: finalCurrency.toString(),
    cred_type: '1',
    tranmode: 'A',
    accessibility: '2',
    success_url_address: `${productionDomain}/.netlify/functions/tranzila-return?result=success&order=${orderId}`,
    fail_url_address: `${productionDomain}/.netlify/functions/tranzila-return?result=failure&order=${orderId}`,
    notify_url_address: `${productionDomain}/.netlify/functions/tranzila-notify?token=${notifyToken}&source=service`,
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
      amount: finalAmount,
      currency: finalCurrency,
      url: iframeUrl
    })
  };
};

