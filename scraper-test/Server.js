const express = require('express');
const cron = require('node-cron');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { scrapeBMS } = require('./bmsScrape'); 

const app = express();
const PORT = process.env.PORT || 5000;
const DATA_PATH = path.join(__dirname, "events.json");

app.use(cors());
app.use(express.static('public')); // Excel download ke 

// ============================
// 1. AUTOMATION (CRON JOB)
// ============================

cron.schedule('0 */6 * * *', async () => {
    console.log('--- Scheduled Cron Job: Starting Scraper ---');
    await scrapeBMS("surat");
});


app.get('/api/run-scraper', async (req, res) => {
    const data = await scrapeBMS("surat");
    if (data) res.json({ message: "Scraping successful", count: data.length });
    else res.status(500).json({ message: "Scraping failed" });
});

// ============================
// 2. ANALYTICS API
// ============================
app.get('/api/dashboard', (req, res) => {
    if (!fs.existsSync(DATA_PATH)) {
        return res.json({ events: [], stats: { total: 0, active: 0, expired: 0 } });
    }

    const events = JSON.parse(fs.readFileSync(DATA_PATH));
    
    // Simple Analytics Logic
    const stats = {
        total: events.length,
        active: events.filter(e => e.status === 'active').length,
        expired: events.filter(e => e.status === 'expired').length,
        lastUpdated: events.length > 0 ? events[events.length - 1].scrapedAt : null
    };

    res.json({ events, stats });
});



app.get('/api/sync-status', (req, res) => {
    res.json({ 
        status: "Excel Ready", 
        downloadUrl: "/surat_events.xlsx",
        cloudSync: "Enabled (Local File System)" 
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Cron Job scheduled for every 6 hours`);
});