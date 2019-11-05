// const puppeteer = require('puppeteer');
const puppeteer = require("puppeteer-extra")
const pluginStealth = require("puppeteer-extra-plugin-stealth")
puppeteer.use(pluginStealth())

require('dotenv').config();
const express = require('express');

const app = express();

app.use(express.static(__dirname + '/public'));

app.get('/', (req, res)=>{
	(async () => {
		waitmsecs = Number(process.env.waitTime);
		ACCOUNTS = [[process.env.COLAB_URL1, process.env.GMAIL_USERNAME1, process.env.GMAIL_PASSWORD1, process.env.CODE_URL], 
		[process.env.COLAB_URL2, process.env.GMAIL_USERNAME2, process.env.GMAIL_PASSWORD2, process.env.CODE_URL],
		[process.env.COLAB_URL3, process.env.GMAIL_USERNAME3, process.env.GMAIL_PASSWORD3, process.env.CODE_URL]]
		for (let i = 0; i<process.env.ACCOUNTS; i++){
			const USERNAME_SELECTOR = '#identifierId'
			const BUTTON_SELECTOR1 = '#identifierNext > div.ZFr60d.CeoRYc'
			const PASSWORD_SELECTOR = '#password > div.aCsJod.oJeWuf > div > div.Xb9hP > input'
			const BUTTON_SELECTOR2 = '#passwordNext > div.ZFr60d.CeoRYc'
			
			const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox', `--proxy-server=${process.env.PROXY}`], headless: true, defaultViewport: null});
			// const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox', `--proxy-server=${process.env.PROXY}`], headless: false, defaultViewport: null});
			console.log('Browser opened');
			const page = await browser.newPage();
			await page.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36');
			const FILE = '#file-menu-button > div > div > div.goog-inline-block.goog-menu-button-caption'
			const SAVE = '#\\:h > div'
			await page.goto(ACCOUNTS[i][0]);
			await page.waitFor(waitmsecs);
			await page.waitFor(3000);
			console.log('Selecting username');
			// await page.waitForNavigation();
			await page.waitFor(waitmsecs);
			await page.waitForSelector(USERNAME_SELECTOR);
			await page.screenshot({path: __dirname +`/public/screenshot1${i}.png`});
			await page.click(USERNAME_SELECTOR);
			await page.keyboard.type(ACCOUNTS[i][1]);
			await page.click(BUTTON_SELECTOR1);
			console.log('Finished entering username and clicked NEXT');
			// await page.waitForNavigation();
			console.log('Selecting password');
			await page.waitFor(waitmsecs);
			await page.waitForSelector(PASSWORD_SELECTOR);
			await page.screenshot({path: __dirname +`/public/screenshot2${i}.png`});
			await page.click(PASSWORD_SELECTOR);
			await page.keyboard.type(ACCOUNTS[i][2]);
			await page.screenshot({path: __dirname +`/public/screenshot3${i}.png`});
			await page.click(BUTTON_SELECTOR2);
			console.log('Finished entering password and clicked LOGIN');
		
			await page.waitFor(3000);
			await page.screenshot({path: __dirname +`/public/screenshot4${i}.png`});
			console.log('success');

			await page.waitFor(3000);
			await page.screenshot({path: __dirname +`/public/screenshot5${i}.png`});
			
			await page.waitFor(20000);
			const sts = await page.evaluate(()=>{
				return document.querySelector("#connect > paper-button").innerText;
			});

			console.log(sts);
			
			if (sts != 'Busy' && process.env.RESUME != false){
				const incognito = await puppeteer.launch({args: ['--no-sandbox', '--incognito', '--disable-setuid-sandbox', `--proxy-server=${process.env.PROXY}`], headless: true, defaultViewport: null});
				// const incognito = await puppeteer.launch({args: ['--no-sanSdbox', '--incognito', '--disable-setuid-sandbox', `--proxy-server=${process.env.PROXY}`], headless: false, defaultViewport: null});
				const page1 = await incognito.newPage();
				// await page1.bringToFront();
				await page1.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36');
				await page1.goto(ACCOUNTS[i][3]);
				if (process.env.USE_GDRIVE) {
					ACCOUNTS[i][1] = process.env.GDRIVE_USERNAME
					ACCOUNTS[i][2] = process.env.GDRIVE_PASSWORD
				}
				await page.waitFor(waitmsecs);
				await page1.waitForSelector(USERNAME_SELECTOR);
				await page1.click(USERNAME_SELECTOR);
				await page1.keyboard.type(ACCOUNTS[i][1]);
				await page1.waitFor(3000);
				await page1.click(BUTTON_SELECTOR1);
				// console.log('Finished entering username and clicked NEXT');
				await page.waitFor(waitmsecs);
				// await page.waitForNavigation();
				// console.log('Selecting password');
				await page1.waitForSelector(PASSWORD_SELECTOR);
				await page1.click(PASSWORD_SELECTOR);
				await page1.keyboard.type(ACCOUNTS[i][2]);
				await page1.waitFor(3000);
				await page1.click(BUTTON_SELECTOR2);
				// console.log('Finished entering password and clicked LOGIN');
				// console.log('success');
				await page1.waitFor(10000);
				await page1.click("#submit_approve_access > div.ZFr60d.CeoRYc")
				await page1.waitFor(5000);
				const code = await page1.evaluate(()=>{
					return document.querySelector("#view_container > div > div > div.pwWryf.bxPAYd > div > div > div > form > span > section > div > div > div > div > div > textarea").innerHTML;
				});
				console.log(code);
				await incognito.close();

				await page.waitFor(10000);
				await page.keyboard.down('Control');
				await page.keyboard.press('F9');
				await page.keyboard.up('Control');
				await page.waitFor(30000);
				await page.keyboard.type(code);
				await page.waitFor(10000);
				await page.keyboard.press('Enter');		
				console.log('Ultimate Success');
			}
			await page.waitFor(30000);
			await page.waitForSelector(FILE);
			console.log('File Selector Found');
			await page.click(FILE);
			await page.waitForSelector(SAVE);
			console.log('Save selector found');
			await page.click(SAVE);
			await page.screenshot({path: __dirname +`/public/screenshot6${i}.png`});
			await page.waitFor(3000);
			const stat = await page.evaluate(()=>{
				return document.querySelector("#connect > paper-button").innerText;
			});

			console.log('colab saved sucessfully', stat);
			setTimeout(async()=>{
				await page.close();
				await browser.close();
				console.log('Browser Closed');
			}, 1440000);
			console.log('GOing for next ACCount');
		}
		console.log('All accounts opened...');
		
	})();
	res.end('<html><head></title></head><body><h1>Browser is running. You gotta chill Bro...</img></h1></body></html>');
});
app.get('/screenshot', (req, res)=>{
	res.end('<html><head></title></head><body><img src="screenshot10.png"></img><img src="screenshot20.png"></img><img src="screenshot30.png"></img><img src="screenshot40.png"></img><img src="screenshot50.png"></img><img src="screenshot60.png"></img><h1>NEXT</h1><img src="screenshot11.png"></img><img src="screenshot21.png"></img><img src="screenshot31.png"></img><img src="screenshot41.png"></img><img src="screenshot51.png"></img><img src="screenshot61.png"></img></body></html>');

})

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Colab app listening on port ${port}!`))