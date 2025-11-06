export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const userData = req.body;

    // Save to Supabase
    const response = await fetch("https://gmsjqunfsffjiksffvem.supabase.co/rest/v1/Users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdtc2pxdW5mc2Zmamlrc2ZmdmVtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA4NzIxNTgsImV4cCI6MjA3NjQ0ODE1OH0.7qEXKk8f8Sd3G2y8KyQ0XbeCyG8ieD-8WV18-_JkRGc",
        Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdtc2pxdW5mc2Zmamlrc2ZmdmVtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA4NzIxNTgsImV4cCI6MjA3NjQ0ODE1OH0.7qEXKk8f8Sd3G2y8KyQ0XbeCyG8ieD-8WV18-_JkRGc`
      },
      body: JSON.stringify(userData)
    });

    if (!response.ok) throw new Error("Supabase insert failed");

    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
