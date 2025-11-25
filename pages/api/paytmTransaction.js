import https from "https";
import PaytmChecksum from "paytmchecksum"; 


export default async function handler(req, res) {
  if (req.method === "POST") {
    const { orderId, amount, custId } = req.body;

    const paytmParams = {
      body: {
        requestType: "Payment",
        mid: process.env.PAYTM_MID,
        websiteName: "CODESWEAR",
        orderId: orderId,
        callbackUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/api/paytmCallback`,
        txnAmount: {
          value: amount,
          currency: "INR",
        },
        userInfo: {
          custId: custId,
        },
      },
    };

    try {
      const checksum = await PaytmChecksum.generateSignature(
        JSON.stringify(paytmParams.body),
        process.env.PAYTM_MERCHANT_KEY
      );

      paytmParams.head = { signature: checksum };

      const post_data = JSON.stringify(paytmParams);

      const options = {
        hostname: process.env.PAYTM_HOSTNAME,
        port: 443,
        path: `/theia/api/v1/initiateTransaction?mid=${process.env.PAYTM_MID}&orderId=${orderId}`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": post_data.length,
        },
      };

      // Wrap https request in a Promise
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
      console.error("Paytm API error:", error);
      res.status(500).json({ error: "Failed to initiate Paytm transaction" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
