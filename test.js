const pptr = require('puppeteer');
const fs = require('fs');

(async ()=>{
	const browser = await pptr.launch({headless:false,});
	const page = await browser.newPage();
	const browserWSEndpoint = browser.wsEndpoint();
	await fs.appendFile('message.txt',browserWSEndpoint,(err)=>{
		if (err) throw err
	})
	browser.disconnect()
	// console.log(test);
	// console.log(test.a);

})()