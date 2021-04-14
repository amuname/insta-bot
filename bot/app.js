const pptr = require('puppeteer'),
fs = require('fs'),
errorlog = async (e)=>{
	e= `\n e \n`
	await fs.open('log.log', 'r+', (err, fd) => {
  		if (err) {throw err}
  		fs.write(fd,e,()=>{fs.close(fd)})
	});


}
let endPoint={}

exports.start = async(browserWSEndpoint)=>{
	endPoint = browserWSEndpoint
	console.log('yap! it works@@ \n\n');
	let page;
	const browser = await pptr.connect({browserWSEndpoint});
	await browser.pages().then((target)=>{
		// console.log(target[0]);
		page = target[0];
	})
	try{
		await page.waitForTimeout(5000);

	} catch(e){
		await errorlog(e)
	}
}