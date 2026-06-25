import { Resend } from 'resend'; // 导入 Resend 官方 SDK

export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization"
        }
      });
    }

    if (request.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method Not Allowed." }), {
        status: 405,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
      });
    }

    const authHeader = request.headers.get("Authorization");
    if (!authHeader || authHeader !== `Bearer ${env.AUTH_TOKEN}`) {
      return new Response(JSON.stringify({ error: "Unauthorized. Invalid token." }), {
        status: 401,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
      });
    }

    try {
      const body = await request.json();
      const { from, to, subject, html, text } = body;

      if (!from || !to || !subject || (!html && !text)) {
        return new Response(JSON.stringify({ error: "Missing required fields." }), {
          status: 400,
          headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
        });
      }

      const resend = new Resend(env.RESEND_API_KEY);

      const { data, error } = await resend.emails.send({
        from: from,
        to: Array.isArray(to) ? to : [to],
        subject: subject,
        html: html || text,
      });

      if (error) {
        return new Response(JSON.stringify({ error: error.message }), {
          status: 400,
          headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
        });
      }

      return new Response(JSON.stringify(data), {
        status: 200,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
      });

    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
      });
    }
  }
};

