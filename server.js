import dotenv from "dotenv";
dotenv.config();

import express from "express";
import fetch from "node-fetch";
import cors from "cors";

console.log("API KEY:", process.env.APOLLO_API_KEY);

const app = express();
app.use(cors());

// test root
app.get("/", (req, res) => {
  res.send("Backend working");
});

// apollo test
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
    console.log(data);

    res.json(data);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch from Apollo" });
  }
});

app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});