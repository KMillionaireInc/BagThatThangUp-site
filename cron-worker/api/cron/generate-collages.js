import sharp from "sharp";
import axios from "axios";
import fs from "fs";
import path from "path";

export default async function handler(req, res) {
  try {
    const images = [
      "https://m.media-amazon.com/images/I/61aJj6j0L-L._AC_SL1500_.jpg",
      "https://m.media-amazon.com/images/I/71TPda7cwUL._AC_SL1500_.jpg",
      "https://m.media-amazon.com/images/I/61fZ+0xk4GL._AC_SL1500_.jpg"
    ];

    const WIDTH = 1000;
    const HEIGHT = 1500;
    const TILE_HEIGHT = 420;
    const TILE_WIDTH = 900;

    const canvas = sharp({
      create: {
        width: WIDTH,
        height: HEIGHT,
        channels: 3,
        background: "#ffffff"
      }
    });

    const composites = [];

    for (let i = 0; i < images.length; i++) {
      const response = await axios.get(images[i], {
        responseType: "arraybuffer"
      });

      const img = await sharp(response.data)
        .resize(TILE_WIDTH, TILE_HEIGHT, { fit: "cover" })
        .toBuffer();

      composites.push({
        input: img,
        top: 60 + i * (TILE_HEIGHT + 40),
        left: 50
      });
    }

    const outputDir = path.join(process.cwd(), "public", "generated");
    fs.mkdirSync(outputDir, { recursive: true });

    const outputPath = path.join(outputDir, "home-decor.png");

    await canvas.composite(composites).png().toFile(outputPath);

    return res.status(200).json({
      status: "ok",
      image: "/generated/home-decor.png"
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
