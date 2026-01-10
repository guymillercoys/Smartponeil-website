import { createClient } from "@supabase/supabase-js";

export const handler = async (event) => {
  // Read token and optional source from query parameters
  const token = event.queryStringParameters?.token;
  const source = event.queryStringParameters?.source; // 'service' or undefined
  
  if (!token) {
    return {
      statusCode: 400,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ error: "Missing token" })
    };
  }

  // Parse request body robustly
  let raw = event.body || "";
  if (event.isBase64Encoded) {
    raw = Buffer.from(raw, "base64").toString("utf8");
  }

  const ct = event.headers?.["content-type"] || event.headers?.["Content-Type"] || "";
  let parsed = {};

  if (ct.includes("application/x-www-form-urlencoded")) {
    const params = new URLSearchParams(raw);
    parsed = Object.fromEntries(params.entries());
  } else {
    try {
      parsed = JSON.parse(raw);
    } catch {
      parsed = {};
    }
  }

  // Determine status (best-effort heuristic)
  const isPaid = 
    parsed.Response === "000" || 
    parsed.response === "000" || 
    parsed.success === "true" || 
    parsed.status === "approved";
  
  const status = isPaid ? "paid" : "failed";

  // Check for Supabase env vars
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseUrl || !supabaseServiceRoleKey) {
    console.log({ token, status, error: "Supabase env vars not set" });
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'text/plain'
      },
      body: 'ok'
    };
  }

  // Create Supabase client
  const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

  if (source === 'service') {
    // Handle service requests
    const { data: serviceRequest, error: selectError } = await supabase
      .from('service_requests')
      .select('order_id, phone, amount, currency, telegram_paid_notified_at, telegram_failed_notified_at')
      .eq('notify_token', token)
      .single();

    if (selectError || !serviceRequest) {
      console.log({ token, status, error: "token not found" });
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'text/plain'
        },
        body: 'ok'
      };
    }

    const orderId = serviceRequest.order_id;
    const now = new Date().toISOString();

    // Extract failure reason (best effort)
    let failureReason = "Unknown";
    if (!isPaid) {
      const reasonFields = ['Error', 'err', 'Message', 'message', 'ResponseText', 'description', 'error'];
      for (const field of reasonFields) {
        if (parsed[field]) {
          failureReason = String(parsed[field]);
          break;
        }
      }
    }

    // Update service request with status, payload, and paid_at
    const updateData = {
      status,
      tranzila_payload: parsed,
      paid_at: isPaid ? now : null
    };

    const { error: updateError } = await supabase
      .from('service_requests')
      .update(updateData)
      .eq('notify_token', token);

    if (updateError) {
      console.log({ token, status, orderId, error: updateError.message });
    } else {
      console.log({ token, status, orderId });
      
      // Send Telegram notifications (deduplicated)
      try {
        const { sendTelegram } = await import('./_lib/telegram.js');
        
        if (isPaid && !serviceRequest.telegram_paid_notified_at) {
          const telegramText = `✅ Payment received\nOrder: ${orderId}\nPhone: ${serviceRequest.phone}\nAmount: ${serviceRequest.amount} ${serviceRequest.currency || 1}\nTime: ${now}`;
          await sendTelegram(telegramText);
          
          // Update telegram_paid_notified_at
          await supabase
            .from('service_requests')
            .update({ telegram_paid_notified_at: now })
            .eq('notify_token', token);
        } else if (!isPaid && !serviceRequest.telegram_failed_notified_at) {
          const telegramText = `❌ Payment failed\nOrder: ${orderId}\nPhone: ${serviceRequest.phone}\nAmount: ${serviceRequest.amount} ${serviceRequest.currency || 1}\nReason: ${failureReason}\nTime: ${now}`;
          await sendTelegram(telegramText);
          
          // Update telegram_failed_notified_at
          await supabase
            .from('service_requests')
            .update({ telegram_failed_notified_at: now })
            .eq('notify_token', token);
        }
      } catch (telegramError) {
        // Fail gracefully
        console.log("Telegram notification failed:", telegramError.message);
      }
    }
  } else {
    // Handle product orders (existing behavior)
    const { data: orderData, error: selectError } = await supabase
      .from('orders')
      .select('order_id')
      .eq('notify_token', token)
      .single();

    if (selectError || !orderData) {
      console.log({ token, status, error: "Order not found" });
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'text/plain'
        },
        body: 'ok'
      };
    }

    const orderId = orderData.order_id;

    // Update order with status, payload, and paid_at
    const updateData = {
      status,
      tranzila_payload: parsed,
      paid_at: isPaid ? new Date().toISOString() : null
    };

    const { error: updateError } = await supabase
      .from('orders')
      .update(updateData)
      .eq('notify_token', token);

    if (updateError) {
      console.log({ token, status, orderId, error: updateError.message });
    } else {
      console.log({ token, status, orderId });
    }
  }

  // Always return 200 "ok"
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'text/plain'
    },
    body: 'ok'
  };
};

