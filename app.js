import { chromium } from "playwright";

//generate result from Google
async function getResultsFromGoogle(query, browser){
    const page = await browser.newPage();
    await page.goto('https://www.google.com/');
    await page.type('input[name="q"]',query);
    await page.keyboard.press('Enter');
    await page.waitForNavigation({ waitUntil: 'networkidle' });

    const listResult = await page.evaluate(() => {
        let result = [];
        document.querySelectorAll('div [data-header-feature] div a')
            .forEach((anchor, index) => {
                result.push({
                    index: index,
                    title: anchor.innerText,
                    url: anchor.href
                });
            });
        return result;
    });

    return listResult;
}

//visit result and extract information
async function visitResultAndGetInformation(result, browser){
    const page = await browser.newPage();
    await page.goto(result.url);
    await page.waitForLoadState('domcontentloaded');

    const content = await page.evaluate(()=>{
        const rawText = document.querySelector("main")?.innerText || document.querySelector("body")?.innerText;
        return rawText;
    });
    return content;
}

//exec scraping in web
async function startScraping(query){
    const browser = await chromium.launch();
    const allTexts = [];
    const listResult = await getResultsFromGoogle(query, browser);

    //synchronous
    /*listResult.forEach(result => {
        visitResultAndGetInformation(result, browser)
    });*/

    //asynchronous
    for await(const url of listResult){
        const content = await visitResultAndGetInformation(url, browser);
        allTexts.push(content);
    }

    console.log(allTexts)
    await browser.close();
}

startScraping('node js')
