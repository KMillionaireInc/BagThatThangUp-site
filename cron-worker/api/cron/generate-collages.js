export default async function handler(req, res) {
  return res.status(200).json({
    status: "ok",
    category: "Home Decor",
    collage: {
      width: 1000,
      height: 1500,
      products: [
        { asin: "B000000001", image: "https://via.placeholder.com/300" },
        { asin: "B000000002", image: "https://via.placeholder.com/300" },
        { asin: "B000000003", image: "https://via.placeholder.com/300" }
      ]
    }
  });
}

