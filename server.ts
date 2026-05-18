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

  app.post("/api/donors", async (req, res) => {
    const { fullName, email, amount, source } = req.body;
    
    // Default to the provided script URL if ENV is missing
    const scriptUrl = process.env.GOOGLE_SCRIPT_URL || "https://script.google.com/macros/s/AKfycbyhaHgl__FJ3BTeSNOwhdhPm-mZYEgdPjNuds1dUzqwFLtOE8KRho8eV_r05PJ_ttfH/exec";
    console.log(`[Spreadsheet] Using Script URL starting with: ${scriptUrl.substring(0, 35)}...`);
    
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
