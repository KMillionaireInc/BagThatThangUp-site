export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const SUPABASE_URL = "https://gmsjqunfsffjiksffvem.supabase.co";
    const SUPABASE_KEY =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdtc2pxdW5mc2Zmamlrc2ZmdmVtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA4NzIxNTgsImV4cCI6MjA3NjQ0ODE1OH0.7qEXKk8f8Sd3G2y8KyQ0XbeCyG8ieD-8WV18-_JkRGc";

    const userData = {
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      site_name: req.body.store_name,
      subdomain: req.body.subdomain,
      email: req.body.email,
      amazon_id: req.body.amazon_id,
    };

    const response = await fetch(`${SUPABASE_URL}/rest/v1/Users`, {
      method: "POST",
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errText = await response.text();
      return res.status(response.status).json({ error: errText });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Server error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
