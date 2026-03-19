const express = require("express");
const axios = require("axios");
const path = require("path");

const app = express();
app.use(express.json());

// static UI serve பண்ண
app.use(express.static(path.join(__dirname, "public")));

let logs = [];

// 🔹 API call function
async function fetchLog() {
    try {
        const res = await axios.post(
            "https://sayarukshan-remote-cmd.hf.space/run",
            { text: "log" }
        );

        const logEntry = {
            time: new Date().toLocaleString(),
            response: res.data
        };

        logs.push(logEntry);

        console.log("Log fetched ✅");
    } catch (err) {
        console.error("Error ❌", err.message);
    }
}

// 🔹 manual trigger
app.get("/api/run-log", async (req, res) => {
    await fetchLog();
    res.json({ status: "Log fetched ✅" });
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

// 🔹 auto fetch every 30 min
setInterval(fetchLog, 30 * 60 * 1000);

// 🔹 server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running: http://localhost:${PORT}`);
});