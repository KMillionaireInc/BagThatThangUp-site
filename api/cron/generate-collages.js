import sharp from "sharp";
import fs from "fs";
import path from "path";
import fetch from "node-fetch";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const category = "Home Decor";
  const outDir = path.join(process.cwd(), "public", "generated");
  const outFile = path.join(outDir, "home-decor.png");

  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  // Mock products (3 items = MVP)
  const products = [
    "https://via.placeholder.com/400",
    "https://via.placeholder.com/400",
    "https://via.placeholder.com/400"
  ];

  const images = await Promise.all(
    products.map(async (url) => {
      const r = await fetch(url);
      return Buffer.from(await r.arrayBuffer());
    })
  );

  const canvas = sharp({
    create: {
      width: 1000,
      height: 1500,
      channels: 3,
      background: "#ffffff"
    }
  });

  const composed = await canvas
    .composite([
      { input: images[0], top: 100, left: 100 },
      { input: images[1], top: 600, left: 100 },
      { input: images[2], top: 1100, left: 100 }
    ])
    .png()
    .toFile(outFile);

  return res.status(200).json({
    status: "ok",
    category,
    image: "/generated/home-decor.png"
  });
}
