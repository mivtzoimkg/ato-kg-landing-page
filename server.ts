import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API routes
  app.get("/api/test-sheets", async (req, res) => {
    const scriptUrl = process.env.GOOGLE_SCRIPT_URL || "https://script.google.com/macros/s/AKfycbyhaHgl__FJ3BTeSNOwhdhPm-mZYEgdPjNuds1dUzqwFLtOE8KRho8eV_r05PJ_ttfH/exec";
    if (scriptUrl) {
      return res.json({ 
        status: "success", 
        mode: "apps-script", 
        message: "Google Apps Script URL is configured" 
      });
    }
    res.status(400).json({ status: "error", message: "GOOGLE_SCRIPT_URL is not configured" });
  });

  // SMS notification helper function
  async function sendAdminSMS(amount: number, fullName: string, source: string) {
    const adminNumber = process.env.ADMIN_MOBILE_NUMBER || "0585770026";
    if (!adminNumber) {
      console.log("[SMS] ADMIN_MOBILE_NUMBER is not configured. SMS alert skipped.");
      return;
    }

    const message = `איגוד תלמידי הישיבות: תרומה חדשה בסך ₪${amount} התקבלה מאת ${fullName} עבור ${source}`;
    console.log(`[SMS] Sending notification to ${adminNumber}...`);

    // 1. Try ActiveTrail configuration if present (ActiveTrail SMS operational API)
    const activeTrailApiToken = process.env.ACTIVETRAIL_API_TOKEN;
    if (activeTrailApiToken) {
      try {
        console.log(`[SMS] Attempting ActiveTrail Operational SMS delivery...`);
        const senderName = (process.env.ACTIVETRAIL_SENDER || "Mivtzoim").replace(/[^a-zA-Z0-9]/g, "").substring(0, 11);
        
        const payload = {
          details: {
            name: "Donation Confirmation SMS",
            from_name: senderName,
            content: message
          },
          scheduling: {
            send_now: true
          },
          mobiles: [
            {
              phone_number: adminNumber
            }
          ]
        };

        const activeTrailRes = await axios.post(
          "https://api.activetrail.com/api/smscampaign/OperationalMessage",
          payload,
          {
            headers: {
              'Authorization': activeTrailApiToken,
              'Content-Type': 'application/json'
            },
            timeout: 5000
          }
        );
        console.log(`[SMS] ActiveTrail SMS successfully sent! Response:`, activeTrailRes.data);
        return;
      } catch (err: any) {
        console.error(`[SMS] ActiveTrail SMS delivery failed:`, err.response?.data || err.message);
      }
    }

    // 2. Try Twilio configuration if present
    const twilioSid = process.env.TWILIO_ACCOUNT_SID;
    const twilioToken = process.env.TWILIO_AUTH_TOKEN;
    const twilioFrom = process.env.TWILIO_FROM_NUMBER;

    if (twilioSid && twilioToken && twilioFrom) {
      try {
        console.log(`[SMS] Attempting Twilio SMS delivery...`);
        const b64Auth = Buffer.from(`${twilioSid}:${twilioToken}`).toString('base64');
        const params = new URLSearchParams();
        params.append('To', adminNumber);
        params.append('From', twilioFrom);
        params.append('Body', message);

        const twilioRes = await axios.post(
          `https://api.twilio.com/2010-04-01/Accounts/${twilioSid}/Messages.json`,
          params.toString(),
          {
            headers: {
              'Authorization': `Basic ${b64Auth}`,
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            timeout: 5000
          }
        );
        console.log(`[SMS] Twilio message successfully dispatched. SID: ${twilioRes.data?.sid}`);
        return;
      } catch (err: any) {
        console.error(`[SMS] Twilio delivery failed:`, err.response?.data || err.message);
      }
    }

    // 3. Try Generic/Israeli SMS Gateway webhook (GET or POST) if present
    const gatewayUrl = process.env.SMS_GATEWAY_URL;
    if (gatewayUrl) {
      try {
        console.log(`[SMS] Attempting SMS Gateway Webhook delivery...`);
        let finalUrl = gatewayUrl
          .replace(/\{\{NUMBER\}\}/g, encodeURIComponent(adminNumber))
          .replace(/\{\{MESSAGE\}\}/g, encodeURIComponent(message));

        const method = (process.env.SMS_GATEWAY_METHOD || 'GET').toUpperCase();
        let headers = {};
        if (process.env.SMS_GATEWAY_HEADERS_JSON) {
          try {
            headers = JSON.parse(process.env.SMS_GATEWAY_HEADERS_JSON);
          } catch (e) {
            console.error('[SMS] Failed to parse SMS_GATEWAY_HEADERS_JSON:', e);
          }
        }

        let bodyData = null;
        if (process.env.SMS_GATEWAY_BODY_JSON) {
          try {
            const bodyStr = process.env.SMS_GATEWAY_BODY_JSON
              .replace(/\{\{NUMBER\}\}/g, adminNumber)
              .replace(/\{\{MESSAGE\}\}/g, message);
            bodyData = JSON.parse(bodyStr);
          } catch (e) {
            console.error('[SMS] Failed to parse SMS_GATEWAY_BODY_JSON:', e);
          }
        }

        const axiosConfig: any = {
          method,
          url: finalUrl,
          headers,
          timeout: 6000
        };

        if (method === 'POST' && bodyData) {
          axiosConfig.data = bodyData;
        }

        const gatewayRes = await axios(axiosConfig);
        console.log(`[SMS] Gateway URL response status: ${gatewayRes.status}`);
        return;
      } catch (err: any) {
        console.error(`[SMS] SMS Gateway Webhook delivery failed:`, err.response?.data || err.message);
      }
    }

    console.log("[SMS] Neither ActiveTrail, Twilio nor SMS_GATEWAY_URL variables are fully configured. Skipped.");
  }

  app.post("/api/donors", async (req, res) => {
    const { fullName, email, amount, source } = req.body;
    
    // Default to the provided script URL if ENV is missing
    const scriptUrl = process.env.GOOGLE_SCRIPT_URL || "https://script.google.com/macros/s/AKfycbyhaHgl__FJ3BTeSNOwhdhPm-mZYEgdPjNuds1dUzqwFLtOE8KRho8eV_r05PJ_ttfH/exec";
    console.log(`[Spreadsheet] Using Script URL starting with: ${scriptUrl.substring(0, 35)}...`);
    
    // Trigger SMS notification asynchronously so it doesn't slow down the main response to the user
    sendAdminSMS(amount, fullName, source).catch(err => {
      console.error("[SMS] Background SMS send error:", err);
    });

    try {
      console.log(`[Spreadsheet] Attempting to save donor: ${fullName} (${amount} NIS)`);
      
      const payload = {
        date: new Date().toLocaleString("he-IL", { timeZone: "Asia/Jerusalem" }),
        fullName,
        email: email || "N/A",
        amount,
        source: source || "תרומה רגילה"
      };

      // Using axios because it handles Google's 302 redirects more robustly than native fetch in Node.js
      const response = await axios.post(scriptUrl, payload, {
        headers: {
          'Content-Type': 'application/json',
        },
        maxRedirects: 5,
        timeout: 10000 // 10s timeout
      });
      
      console.log(`[Spreadsheet] Response from script:`, response.data);
      
      return res.json({ 
        status: "success", 
        method: "apps-script",
        scriptResponse: response.data
      });

    } catch (error: any) {
      console.error("[Spreadsheet] Critical Error:", error.message);
      
      let errorMessage = "Failed to save to Google Sheets via Script";
      let details = error.message;

      if (error.response && error.response.status === 403) {
        console.error("[Spreadsheet] Access Denied (403). Make sure the Apps Script is deployed as 'Anyone'.");
        errorMessage = "שגיאת הרשאות בגוגל (403)";
        details = "עליך להגדיר את ה-Apps Script שיהיה נגיש ל-Anyone (כולל משתמשים אנונימיים) בתפריט ה-Deploy.";
      } else if (error.response) {
        console.error("[Spreadsheet] Response data:", error.response.data);
      }
      
      res.status(500).json({ 
        status: "error", 
        message: errorMessage,
        details: details
      });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
