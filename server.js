import dotenv from "dotenv";
dotenv.config();

import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

console.log("API KEY:", process.env.APOLLO_API_KEY);

// ✅ Root test
app.get("/", (req, res) => {
  res.send("Backend working 🚀");
});

// ✅ Basic test (Google)
app.get("/api/test", async (req, res) => {
  try {
    const response = await fetch("https://api.apollo.io/v1/organizations/search", {
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

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch from Apollo" });
  }
});

// ✅ Dynamic company search
app.get("/api/companies", async (req, res) => {
  try {
    const name = req.query.name || "google";

    const response = await fetch("https://api.apollo.io/v1/organizations/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Api-Key": process.env.APOLLO_API_KEY
      },
      body: JSON.stringify({
        q_organization_name: name
      })
    });

    const data = await response.json();

    // return only companies list
    res.json(data.organizations || []);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch companies" });
  }
});

// 🚀 Start server
app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});