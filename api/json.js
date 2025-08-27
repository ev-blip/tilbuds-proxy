// File: api/json.js
export default async function handler(req, res) {
  try {
    const GAS_URL   = process.env.GAS_URL;   // ends with /exec
    const GAS_TOKEN = process.env.GAS_TOKEN; // your Apps Script token
    if (!GAS_URL || !GAS_TOKEN) {
      return res.status(500).json({ error: "GAS_URL eller GAS_TOKEN mangler" });
    }

    // Build target URL
    const url = new URL(GAS_URL);
    for (const [k, v] of Object.entries(req.query || {})) url.searchParams.set(k, v);
    url.searchParams.set("token", GAS_TOKEN);

    // Forward GET/POST
    const init = req.method === "POST"
      ? { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(req.body || {}) }
      : { method: "GET" };

    const r = await fetch(url.toString(), init);
    const text = await r.text();

    // Pass-through as JSON (fallback if content-type missing)
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Content-Type", r.headers.get("content-type") || "application/json; charset=utf-8");
    res.status(r.status).send(text);
  } catch (err) {
    res.status(500).json({ error: String(err?.message || err) });
  }
}
