// api/test-amazon.js

import crypto from "crypto";

export default async function handler(req, res) {
  try {
    const accessKey = process.env.AMZ_ACCESS_KEY_ID;
    const secretKey = process.env.AMZ_SECRET_ACCESS_KEY;
    const partnerTag = process.env.AMZ_ASSOCIATE_TAG;

    if (!accessKey || !secretKey || !partnerTag) {
      return res
        .status(500)
        .json({ ok: false, error: "Missing one or more Amazon env vars" });
    }

    // Simple PA-API 5.0 SearchItems request
    const host = "webservices.amazon.com";
    const region = "us-east-1";
    const service = "ProductAdvertisingAPI";
    const path = "/paapi5/searchitems";
    const endpoint = `https://${host}${path}`;

    const payload = JSON.stringify({
      PartnerTag: partnerTag,
      PartnerType: "Associates",
      Marketplace: "www.amazon.com",
      Keywords: "coffee mug",
      SearchIndex: "All",
      Resources: [
        "ItemInfo.Title",
        "Offers.Listings.Price"
      ]
    });

    const amzTarget = "com.amazon.paapi5.v1.ProductAdvertisingAPIv1.SearchItems";
    const contentType = "application/json; charset=UTF-8";

    const now = new Date();
    const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, "");
    const dateStamp = amzDate.substring(0, 8);

    // ************* TASK 1: CREATE CANONICAL REQUEST *************
    const signedHeaders = "content-encoding;content-type;host;x-amz-date;x-amz-target";
    const canonicalHeaders =
      "content-encoding:amz-1.0\n" +
      `content-type:${contentType}\n` +
      `host:${host}\n` +
      `x-amz-date:${amzDate}\n` +
      `x-amz-target:${amzTarget}\n`;

    const payloadHash = crypto.createHash("sha256").update(payload, "utf8").digest("hex");

    const canonicalRequest =
      "POST\n" +
      path + "\n" +
      "\n" +
      canonicalHeaders + "\n" +
      signedHeaders + "\n" +
      payloadHash;

    // ************* TASK 2: CREATE STRING TO SIGN *************
    const algorithm = "AWS4-HMAC-SHA256";
    const credentialScope = `${dateStamp}/${region}/${service}/aws4_request`;
    const canonicalRequestHash = crypto
      .createHash("sha256")
      .update(canonicalRequest, "utf8")
      .digest("hex");

    const stringToSign =
      `${algorithm}\n` +
      `${amzDate}\n` +
      `${credentialScope}\n` +
      canonicalRequestHash;

    // ************* TASK 3: CALCULATE SIGNATURE *************
    function sign(key, msg) {
      return crypto.createHmac("sha256", key).update(msg, "utf8").digest();
    }

    const kDate = sign("AWS4" + secretKey, dateStamp);
    const kRegion = sign(kDate, region);
    const kService = sign(kRegion, service);
    const kSigning = sign(kService, "aws4_request");

    const signature = crypto
      .createHmac("sha256", kSigning)
      .update(stringToSign, "utf8")
      .digest("hex");

    const authorizationHeader =
      `${algorithm} ` +
      `Credential=${accessKey}/${credentialScope}, ` +
      `SignedHeaders=${signedHeaders}, ` +
      `Signature=${signature}`;

    // ************* TASK 4: SEND REQUEST *************
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Encoding": "amz-1.0",
        "Content-Type": contentType,
        "X-Amz-Date": amzDate,
        "X-Amz-Target": amzTarget,
        "Authorization": authorizationHeader
      },
      body: payload
    });

    const data = await response.json();

    return res.status(200).json({
      ok: true,
      status: response.status,
      data
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, error: String(err) });
  }
}
