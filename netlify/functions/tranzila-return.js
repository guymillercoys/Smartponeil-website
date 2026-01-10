/**
 * Tranzila return handler - redirects POST/GET requests from Tranzila to static HTML pages
 * Tranzila sends POST requests, but static HTML can't handle POST, so we redirect here
 */

export const handler = async (event) => {
  // Accept both GET and POST
  if (event.httpMethod !== 'GET' && event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: {
        'Content-Type': 'text/plain',
        'Allow': 'GET, POST'
      },
      body: 'Method not allowed'
    };
  }

  // Read query parameters
  const result = event.queryStringParameters?.result || '';
  const order = event.queryStringParameters?.order || '';

  // Optionally parse POST body for logging (but don't log sensitive card details)
  if (event.httpMethod === 'POST' && event.body) {
    try {
      // Tranzila sends x-www-form-urlencoded
      const bodyParams = new URLSearchParams(event.body);
      const bodyObj = {};
      for (const [key, value] of bodyParams.entries()) {
        // Don't log sensitive fields
        if (!['card', 'cvv', 'cvv2', 'cardnum', 'cardnumber'].includes(key.toLowerCase())) {
          bodyObj[key] = value;
        }
      }
      console.log('Tranzila return POST body (sanitized):', JSON.stringify(bodyObj));
    } catch (err) {
      // Ignore parsing errors
      console.log('Could not parse POST body:', err.message);
    }
  }

  // Determine redirect URL based on result
  let redirectUrl;
  if (result === 'success') {
    redirectUrl = `/payment/success.html${order ? `?order=${encodeURIComponent(order)}` : ''}`;
  } else {
    redirectUrl = `/payment/failure.html${order ? `?order=${encodeURIComponent(order)}` : ''}`;
  }

  // Return HTTP 302 redirect
  return {
    statusCode: 302,
    headers: {
      'Location': redirectUrl,
      'Cache-Control': 'no-store'
    },
    body: ''
  };
};

