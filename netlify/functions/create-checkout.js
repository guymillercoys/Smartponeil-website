// Load catalog at module level so it's bundled with the function
const catalog = require("./catalog.json");

exports.handler = async (event) => {
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

  // Generate orderId
  const timestamp = Date.now();
  const randomHex = Math.random().toString(16).substring(2, 10);
  const orderId = `ord_${timestamp}_${randomHex}`;

  // Prepare Z_field
  const zField = `${orderId}|${productSku}`;

  // Get SITE_URL
  const siteUrl = process.env.URL || process.env.DEPLOY_PRIME_URL || 'http://localhost:8888';

  // Build Tranzila iframe URL
  const baseUrl = `https://direct.tranzila.com/${terminalName}/iframe.php`;
  const params = new URLSearchParams({
    sum: product.price.toString(),
    currency: (product.currency || 1).toString(),
    cred_type: '1',
    tranmode: 'A',
    accessibility: '2',
    success_url_address: `${siteUrl}/payment/success?order=${orderId}`,
    fail_url_address: `${siteUrl}/payment/failure?order=${orderId}`,
    notify_url_address: `${siteUrl}/.netlify/functions/tranzila-notify`,
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

