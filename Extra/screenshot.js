const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function takeFullPageScreenshot(url, outputPath) {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle0' });

    // Scroll to the bottom of the page to load all content
    await autoScroll(page);

    // Take a screenshot of the entire page
    await page.screenshot({ path: outputPath, fullPage: true });

    await browser.close();
}

async function autoScroll(page) {
    await page.evaluate(async () => {
        await new Promise((resolve, reject) => {
            let totalHeight = 0;
            const distance = 100;
            const timer = setInterval(() => {
                const scrollHeight = document.body.scrollHeight;
                window.scrollBy(0, distance);
                totalHeight += distance;

                if (totalHeight >= scrollHeight) {
                    clearInterval(timer);
                    resolve();
                }
            }, 100);
        });
    });
}

async function takeScreenshotsOfLinks(url, outputDirectory) {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle0' });

    const links = await page.$$eval('a', links => links.map(link => link.href));

    for (let link of links) {
        try {
            const fileName = `${path.basename(link)}.png`;
            const outputPath = path.join(outputDirectory, fileName);

            await page.goto(link, { waitUntil: 'networkidle0' });
            await page.screenshot({ path: outputPath, fullPage: true });

            console.log(`Screenshot taken for ${link}`);
        } catch (error) {
            console.error(`Error taking screenshot for ${link}:`, error);
            continue; // Skip to the next link on error
        } finally {
            // Go back to the main page
            await page.goto(url, { waitUntil: 'networkidle0' });
        }
    }

    await browser.close();
}

// Example usage:
const url = 'http://192.168.49.2:30244';
const outputDirectory = './screenshots1';

// Create the output directory if it doesn't exist
if (!fs.existsSync(outputDirectory)) {
    fs.mkdirSync(outputDirectory);
}

// Take full-page screenshot of the main page
takeFullPageScreenshot(url, path.join(outputDirectory, 'main_page.png'))
    .then(() => console.log('Main page screenshot taken successfully'))
    .catch(error => console.error('Error taking main page screenshot:', error));

// Take screenshots of linked pages
takeScreenshotsOfLinks(url, outputDirectory)
    .then(() => console.log('Screenshots of linked pages taken successfully'))
    .catch(error => console.error('Error taking screenshots of linked pages:', error));
