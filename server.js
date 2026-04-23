import dotenv from "dotenv";
dotenv.config();

import express from "express";
import fetch from "node-fetch";
import cors from "cors";

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

// Apollo test route
app.get("/api/test", async (req, res) => {
  try {
    const response = await fetch("https://api.apollo.io/v1/organizations/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.APOLLO_API_KEY}`
      },
      body: JSON.stringify({
        q_organization_name: "google"
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(500).json({
        error: "Apollo API error",
        details: data
      });
    }

    res.json(data);

  } catch (error) {
    console.error("Apollo error:", error);
    res.status(500).json({ error: "Failed to fetch from Apollo" });
  }
});

// IMPORTANT: Render-safe port
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});