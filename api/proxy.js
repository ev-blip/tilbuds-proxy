// File: api/proxy.js
export default async function handler(req, res) {
  try {
    const GAS_URL   = process.env.GAS_URL;   // fx https://script.google.com/macros/s/AKfycb.../exec
    const GAS_TOKEN = process.env.GAS_TOKEN; // fx Fefco0201_velkommen_bentsen

    if (!GAS_URL || !GAS_TOKEN) {
      return res.status(500).json({ error: "GAS_URL eller GAS_TOKEN mangler" });
    }

    // Byg URL til Google Apps Script (kopiér alle query params videre)
    const forward = new URL(GAS_URL);
    for (const [k, v] of Object.entries(req.query || {})) {
      forward.searchParams.set(k, v);
    }

    // Tilføj altid token til GAS
    forward.searchParams.set("token", GAS_TOKEN);

    // Forward GET/POST
    let init = { method: req.method };
    if (req.method === "POST") {
      init.headers = { "Content-Type": "application/json" };
      init.body = JSON.stringify(req.body || {});
    }

    const r = await fetch(forward.toString(), init);
    const text = await r.text();

    // Svar videre – med CORS så alle klienter (og jeg) kan læse det
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, X-API-KEY");
    res.setHeader("Content-Type", r.headers.get("content-type") || "application/json; charset=utf-8");

    res.status(r.status).send(text);
  } catch (err) {
    res.status(500).json({ error: String(err?.message || err) });
  }
}
