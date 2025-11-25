import https from "https";
import PaytmChecksum from "paytmchecksum";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { orderId } = req.body;

    if (!orderId) {
      return res.status(400).json({ error: "orderId is required" });
    }

    const paytmParams = {
      body: {
        mid: process.env.PAYTM_MID,
        orderId: orderId,
      },
    };

    // Generate checksum
    const checksum = await PaytmChecksum.generateSignature(
      JSON.stringify(paytmParams.body),
      process.env.PAYTM_MERCHANT_KEY
    );

    paytmParams.head = { signature: checksum };
    const post_data = JSON.stringify(paytmParams);

    const options = {
      hostname: process.env.PAYTM_STAGE
        ? "securegw-stage.paytm.in"
        : "securegw.paytm.in", // staging vs production
      port: 443,
      path: "/v3/order/status",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": post_data.length,
      },
    };

    const paytmResponse = await new Promise((resolve, reject) => {
      let response = "";
      const post_req = https.request(options, (post_res) => {
        post_res.on("data", (chunk) => {
          response += chunk;
        });

        post_res.on("end", () => {
          try {
            resolve(JSON.parse(response));
          } catch (err) {
            reject(err);
          }
        });
      });

      post_req.on("error", (err) => reject(err));

      post_req.write(post_data);
      post_req.end();
    });

    res.status(200).json(paytmResponse);
  } catch (error) {
    console.error("Paytm transaction status error:", error);
    res.status(500).json({ error: "Failed to fetch transaction status" });
  }
}
