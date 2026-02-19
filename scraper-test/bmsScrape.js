const puppeteer = require("puppeteer");
const XLSX = require("xlsx");
const fs = require("fs");
const path = require("path");


const DATA_PATH = path.join(__dirname, "events.json");
const PUBLIC_DIR = path.join(__dirname, "public");

async function scrapeBMS(city = "surat") {
  console.log(`[${new Date().toLocaleString()}] Scraping started for: ${city}`);

  let browser;

  try {
    // Browser launch settings (Render.com ke liye bhi compatible hai)
    browser = await puppeteer.launch({ 
      headless: "new",
      args: ["--no-sandbox", "--disable-setuid-sandbox"] 
    });

    const page = await browser.newPage();

    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    );

    // BookMyShow page load
    await page.goto(
      `https://in.bookmyshow.com/explore/performances-${city}`,
      { waitUntil: "networkidle2", timeout: 60000 }
    );

    // Wait for event cards
    await page.waitForSelector("a[href*='/events/']", { timeout: 15000 });

    const scrapedEvents = await page.evaluate((cityName) => {
      const data = [];
      const elements = document.querySelectorAll("a[href*='/events/']");
      
      elements.forEach(el => {
        const title = el.querySelector("h3")?.innerText || el.innerText;
        const link = el.getAttribute("href");
        
        // FILTER: Movies ko hatane ke liye simple logic
        const isMovie = title.includes("2D") || title.includes("3D") || title.includes("IMAX");

        if (title && title.trim().length > 5 && link && !isMovie) {
          data.push({
            id: btoa(link).substring(0, 10),
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
    // STATUS UPDATE (Expiring logic)
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
    // SAVE DATA (JSON)
    // ============================
    fs.writeFileSync(DATA_PATH, JSON.stringify(mergedEvents, null, 2));

    // ============================
    // SAVE EXCEL (The Fix!)
    // ============================
    // 1. Agar public folder nahi hai toh bana do
    if (!fs.existsSync(PUBLIC_DIR)) {
      fs.mkdirSync(PUBLIC_DIR);
    }

    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(mergedEvents);
    XLSX.utils.book_append_sheet(workbook, worksheet, "Live Events");
    
    // Absolute path use kar rahe hain taaki error na aaye
    const excelFile = path.join(PUBLIC_DIR, "events.xlsx");
    XLSX.writeFile(workbook, excelFile);

    console.log(`✅ Excel file saved at: ${excelFile}`);
    console.log(`✅ Database Updated. Total Records: ${mergedEvents.length}`);
  
    return mergedEvents;

  } catch (err) {
    console.error("SCRAPER ERROR:", err.message);
    if (browser) await browser.close();
    return null;
  }
}

// Exporting
module.exports = { scrapeBMS };

// Self-run for testing
if (require.main === module) {
    scrapeBMS("surat");
}