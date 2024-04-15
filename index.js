// EDIT THIS FILE TO COMPLETE ASSIGNMENT QUESTION 1
const { chromium } = require("playwright");
const fs = require('node:fs');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const { exit } = require("process");


async function saveHackerNewsArticles() {
  // launch browser
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  // go to Hacker News
  await page.goto("https://news.ycombinator.com");
  await page.waitForLoadState("networkidle");

  // obtain html of site
  const html = new JSDOM(await page.content());

  // parse html for 'titleline' which contains needed information
  var content = html.window.document.getElementsByClassName("titleline");
  for (var i = 0; i < 11; i++) {
    // parse 'titleline' for article title
    const articleTitle = content.item(i).querySelector("a").textContent;
    // parse 'titleline' for article link
    const articleLink = content.item(i).querySelector("a").toString();
    console.log(articleTitle);
    console.log(articleLink);
    const temp = `${articleTitle},${articleLink}\n`;

    // append title and link to csv file
    fs.appendFileSync("./question1.csv", temp, function (err) {
      if (err) throw err;
      console.log("Appended line\n");
    })
  }
}

// run function and exit once csv file is created
(async () => {
  await saveHackerNewsArticles();
  exit()
})();
