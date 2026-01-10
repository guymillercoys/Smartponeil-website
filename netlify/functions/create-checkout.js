// Load catalog at module level so it's bundled with the function
import catalog from "./catalog.json" assert { type: "json" };
import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";

// Helper function to generate random hex string
function generateRandomHex(length = 16) {
  return crypto.randomBytes(length).toString('hex');
}

export const handler = async (event) => {
  // CORS headers for development
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

  // Payments kill-switch
  if (process.env.PAYMENTS_ENABLED !== "true") {
    return {
      statusCode: 403,
      headers: { "Content-Type": "application/json" },
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

  // Get product SKU from query params
  const productSku = event.queryStringParameters?.product;
  if (!productSku) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({
        error: 'Missing required query parameter: product'
      })
    };
  }

  // Look up product in catalog
  const product = catalog[productSku];
  if (!product) {
    return {
      statusCode: 404,
      headers,
      body: JSON.stringify({
        error: `Product not found: ${productSku}`
      })
    };
  }

  // Generate orderId and notifyToken
  const timestamp = Date.now();
  const randomHex = generateRandomHex(8);
  const orderId = `ord_${timestamp}_${randomHex}`;
  const notifyToken = generateRandomHex(32);

  // Compute shipping defaults
  const shipping_required = product.shippingRequired ?? false;
  const shipping_cost = product.shippingCost ?? 0;
  const total_amount = product.price + shipping_cost;

  // Create Supabase client
  const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

  // Insert order into Supabase
  const { data: orderData, error: insertError } = await supabase
    .from('orders')
    .insert({
      order_id: orderId,
      sku: productSku,
      amount: product.price,
      currency: product.currency ?? 1,
      status: 'pending',
      notify_token: notifyToken,
      shipping_required,
      shipping_cost,
      total_amount
    })
    .select()
    .single();

  // If insert fails, return 500 and do not return iframe URL
  if (insertError) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Failed to create order',
        details: insertError.message
      })
    };
  }

  // Prepare Z_field
  const zField = `${orderId}|${productSku}`;

  // Get production domain (use env var if available, otherwise use production domain)
  const productionDomain = process.env.URL || 'https://smartponeil.com';

  // Build Tranzila iframe URL with token in notify_url_address
  const baseUrl = `https://direct.tranzila.com/${terminalName}/iframe.php`;
  const params = new URLSearchParams({
    sum: product.price.toString(),
    currency: (product.currency || 1).toString(),
    cred_type: '1',
    tranmode: 'A',
    accessibility: '2',
    success_url_address: `${productionDomain}/.netlify/functions/tranzila-return?result=success&order=${orderId}`,
    fail_url_address: `${productionDomain}/.netlify/functions/tranzila-return?result=failure&order=${orderId}`,
    notify_url_address: `${productionDomain}/.netlify/functions/tranzila-notify?token=${notifyToken}`,
    Z_field: zField
  });

  const iframeUrl = `${baseUrl}?${params.toString()}`;

  // Return response
  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({
      orderId,
      product: {
        sku: productSku,
        name: product.name,
        price: product.price,
        currency: product.currency || 1
      },
      url: iframeUrl
    })
  };
};

