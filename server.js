import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

// 🔍 Debug API key (check Render logs)
console.log("Apollo API Key Loaded:", !!process.env.APOLLO_API_KEY);

// 🟢 Home route
app.get("/", (req, res) => {
  res.send("LMS Backend Running 🚀");
});


// ================================
// 🏢 COMPANY SEARCH API
// ================================
app.get("/api/search", async (req, res) => {
  try {
    const query = req.query.query;

    if (!query) {
      return res.status(400).json({ error: "Query is required" });
    }

    const response = await fetch("https://api.apollo.io/v1/mixed_companies/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Api-Key": process.env.APOLLO_API_KEY
      },
      body: JSON.stringify({
        q_organization_name: query,
        page: 1
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(500).json({
        error: "Apollo company search failed",
        details: data
      });
    }

    res.json(data);

  } catch (err) {
    console.error("Company search error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});


// ================================
// 👤 CONTACT SEARCH API
// ================================
app.get("/api/contacts", async (req, res) => {
  try {
    const query = req.query.query;

    if (!query) {
      return res.status(400).json({ error: "Query is required" });
    }

    const response = await fetch("https://api.apollo.io/v1/mixed_people/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Api-Key": process.env.APOLLO_API_KEY
      },
      body: JSON.stringify({
        q_organization_name: query,
        page: 1
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(500).json({
        error: "Apollo contact search failed",
        details: data
      });
    }

    res.json(data);

  } catch (err) {
    console.error("Contact search error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});


// ================================
// 🚀 PORT (RENDER SAFE)
// ================================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});