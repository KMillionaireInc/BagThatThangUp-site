export default function handler(req, res) {
  res.status(200).json({ message: "Webhook received" });
}

export const config = {
  api: {
    bodyParser: false
  }
};

