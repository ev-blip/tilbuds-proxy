// File: api/csv.js
export default async function handler(req, res) {
  try {
    const GAS_URL   = process.env.GAS_URL;
    const GAS_TOKEN = process.env.GAS_TOKEN;
    if (!GAS_URL || !GAS_TOKEN) {
      res.status(500).json({ error: "GAS_URL eller GAS_TOKEN mangler" });
      return;
    }

    // Build URL (same as /api/json)
    const url = new URL(GAS_URL);
    for (const [k, v] of Object.entries(req.query || {})) url.searchParams.set(k, v);
    url.searchParams.set("token", GAS_TOKEN);

    const r = await fetch(url.toString(), { method: "GET" });
    const text = await r.text();

    // Force CSV content type if muligvis ikke sat af GAS
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.status(r.status).send(text);
  } catch (err) {
    res.status(500).json({ error: String(err?.message || err) });
  }
}
