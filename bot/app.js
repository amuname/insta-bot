const pptr = require('puppeteer'),
fs = require('fs'),
errorlog = async (e)=>{
	e= `\n${ e }\n`
	await fs.open('log.log', 'r+', (err, fd) => {
  		if (err) {throw err}
  		fs.write(fd,e,()=>{fs.close(fd)})
	});


}
let endPoint={}

const main= async(browserWSEndpoint)=>{
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
		console.log('bot started')
		await page.click('body > div div[role=dialog] button:last-child').then(async ()=>{
			await page.waitForTimeout(5000).then(async()=>{
				await page.touchscreen.tap(100,30)
			})
		})
		const chat_id = await page.evaluate(()=>{// get all onpage messages in array, then return array of chat ID (CSS selectors) to use them in page.click() function 
			const onload_messages_arr= document.querySelectorAll('a[href*="direct/t"] > div :nth-child(3) > div');
			let arr_of_chats =[];
			for(current_chat of onload_messages_arr){
				const chat_id = current_chat.parentElement.previousElementSibling.firstElementChild.id
				arr_of_chats.push(chat_id)
			}
			console.log(arr_of_chats)
			return arr_of_chats
		})

		let id_counter=0;
		const check_message = async ()=>{
			if (chat_id.length!==id_counter) {
				await main_bot_function(chat_id[id_counter])


				id_counter++
				await check_message()
			}
			return 0
		}
	} catch(e){
		await errorlog(e)
	}
	await main()
}

const main_bot_function = async(id)=>{
	console.log(id)
}

exports.start = main;
