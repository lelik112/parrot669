const MAX = {
  name: 120,
  contact: 200,
  service: 80,
  message: 5000,
};

const ALLOWED_SERVICES = new Set([
  "rental",
  "visit",
  "documents",
  "search",
  "owner",
  "other",
]);

const json = (data, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });

const clean = (value, max) =>
  typeof value === "string" ? value.trim().slice(0, max) : "";

const escapeHtml = (value) =>
  value.replace(/[&<>"']/g, (c) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[c]);

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/api/search") {
      if (request.method !== "GET") {
        return json({ error: "Method not allowed" }, 405);
      }

      const upstream = new URL("https://api.parrot669.com/api/search");
      upstream.search = url.search;

      try {
        const response = await fetch(upstream.toString(), {
          method: "GET",
          headers: { "Accept": "application/json" },
        });

        return new Response(response.body, {
          status: response.status,
          headers: {
            "Content-Type": response.headers.get("Content-Type") || "application/json; charset=utf-8",
            "Cache-Control": "no-store",
          },
        });
      } catch (error) {
        console.error("Availability API proxy failed", error?.message);
        return json({ error: "Availability service unavailable" }, 502);
      }
    }

    if (url.pathname !== "/api/contact") {
      return env.ASSETS.fetch(request);
    }

    if (request.method !== "POST") {
      return json({ ok: false, error: "Method not allowed" }, 405);
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return json({ ok: false, error: "Invalid JSON" }, 400);
    }

    // Honeypot: real users never see/fill this field.
    if (body.website) {
      return json({ ok: true });
    }

    const name = clean(body.name, MAX.name);
    const contact = clean(body.contact, MAX.contact);
    const service = clean(body.service, MAX.service);
    const message = clean(body.message, MAX.message);

    if (!name || !contact || !message || !ALLOWED_SERVICES.has(service)) {
      return json({ ok: false, error: "Missing or invalid fields" }, 400);
    }

    if (!env.NOTIFY_TO) {
      console.error("NOTIFY_TO is not configured");
      return json({ ok: false, error: "Contact destination is not configured" }, 500);
    }

    const subject = `[PARROT 669] New request: ${service}`;
    const text = [
      "New request from parrot669.com",
      "",
      `Name: ${name}`,
      `Contact: ${contact}`,
      `Service: ${service}`,
      "",
      message,
    ].join("\n");

    const html = `
      <h2>New request from PARROT 669</h2>
      <p><strong>Name:</strong> ${escapeHtml(name)}</p>
      <p><strong>Contact:</strong> ${escapeHtml(contact)}</p>
      <p><strong>Service:</strong> ${escapeHtml(service)}</p>
      <p><strong>Message:</strong></p>
      <p>${escapeHtml(message).replace(/\n/g, "<br>")}</p>
    `;

    const replyTo =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact) ? contact : undefined;

    try {
      const email = {
        to: env.NOTIFY_TO,
        from: { email: "hello@parrot669.com", name: "PARROT 669 website" },
        subject,
        text,
        html,
      };
      if (replyTo) email.replyTo = replyTo;

      await env.EMAIL.send(email);
      return json({ ok: true });
    } catch (error) {
      console.error("Email send failed", error?.code, error?.message);
      return json({ ok: false, error: "Email delivery failed" }, 500);
    }
  },
};
