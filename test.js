const pptr = require('puppeteer');

(async ()=>{
	const browser = await pptr.launch({headless:false,});
	const page = await browser.newPage();

	const test = await page.evaluate(
		()=>{
			const test= function (){
		       	console.log(this)
		       	this.test = true
		       	return true
		    };
		   	return  test()

		}
	)

	console.log(test);
	// console.log(test.a);

})()