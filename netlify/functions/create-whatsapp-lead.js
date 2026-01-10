import { createClient } from "@supabase/supabase-js";
import { cleanPhone, validatePhone } from "./phone-utils.js";

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
  const { fullName, passportNumber, phone, arrivalDate, workplace, messageTemplate } = body;

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

  if (!messageTemplate || !messageTemplate.trim()) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: 'Missing or empty field: messageTemplate' })
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

  // Get referrer and user agent from headers
  const referrer = event.headers?.referer || event.headers?.Referer || null;
  const ua = event.headers?.['user-agent'] || event.headers?.['User-Agent'] || null;

  // Insert into whatsapp_leads
  const { data: leadData, error: insertError } = await supabase
    .from('whatsapp_leads')
    .insert({
      full_name: fullName.trim(),
      passport_number: passportNumber.trim(),
      phone: cleanedPhone,
      arrival_date: arrivalDate,
      workplace: workplace.trim(),
      message_template: messageTemplate.trim(),
      page: 'service-payment',
      referrer: referrer,
      ua: ua
    })
    .select('id')
    .single();

  if (insertError) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Failed to create WhatsApp lead'
      })
    };
  }

  // Send Telegram notification (non-blocking)
  try {
    const { sendTelegram } = await import('./_lib/telegram.js');
    const now = new Date().toISOString();
    const telegramText = `📲 WhatsApp lead\nName: ${fullName.trim()}\nPhone: ${cleanedPhone}\nPassport: ${passportNumber.trim()}\nArrival: ${arrivalDate}\nWorkplace: ${workplace.trim()}\nTime: ${now}`;
    
    await sendTelegram(telegramText);
    
    // Update telegram_notified_at
    await supabase
      .from('whatsapp_leads')
      .update({ telegram_notified_at: now })
      .eq('id', leadData.id);
  } catch (telegramError) {
    // Fail gracefully - don't block user
    console.log("Telegram notification failed:", telegramError.message);
  }

  // Return response
  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({
      ok: true,
      id: leadData.id
    })
  };
};

