const puppeteer = require("puppeteer");
const XLSX = require("xlsx");
const fs = require("fs");
const path = require("path");

const DATA_PATH = path.join(__dirname, "events.json");

async function scrapeBMS(city = "surat") {
  console.log(`[${new Date().toLocaleString()}] Scraping started for: ${city}`);

  let browser;

  try {
  
    browser = await puppeteer.launch({ 
      headless: "new",
      args: ["--no-sandbox", "--disable-setuid-sandbox"] 
    });

    const page = await browser.newPage();

    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36"
    );

    // BookMyShow page load
    await page.goto(
      `https://in.bookmyshow.com/explore/performances-${city}`,
      { waitUntil: "networkidle2", timeout: 60000 }
    );

    // Wait for the specific event cards
    await page.waitForSelector("a[href*='/events/']", { timeout: 15000 });

    const scrapedEvents = await page.evaluate((cityName) => {
      const data = [];
      // Select only unique event cards
      const elements = document.querySelectorAll("a[href*='/events/']");
      
      elements.forEach(el => {
        const title = el.querySelector("h3")?.innerText || el.innerText;
        const link = el.getAttribute("href");
        
        // FILTER: Only Events, No Movies (Title check)
        // Movies usually have "2D", "3D", "IMAX" or specific durations
        const isMovie = title.includes("2D") || title.includes("3D") || title.includes("IMAX");

        if (title && title.trim().length > 5 && link && !isMovie) {
          data.push({
            id: btoa(link).substring(0, 10), // Short unique ID for analytics
            title: title.trim(),
            url: link.startsWith('http') ? link : "https://in.bookmyshow.com" + link,
            city: cityName,
            scrapedAt: new Date().toISOString(),
            status: "active"
          });
        }
      });

      return data;
    }, city);

    await browser.close();
    console.log(`Found ${scrapedEvents.length} raw events.`);

    // ============================
    // DEDUPLICATION & MERGING
    // ============================
    let existing = [];
    if (fs.existsSync(DATA_PATH)) {
      existing = JSON.parse(fs.readFileSync(DATA_PATH));
    }

    const map = new Map();
    
    existing.forEach(event => map.set(event.url, event));
    
    
    scrapedEvents.forEach(event => {
        if (!map.has(event.url)) {
            map.set(event.url, event);
        }
    });

    let mergedEvents = Array.from(map.values());

    // ============================
    // STATUS UPDATE (Analytics Logic)
    // ============================
    const now = Date.now();
    mergedEvents = mergedEvents.map(event => {
      const age = now - new Date(event.scrapedAt).getTime();
      return {
        ...event,
        status: age > 1000 * 60 * 60 * 24 ? "expired" : "active"
      };
    });

    // ============================
    // SAVE DATA
    // ============================
    fs.writeFileSync(DATA_PATH, JSON.stringify(mergedEvents, null, 2));

    // Save Excel
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(mergedEvents);
    XLSX.utils.book_append_sheet(workbook, worksheet, "Live Events");
    XLSX.writeFile(workbook, `./public/${city}_events.xlsx`); // Save to public for easy download

    console.log(`✅ Database Updated. Total Records: ${mergedEvents.length}`);
    
    // ============================
    // GOOGLE SHEETS SYNC (OPTIONAL)
    // ============================
    // syncToGoogleSheets(mergedEvents); 

    return mergedEvents;

  } catch (err) {
    console.error("SCRAPER ERROR:", err.message);
    if (browser) await browser.close();
    return null;
  }
}

// Exporting so server.js can trigger it via Cron
module.exports = { scrapeBMS };

// Self-run for testing
if (require.main === module) {
    scrapeBMS("surat");
}