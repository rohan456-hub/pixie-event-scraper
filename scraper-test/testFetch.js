const axios = require("axios");
const cheerio = require("cheerio");

async function getBMSData() {
  const res = await axios.get("https://in.bookmyshow.com/explore/performances-surat");
  const $ = cheerio.load(res.data);

  const events = [];

  $(".sc-eclipse-title").each((i, el) => {
    const title = $(el).text().trim();
    events.push({ title });
  });

  console.log(events);
}

getBMSData();
