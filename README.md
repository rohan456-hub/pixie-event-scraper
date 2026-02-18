# Pixie Event Intelligence & Analytics Dashboard
**Developed by: Rohan Modi** 

A production-ready, full-stack system designed to automate the discovery, deduplication, and analysis of live events. Built to solve the challenge of manual event tracking.

---

## Key Features

- **Automated ETL Pipeline:** Uses Puppeteer to scrape live events with a self-healing headless browser configuration.
- **Smart Deduplication:** Implements a Map-based hashing algorithm to ensure zero data redundancy.
- **Advanced Filtering:** Logic-based filtering to isolate 'Events' from 'Movies' and 'Cinema' listings.
- **Lifecycle Management:** Automatically tracks event age and marks them as `Active` or `Expired` after 24 hours.
- **Real-time Analytics:** A live dashboard showing key performance indicators (KPIs) like total discovered events.
- **Operations Ready:** Built-in Excel synchronization for marketing and outreach teams.

## Tech Stack

- **Frontend:** React.js (Hooks, Functional Components)
- **Backend:** Node.js, Express.js
- **Scraping:** Puppeteer (Headless Browser)
- **Automation:** Node-Cron (Background Tasks)
- **Data Handling:** XLSX, File System (JSON Database)



##  System Architecture

```text
/project-root
├── bmsScrape.js       # The Scraper Engine (Logic by Rohan Modi)
├── Server.js          # Express API & Cron Job Scheduler
├── events.json        # Persistent JSON Database
├── /public            # Static assets & Generated Excel Reports
└── /frontend          # React Dashboard (Client-side)
