import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

// 🔍 Debug
console.log("Apollo Key Loaded:", !!process.env.APOLLO_API_KEY);

// 🟢 Health check
app.get("/", (req, res) => {
  res.send("LMS Backend Running 🚀");
});


// =====================================
// 🏢 COMPANY SEARCH (Apollo)
// =====================================
app.get("/api/search", async (req, res) => {
  try {
    const query = req.query.query;

    if (!query) {
      return res.status(400).json({ error: "Query required" });
    }

    const response = await fetch(
      "https://api.apollo.io/v1/mixed_companies/search",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Api-Key": process.env.APOLLO_API_KEY
        },
        body: JSON.stringify({
          q_organization_name: query,
          page: 1
        })
      }
    );

    const data = await response.json();

    res.json(data);
  } catch (err) {
    res.status(500).json({
      error: "Company search failed",
      message: err.message
    });
  }
});


// =====================================
// 🧠 LINKEDIN-STYLE ENRICHMENT ENGINE
// =====================================
app.get("/api/enrich", async (req, res) => {
  try {
    const company = req.query.company;

    if (!company) {
      return res.status(400).json({ error: "Company required" });
    }

    // Step 1: Apollo company data
    let apolloData = null;

    try {
      const response = await fetch(
        "https://api.apollo.io/v1/mixed_companies/search",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Api-Key": process.env.APOLLO_API_KEY
          },
          body: JSON.stringify({
            q_organization_name: company,
            page: 1
          })
        }
      );

      apolloData = await response.json();
    } catch (err) {
      console.log("Apollo company fetch failed:", err.message);
    }

    // Step 2: AI-style enrichment (LinkedIn simulation)
    const normalized = company.toLowerCase().replace(/\s/g, "");

    const enriched = {
      company: company,
      domain: `${normalized}.com`,

      decision_makers: [
        {
          role: "CEO",
          name: "Inferred CEO",
          confidence: "high"
        },
        {
          role: "CTO",
          name: "Inferred CTO",
          confidence: "medium"
        },
        {
          role: "Head of Sales",
          name: "Inferred Sales Head",
          confidence: "medium"
        },
        {
          role: "HR Head",
          name: "Inferred HR Head",
          confidence: "medium"
        }
      ],

      email_patterns: [
        `first.last@${normalized}.com`,
        `first@${normalized}.com`,
        `f.last@${normalized}.com`
      ],

      company_data: apolloData || null
    };

    res.json(enriched);

  } catch (err) {
    console.error("Enrich error:", err.message);
    res.status(500).json({
      error: "Enrichment failed",
      message: err.message
    });
  }
});


// =====================================
// 🚀 SERVER START
// =====================================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});