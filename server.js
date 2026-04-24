import dotenv from "dotenv";
dotenv.config();

import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

console.log("API KEY:", process.env.APOLLO_API_KEY);

// ======================
// ROOT ROUTE
// ======================
app.get("/", (req, res) => {
  res.send("Backend working 🚀");
});

// ======================
// CHECK ROUTE
// ======================
app.get("/check", (req, res) => {
  res.send("CHECK OK ✅");
});

// ======================
// COMPANY SEARCH
// ======================
app.get("/api/companies", async (req, res) => {
  try {
    const name = req.query.name || "google";

    const response = await fetch(
      "https://api.apollo.io/v1/organizations/search",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Api-Key": process.env.APOLLO_API_KEY,
        },
        body: JSON.stringify({
          q_organization_name: name,
        }),
      }
    );

    const data = await response.json();

    res.json(data.organizations || []);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch companies" });
  }
});

// ======================
// PEOPLE / CONTACTS SEARCH
// ======================
app.get("/api/people", async (req, res) => {
  try {
    const company = req.query.company || "google";

    const response = await fetch(
      "https://api.apollo.io/v1/people/search",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Api-Key": process.env.APOLLO_API_KEY,
        },
        body: JSON.stringify({
          q_organization_name: company,
        }),
      }
    );

    const data = await response.json();

    res.json(data.people || []);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch people" });
  }
});

// ======================
// START SERVER (RENDER SAFE)
// ======================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});