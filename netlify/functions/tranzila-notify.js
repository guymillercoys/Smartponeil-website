exports.handler = async (event) => {
  // Log the notification body for debugging
  console.log('Tranzila notification received:', {
    body: event.body,
    headers: event.headers,
    httpMethod: event.httpMethod
  });

  // Return 200 OK response
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'text/plain'
    },
    body: 'ok'
  };
};

