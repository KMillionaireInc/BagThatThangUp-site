import fs from "fs";
import path from "path";

export default async function handler(req, res) {
  try {
    if (req.method !== "GET") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const filePath = path.join(process.cwd(), "public", "generated", "test.txt");

    fs.writeFileSync(
      filePath,
      `Cron ran at ${new Date().toISOString()}`,
      "utf8"
    );

    return res.status(200).json({
      status: "ok",
      file: "/generated/test.txt"
    });
  } catch (err) {
    return res.status(500).json({
      error: err.message
    });
  }
}
