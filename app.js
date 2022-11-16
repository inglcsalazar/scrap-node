import { chromium } from "playwright";

//generate result from Google

async function getResultsFromGoogle(query){
    const browser = await chromium.launch();
    const page = await browser.newPage();
    await page.goto('https://www.google.com/');
    await page.type('input[name="q"]',query);
    await page.keyboard.press('Enter');
    await page.waitForNavigation({ waitUntil: 'networkidle' });
}
