const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log('PAGE ERROR:', msg.text());
    }
  });

  page.on('pageerror', error => {
    console.log('PAGE EXCEPTION:', error.message);
  });

  page.on('requestfailed', request => {
    console.log('REQUEST FAILED:', request.url(), request.failure()?.errorText);
  });

  console.log('Navigating to http://localhost:8080/hr/educator-guide...');
  try {
    await page.goto('http://localhost:8080/hr/educator-guide', { waitUntil: 'networkidle2', timeout: 10000 });
  } catch (e) {
    console.log('Navigation ended:', e.message);
  }

  await browser.close();
  console.log('Done.');
})();
