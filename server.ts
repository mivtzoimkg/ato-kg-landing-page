import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API routes
  app.get("/api/test-sheets", async (req, res) => {
    const scriptUrl = process.env.GOOGLE_SCRIPT_URL;
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
    
    const scriptUrl = process.env.GOOGLE_SCRIPT_URL || "https://script.google.com/macros/s/AKfycbyhaHgl__FJ3BTeSNOwhdhPm-mZYEgdPjNuds1dUzqwFLtOE8KRho8eV_r05PJ_ttfH/exec";
    
    try {
      console.log(`Attempting to save donor via Script: ${fullName} (${amount} NIS)`);
      const response = await fetch(scriptUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        redirect: "follow", // CRITICAL for Google Apps Script
        body: JSON.stringify({
          date: new Date().toLocaleString("he-IL", { timeZone: "Asia/Jerusalem" }),
          fullName,
          email,
          amount,
          source: source || "תרומה רגילה"
        }),
      });
      
      if (response.ok) {
        console.log(`Successfully saved donor via Script: ${fullName}`);
        return res.json({ status: "success", method: "apps-script" });
      } else {
        const errorText = await response.text();
        console.error(`Apps Script Error (${response.status}):`, errorText);
        throw new Error(`Apps Script returned ${response.status}`);
      }
    } catch (error: any) {
      console.error("Error saving to Google Script:", error.message);
      res.status(500).json({ 
        status: "error", 
        message: "Failed to save to Google Sheets via Script",
        details: error.message 
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
