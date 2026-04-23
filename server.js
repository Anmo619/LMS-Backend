import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

console.log("Apollo Key Loaded:", !!process.env.APOLLO_API_KEY);

// Health check
app.get("/", (req, res) => {
  res.send("LMS Backend Running 🚀");
});

// Apollo test
app.get("/api/test", async (req, res) => {
  try {
    const response = await fetch("https://api.apollo.io/v1/mixed_companies/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Api-Key": process.env.APOLLO_API_KEY
      },
      body: JSON.stringify({
        q_organization_name: "google"
      })
    });

    const data = await response.json();

    res.json(data);
  } catch (err) {
    console.error("Apollo error:", err.message);
    res.status(500).json({ error: "Apollo failed", message: err.message });
  }
});

// search route
app.get("/api/search", async (req, res) => {
  try {
    const query = req.query.query;

    const response = await fetch("https://api.apollo.io/v1/mixed_companies/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Api-Key": process.env.APOLLO_API_KEY
      },
      body: JSON.stringify({
        q_organization_name: query
      })
    });

    const data = await response.json();

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Search failed" });
  }
});

// IMPORTANT PORT FIX
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});