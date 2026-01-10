import { createClient } from "@supabase/supabase-js";
import { cleanPhone, validatePhone } from "./phone-utils.js";

export const handler = async (event) => {
  // CORS headers
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS'
  };

  // Handle OPTIONS request for CORS
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  // Only allow GET
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
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

  // Get phone from query params
  const phone = event.queryStringParameters?.phone;
  if (!phone) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: 'Missing required query parameter: phone' })
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

  // Query service_pricing table
  const { data: pricing, error: queryError } = await supabase
    .from('service_pricing')
    .select('phone, amount, currency')
    .eq('phone', cleanedPhone)
    .eq('active', true)
    .single();

  if (queryError || !pricing) {
    return {
      statusCode: 404,
      headers,
      body: JSON.stringify({ error: 'Phone not found' })
    };
  }

  // Return pricing
  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({
      phone: pricing.phone,
      amount: pricing.amount,
      currency: pricing.currency
    })
  };
};

