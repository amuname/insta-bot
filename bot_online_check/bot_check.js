const fs = require('fs'),
pptr = require('puppeteer');

const db_read_bot_onlilne = async()=>{
	await fs.readFile('bot_online.txt', 'utf8', async (err,data)=>{
		if (err) throw err;
		if (data.includes('true')) {
			const browser = await pptr.connect({});
			await browser.close()
		}
		console.log(data);
	})


};

db_read_bot_onlilne()