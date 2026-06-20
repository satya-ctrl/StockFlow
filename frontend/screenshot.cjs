const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    headless: "new",
    defaultViewport: { width: 1920, height: 1080 }
  });
  const page = await browser.newPage();
  
  try {
    // Navigate to register page
    await page.goto('http://localhost:5173/register', { waitUntil: 'networkidle2' });
    
    // Fill out registration
    const uniqueEmail = `test_${Date.now()}@example.com`;
    await page.type('input[type="email"]', uniqueEmail); // Email
    await page.type('input[type="password"]', 'password123'); // Password
    await page.click('button[type="submit"]');
    
    // Wait for navigation to login
    await page.waitForNavigation({ waitUntil: 'networkidle2' });

    // Fill login
    await page.type('input[type="email"]', uniqueEmail); // Email
    await page.type('input[type="password"]', 'password123'); // Password
    await page.click('button[type="submit"]');

    // Wait for navigation to dashboard
    await page.waitForNavigation({ waitUntil: 'networkidle0' });
    
    // Wait 4 seconds for the eruption animation to finish and the data to load
    await new Promise(r => setTimeout(r, 4000));
    
    // Take an HD screenshot
    await page.screenshot({ path: 'public/dashboard-preview.png', fullPage: false });
    
    console.log('HD Screenshot successfully captured!');
  } catch (error) {
    console.error('Error taking screenshot:', error);
  } finally {
    await browser.close();
  }
})();
