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

  // Helper to execute Google Apps Script requests with robust 302/JSON redirection handling
  async function executeGoogleScriptCall(url: string, payload: any) {
    try {
      console.log(`[GoogleScript] Attempting native fetch post to: ${url}`);
      const resp = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload),
        redirect: "follow"
      });
      
      const text = await resp.text();
      console.log(`[GoogleScript] Response status: ${resp.status}, content length: ${text.length}`);
      
      // Check if the response is actually a Google Sign-In redirect page, which happens on permission mismatch
      if (text.includes("Sign in") || text.includes("Google Accounts") || text.includes("login")) {
        throw new Error("גוגל דורש התחברות (שגיאה 401/403). עליכם להגדיר את ה-doPost ב-Apps Script כבעל גישה ל-Anyone (כולל משתמשים אנונימיים). בלי זה, שרת גוגל חוסם קריאות חיצוניות.");
      }
      
      try {
        const parsed = JSON.parse(text);
        if (parsed.status === "error" || parsed.error) {
          throw new Error(parsed.message || parsed.error || "שגיאה פנימית בסקריפט גוגל");
        }
        return parsed;
      } catch (jsonErr: any) {
        if (jsonErr.message && jsonErr.message.includes("גוגל דורש התחברות")) {
          throw jsonErr;
        }
        // If the return was short, raw text, let's assume it was successful
        if (text && text.trim().length > 0 && text.trim().length < 200) {
          return { status: "success", text };
        }
        throw new Error(`תשובת הגוגל שיטס אינה בפורמט JSON תקין. ייתכן שהסקריפט לא הותקן כראוי. תוכן שהתקבל: ${text.substring(0, 150)}...`);
      }
    } catch (err: any) {
      console.warn(`[GoogleScript] Native fetch failed: ${err.message}. Trying Axios with standard redirects.`);
      try {
        const response = await axios.post(url, payload, {
          headers: {
            'Content-Type': 'application/json',
          },
          maxRedirects: 5,
          timeout: 10000 // 10s timeout
        });
        
        const data = response.data;
        if (typeof data === "string") {
          if (data.includes("Sign in") || data.includes("Google Accounts") || data.includes("login")) {
            throw new Error("גוגל דורש התחברות (שגיאה 401/403). עליכם להגדיר את ה-doPost ב-Apps Script כבעל גישה ל-Anyone (כולל משתמשים אנונימיים). בלי זה, שרת גוגל חוסם קריאות חיצוניות.");
          }
          try {
            return JSON.parse(data);
          } catch {
            return { status: "raw", text: data.substring(0, 500) };
          }
        }
        return data;
      } catch (axiosErr: any) {
        console.error("[GoogleScript] Axios fallback also failed:", axiosErr.message);
        throw new Error(err.message || axiosErr.message);
      }
    }
  }

  // API routes
  app.get("/api/test-sheets", async (req, res) => {
    const scriptUrl = process.env.GOOGLE_SCRIPT_URL || "https://script.google.com/macros/s/AKfycbyhaHgl__FJ3BTeSNOwhdhPm-mZYEgdPjNuds1dUzqwFLtOE8KRho8eV_r05PJ_ttfH/exec";
    if (!scriptUrl) {
      return res.status(400).json({ status: "error", message: "GOOGLE_SCRIPT_URL is not configured" });
    }

    try {
      console.log(`[Diagnostic] Testing Google Script connection to: ${scriptUrl}`);
      const testPayload = {
        date: new Date().toLocaleString("he-IL", { timeZone: "Asia/Jerusalem" }),
        fullName: "בדיקת מערכת תקינות",
        email: "test@example.com",
        amount: 1,
        source: "חיבור בדיקה - אבחון עצמי"
      };

      const result = await executeGoogleScriptCall(scriptUrl, testPayload);
      return res.json({
        status: "success",
        message: "השרת הצליח לשלוח קריאה ולקבל תשובה מגוגל!",
        googleResponse: result,
        info: "שרת האפליקציה הצליח ליצור קשר עם גוגל בהצלחה. אם המידע לא מופיע כראוי בגליון, ודאו שקוד ה-doPost בסקריפט שלכם נכון."
      });
    } catch (err: any) {
      console.error("[Diagnostic] Test Sheets connection failed:", err.message);
      return res.status(500).json({
        status: "error",
        message: "חיבור לגוגל נכשל",
        details: err.message,
        suggestion: "ודאו שכתובת ה-Web App הועתקה במלואה, שהסקריפט פורסם (Deploy) ושהגדרתם גישה לכל אחד (Anyone, even anonymous)."
      });
    }
  });

  app.post("/api/test-sheets-url", async (req, res) => {
    const { url } = req.body;
    if (!url || typeof url !== "string" || !url.startsWith("https://script.google.com")) {
      return res.status(400).json({ status: "error", message: "כתובת סקריפט לא תקינה" });
    }

    try {
      console.log(`[Diagnostic Tool] Testing manually supplied Google Script URL: ${url}`);
      const testPayload = {
        date: new Date().toLocaleString("he-IL", { timeZone: "Asia/Jerusalem" }),
        fullName: "בדיקת חיבור ידנית",
        email: "test-admin@example.com",
        amount: 5,
        source: "אבחון ידני מהאתר"
      };

      const result = await executeGoogleScriptCall(url, testPayload);
      return res.json({
        status: "success",
        message: "התשובה התקבלה בהצלחה מגוגל!",
        googleResponse: result
      });
    } catch (err: any) {
      console.error("[Diagnostic Tool] Manual Test Sheets connection failed:", err.message);
      return res.status(500).json({
        status: "error",
        message: "החיבור לכתובת זו נכשל",
        details: err.message
      });
    }
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

    // Server-side robust validation
    if (!fullName || typeof fullName !== "string" || !fullName.trim()) {
      return res.status(400).json({ 
        status: "error", 
        message: "נא להזין שם מלא תקין." 
      });
    }

    const numericAmount = Number(amount);
    if (!amount || isNaN(numericAmount) || numericAmount <= 0) {
      return res.status(400).json({ 
        status: "error", 
        message: "סכום התרומה חייב להיות מספר חיובי גדול מאפס." 
      });
    }
    
    // Default to the provided script URL if ENV is missing
    const scriptUrl = process.env.GOOGLE_SCRIPT_URL || "https://script.google.com/macros/s/AKfycbyhaHgl__FJ3BTeSNOwhdhPm-mZYEgdPjNuds1dUzqwFLtOE8KRho8eV_r05PJ_ttfH/exec";
    console.log(`[Spreadsheet] Using Script URL starting with: ${scriptUrl.substring(0, 35)}...`);
    
    // Trigger SMS notification was paused for now at user request
    /*
    sendAdminSMS(numericAmount, fullName, source).catch(err => {
      console.error("[SMS] Background SMS send error:", err);
    });
    */

    try {
      console.log(`[Spreadsheet] Attempting to save donor: ${fullName.trim()} (${numericAmount} NIS)`);
      
      const payload = {
        date: new Date().toLocaleString("he-IL", { timeZone: "Asia/Jerusalem" }),
        fullName: fullName.trim(),
        email: email || "N/A",
        amount: numericAmount,
        source: source || "תרומה רגילה"
      };

      const result = await executeGoogleScriptCall(scriptUrl, payload);
      
      console.log(`[Spreadsheet] Response from script:`, result);
      
      return res.json({ 
        status: "success", 
        method: "apps-script",
        scriptResponse: result
      });

    } catch (error: any) {
      console.error("[Spreadsheet] Critical Error:", error.message);
      
      let errorMessage = "Failed to save to Google Sheets via Script";
      let details = error.message;

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
