const puppeteer = require('puppeteer');
require('dotenv').config();
const express = require('express');

const app = express();

app.get('/', (req, res)=>{
(async () => {
	const browser = await puppeteer.launch({ args: ['--no-sandbox','--disable-setuid-sandbox'], headless: true});
	console.log('Browser opened');
	const page = await browser.newPage(); 
	await page.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36');
	const USERNAME_SELECTOR = '#identifierId';
	const BUTTON_SELECTOR1 = '#identifierNext > div.ZFr60d.CeoRYc'
	const PASSWORD_SELECTOR = '#password > div.aCsJod.oJeWuf > div > div.Xb9hP > input'
	const BUTTON_SELECTOR2 = '#passwordNext > div.ZFr60d.CeoRYc'
  	await page.goto('https://accounts.google.com/signin/v2/identifier?flowName=GlifWebSignIn&flowEntry=ServiceLogin', {waitUntil: 'networkidle2'});
	await page.waitFor(3000);
	console.log('Selecting username');
	await page.waitForSelector(USERNAME_SELECTOR);	
	await page.click(USERNAME_SELECTOR);
	await page.keyboard.type(process.env.GMAIL_USERNAME);
	await page.click(BUTTON_SELECTOR1);
	console.log('fINISHED username');
	await page.waitFor(3000);
	console.log('Selecting password');
	await page.click(PASSWORD_SELECTOR);
	await page.keyboard.type(process.env.GMAIL_PASSWORD);
	await page.click(BUTTON_SELECTOR2);
	await page.waitFor(3000);
	await page.goto(process.env.COLAB_URL);
	console.log('success');
	for (let  i = 0; i<=10;i++)
		await page.keyboard.press('ArrowDown');
	await page.waitFor(300000);
	await browser.close();
	console.log('Browser Closed');
	
})();
	res.end('<html><head></title></head><body><h1>Browser is running. You gotta chill Bro...</img></h1></body></html>');
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Colab app listening on port ${port}!`))
