import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import dotenv from "dotenv";
import axios from "axios";
import { randomUUID } from "crypto";

dotenv.config();

// מחלקת שגיאה מרכזית
class AppError extends Error {
  statusCode: number;
  isOperational: boolean;
  constructor(message: string, statusCode = 500, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
  }
}

// עוטף כל async route - שגיאה שנזרקת בפנים מגיעה אוטומטית ל-middleware
function asyncHandler(fn: (req: express.Request, res: express.Response, next: express.NextFunction) => Promise<any>) {
  return (req: express.Request, res: express.Response, next: express.NextFunction) => {
    fn(req, res, next).catch(next);
  };
}

// פונקציית עזר לקבלת משתנה סביבה חובה בזמן ריצה בלבד (Lazy Initialization)
function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new AppError(`חסר משתנה סביבה נדרש: ${name}. יש להגדיר אותו בהגדרות או בקובץ .env`, 500);
  }
  return value;
}

// תפיסת שגיאות לא צפויות ברמת התהליך
process.on("unhandledRejection", (reason) => {
  console.error("[Fatal] Unhandled promise rejection:", reason);
});
process.on("uncaughtException", (err) => {
  console.error("[Fatal] Uncaught exception:", err);
  process.exit(1);
});

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Middleware to attach requestId to each request
  app.use((req, res, next) => {
    (req as any).requestId = randomUUID().slice(0, 8);
    next();
  });

  // Helper to execute Google Apps Script requests with robust 302/JSON redirection handling
  async function executeGoogleScriptCall(requestId: string, url: string, payload: any) {
    try {
      console.log(`[${requestId}] [GoogleScript] Attempting native fetch post to: ${url}`);
      const resp = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload),
        redirect: "follow"
      });
      
      const text = await resp.text();
      console.log(`[${requestId}] [GoogleScript] Response status: ${resp.status}, content length: ${text.length}`);
      
      // Check if the response is actually a Google Sign-In redirect page, which happens on permission mismatch
      if (text.includes("Sign in") || text.includes("Google Accounts") || text.includes("login")) {
        throw new AppError("גוגל דורש התחברות (שגיאה 401/403). עליכם להגדיר את ה-doPost ב-Apps Script כבעל גישה ל-Anyone (כולל משתמשים אנונימיים). בלי זה, שרת גוגל חוסם קריאות חיצוניות.", 401);
      }
      
      try {
        const parsed = JSON.parse(text);
        if (parsed.status === "error" || parsed.error) {
          throw new AppError(parsed.message || parsed.error || "שגיאה פנימית בסקריפט גוגל", 502);
        }
        return parsed;
      } catch (jsonErr: any) {
        if (jsonErr instanceof AppError) {
          throw jsonErr;
        }
        if (!resp.ok) {
          throw new AppError(
            `גוגל שיטס החזיר סטטוס ${resp.status}: ${text.substring(0, 150)}`,
            502
          );
        }
        throw new AppError(
          `תשובת הגוגל שיטס אינה בפורמט JSON תקין. תוכן שהתקבל: ${text.substring(0, 150)}`,
          502
        );
      }
    } catch (err: any) {
      if (err instanceof AppError) {
        throw err;
      }
      console.warn(`[${requestId}] [GoogleScript] Native fetch failed: ${err.message}. Trying Axios with standard redirects.`);
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
            throw new AppError("גוגל דורש התחברות (שגיאה 401/403). עליכם להגדיר את ה-doPost ב-Apps Script כבעל גישה ל-Anyone (כולל משתמשים אנונימיים). בלי זה, שרת גוגל חוסם קריאות חיצוניות.", 401);
          }
          try {
            return JSON.parse(data);
          } catch {
            throw new AppError(`תשובת הגוגל שיטס אינה בפורמט JSON תקין. תוכן שהתקבל: ${data.substring(0, 150)}`, 502);
          }
        }
        return data;
      } catch (axiosErr: any) {
        if (axiosErr instanceof AppError) {
          throw axiosErr;
        }
        console.error(`[${requestId}] [GoogleScript] Axios fallback also failed:`, axiosErr.message);
        throw new AppError(err.message || axiosErr.message, 502);
      }
    }
  }

  // SMS notification helper function
  async function sendAdminSMS(requestId: string, amount: number, fullName: string, source: string) {
    const adminNumber = process.env.ADMIN_MOBILE_NUMBER;
    if (!adminNumber) {
      console.log(`[${requestId}] [SMS] ADMIN_MOBILE_NUMBER is not configured. SMS alert skipped.`);
      return;
    }

    const message = `איגוד תלמידי הישיבות: תרומה חדשה בסך ₪${amount} התקבלה מאת ${fullName} עבור ${source}`;
    console.log(`[${requestId}] [SMS] Sending notification to ${adminNumber}...`);

    // 1. Try ActiveTrail configuration if present (ActiveTrail SMS operational API)
    const activeTrailApiToken = process.env.ACTIVETRAIL_API_TOKEN;
    if (activeTrailApiToken) {
      try {
        console.log(`[${requestId}] [SMS] Attempting ActiveTrail Operational SMS delivery...`);
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
        console.log(`[${requestId}] [SMS] ActiveTrail SMS successfully sent! Response:`, activeTrailRes.data);
        return;
      } catch (err: any) {
        console.error(`[${requestId}] [SMS] ActiveTrail SMS delivery failed:`, err.response?.data || err.message);
      }
    }

    // 2. Try Twilio configuration if present
    const twilioSid = process.env.TWILIO_ACCOUNT_SID;
    const twilioToken = process.env.TWILIO_AUTH_TOKEN;
    const twilioFrom = process.env.TWILIO_FROM_NUMBER;

    if (twilioSid && twilioToken && twilioFrom) {
      try {
        console.log(`[${requestId}] [SMS] Attempting Twilio SMS delivery...`);
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
        console.log(`[${requestId}] [SMS] Twilio message successfully dispatched. SID: ${twilioRes.data?.sid}`);
        return;
      } catch (err: any) {
        console.error(`[${requestId}] [SMS] Twilio delivery failed:`, err.response?.data || err.message);
      }
    }

    // 3. Try Generic/Israeli SMS Gateway webhook (GET or POST) if present
    const gatewayUrl = process.env.SMS_GATEWAY_URL;
    if (gatewayUrl) {
      try {
        console.log(`[${requestId}] [SMS] Attempting SMS Gateway Webhook delivery...`);
        let finalUrl = gatewayUrl
          .replace(/\{\{NUMBER\}\}/g, encodeURIComponent(adminNumber))
          .replace(/\{\{MESSAGE\}\}/g, encodeURIComponent(message));

        const method = (process.env.SMS_GATEWAY_METHOD || 'GET').toUpperCase();
        let headers = {};
        if (process.env.SMS_GATEWAY_HEADERS_JSON) {
          try {
            headers = JSON.parse(process.env.SMS_GATEWAY_HEADERS_JSON);
          } catch (e) {
            console.error(`[${requestId}] [SMS] Failed to parse SMS_GATEWAY_HEADERS_JSON:`, e);
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
            console.error(`[${requestId}] [SMS] Failed to parse SMS_GATEWAY_BODY_JSON:`, e);
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
        console.log(`[${requestId}] [SMS] Gateway URL response status: ${gatewayRes.status}`);
        return;
      } catch (err: any) {
        console.error(`[${requestId}] [SMS] SMS Gateway Webhook delivery failed:`, err.response?.data || err.message);
      }
    }

    console.error(`[${requestId}] [SMS] All SMS providers failed or are unconfigured for admin notification.`);
  }

  // API Routes
  app.get("/api/test-sheets", asyncHandler(async (req, res) => {
    const rid = (req as any).requestId;
    const scriptUrl = requireEnv("GOOGLE_SCRIPT_URL");

    console.log(`[${rid}] [Diagnostic] Testing Google Script connection to: ${scriptUrl}`);
    const testPayload = {
      date: new Date().toLocaleString("he-IL", { timeZone: "Asia/Jerusalem" }),
      fullName: "בדיקת מערכת תקינות",
      email: "test@example.com",
      amount: 1,
      source: "חיבור בדיקה - אבחון עצמי"
    };

    const result = await executeGoogleScriptCall(rid, scriptUrl, testPayload);
    return res.json({
      status: "success",
      message: "השרת הצליח לשלוח קריאה ולקבל תשובה מגוגל!",
      googleResponse: result,
      info: "שרת האפליקציה הצליח ליצור קשר עם גוגל בהצלחה. אם המידע לא מופיע כראוי בגליון, ודאו שקוד ה-doPost בסקריפט שלכם נכון."
    });
  }));

  app.post("/api/donors", asyncHandler(async (req, res) => {
    const rid = (req as any).requestId;
    const { fullName, email, amount, source } = req.body;

    // Server-side robust validation
    if (!fullName || typeof fullName !== "string" || !fullName.trim()) {
      throw new AppError("נא להזין שם מלא תקין.", 400);
    }

    const numericAmount = Number(amount);
    if (!amount || isNaN(numericAmount) || numericAmount <= 0) {
      throw new AppError("סכום התרומה חייב להיות מספר חיובי גדול מאפס.", 400);
    }

    if (email !== undefined && email !== null) {
      if (typeof email !== "string" || (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))) {
        throw new AppError("כתובת האימייל אינה תקינה.", 400);
      }
    }

    if (source !== undefined && typeof source !== "string") {
      throw new AppError("שדה המקור (source) חייב להיות מחרוזת.", 400);
    }

    const scriptUrl = requireEnv("GOOGLE_SCRIPT_URL");
    console.log(`[${rid}] [Spreadsheet] Using Script URL starting with: ${scriptUrl.substring(0, 35)}...`);
    
    // Trigger SMS notification was paused for now at user request
    /*
    sendAdminSMS(rid, numericAmount, fullName, source).catch(err => {
      console.error(`[${rid}] [SMS] Background SMS send error:`, err);
    });
    */

    console.log(`[${rid}] [Spreadsheet] Attempting to save donor: ${fullName.trim()} (${numericAmount} NIS)`);
    
    const dateStr = new Date().toLocaleString("he-IL", { timeZone: "Asia/Jerusalem" });
    const payload = {
      // English keys
      date: dateStr,
      fullName: fullName.trim(),
      email: email || "N/A",
      amount: numericAmount,
      source: source || "תרומה רגילה",

      // Hebrew keys requested by the user
      "תאריך ושעה": dateStr,
      "שם": fullName.trim(),
      "מייל": email || "N/A",
      "סכום": numericAmount,
      "סוג": source || "תרומה רגילה"
    };

    const result = await executeGoogleScriptCall(rid, scriptUrl, payload);
    
    console.log(`[${rid}] [Spreadsheet] Response from script:`, result);
    
    return res.json({ 
      status: "success", 
      method: "apps-script",
      scriptResponse: result
    });
  }));

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

  // 404 - חייב לבוא אחרי כל ה-routes וחלוקת הנתיבים
  app.use((req, res) => {
    res.status(404).json({ status: "error", message: "הנתיב המבוקש לא נמצא" });
  });

  // error middleware מרכזי - חייב לבוא אחרון, עם 4 ארגומנטים בדיוק
  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    const rid = (req as any).requestId || "unknown";
    const statusCode = err instanceof AppError ? err.statusCode : 500;
    const isOperational = err instanceof AppError ? err.isOperational : false;

    console.error(`[${rid}] [Error] ${req.method} ${req.path}:`, err.message, isOperational ? "" : err.stack);

    res.status(statusCode).json({
      status: "error",
      message: isOperational ? err.message : "אירעה שגיאה בשרת. נסו שוב מאוחר יותר.",
    });
  });

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
