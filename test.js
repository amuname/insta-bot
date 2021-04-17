const pptr = require('puppeteer');

(async ()=>{
	const browser = await pptr.launch(/*{headless:false,}*/);
	const page = await browser.newPage();

	const test = await page.evaluate(
		{a:function(){
			this.a = true;

		}
	})

	console.log(test);
	console.log(test.a);

})()