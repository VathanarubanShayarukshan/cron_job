const express = require("express");
const axios = require("axios");
const path = require("path");

const app = express();
app.use(express.json());

// 👉 static UI serve
app.use(express.static(path.join(__dirname, "public")));

let logs = [];

// 🔹 Hugging Face API URL
const API_URL = "https://sayarukshan-remote-cmd.hf.space/run";

// 🔹 function: API call செய்து log fetch பண்ண
async function fetchLog() {
    try {
        console.log("⏳ Sending request to API...");

        const res = await axios.post(API_URL, {
            cmd: "log" // ✅ IMPORTANT FIX
        });

        console.log("✅ API Response:", res.data);

        const logEntry = {
            time: new Date().toLocaleString(),
            data: res.data
        };

        logs.push(logEntry);

    } catch (err) {
        console.error("❌ ERROR:");
        console.error(err.response?.data || err.message);
    }
}

// 🔹 manual trigger
app.get("/api/run-log", async (req, res) => {
    await fetchLog();
    res.json({ status: "Log fetched & stored ✅" });
});

// 🔹 get logs
app.get("/api/logs", (req, res) => {
    res.json(logs);
});

// 🔹 clear logs
app.delete("/api/logs", (req, res) => {
    logs = [];
    res.json({ status: "Logs cleared 🧹" });
});

// 🔹 auto run every 30 minutes
setInterval(fetchLog, 30 * 60 * 1000);

// 🔹 server start
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running: http://localhost:${PORT}`);
});
