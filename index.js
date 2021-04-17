const pptr = require('puppeteer');
const callback = require('./bot/app.js');
const http = require('http'),
iPhone = pptr.devices['iPhone X'],
fs = require('fs'),
WebSocket = require('ws'),
server = http.createServer((req,res)=>{
	if (req.url==='/'||req.url==='/index.html'||req.url==='/index'||req.url==='/index.htm') {
		console.log(req.url);
		fs.readFile('./html/index.html','utf-8',(err, data) => {
  			if (err) {throw err}
  			// console.log(data);
  			res.writeHead(200, { 'Content-Type': 'text/html'});
			res.write(data,()=>{
				console.log('not fuck')
			});
			console.log('end response');
				res.end();
		});
	} else if (req.url==='/css/style'||req.url==='/css/style.css'){
		fs.readFile('./html/css/style.css','utf-8',(err, data) => {
  			if (err) {throw err}
  			res.writeHead(200, { 'Content-Type': 'text/css'})
  			
  			res.write(data)
  			res.end()
  			})

	} else if (req.url==='/js/script'||req.url==='/js/script.js'){
		fs.readFile('./html/js/script.js','utf-8',(err, data) => {
  			if (err) {throw err}
  				res.writeHead(200, { 'Content-Type': 'text/javascript'})
  				res.write(data)
  				res.end()
  			})

	} else {
		res.end(`Error 404\n${req.url} is not found`,{'Content-Type':'text/plain'});
		console.log('404')
	}
}),
wss = new WebSocket.Server({ server });//websocket тут надо прикрутить получение данных для бота

//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//!!!!!!!!!!!!!!!!!	TO DO  const browserWSEndpoint = browser.wsEndpoint();!!!!!!!!!!!!!
//!!!!!!!!!!!!!!!!! const browser2 = await puppeteer.connect({browserWSEndpoint});!!!!!
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!


wss.on('connection', async function connection(ws) {
    const browser = await pptr.launch({headless:false,});
    const browserWSEndpoint = browser.wsEndpoint();
	const page = await browser.newPage();
    await page.emulate(iPhone);
    await page.setGeolocation({latitude: 50.266383, longitude: 28.677781});
  ws.on('message', async function incoming(message) {
    console.log('str 59  received: %s', message);
  	if (message=='start') {
  		await page.goto('https://www.instagram.com', {waitUntil: 'networkidle2'});
  		//
  		//
  		//
  		//
  		//
  		//перенести в отдельный док скрипты страницы
  		//
  		//
  		//
  		//
  		//
  		//
  		//
  		const buttonLogin = await page.evaluate(()=>{//смотрю за кнопку которая создается до формы с логином и паролем
			try{
				let butt = document.getElementsByTagName('button');
				for (button of butt){
				    if(button.innerText=="Войти"){
				        button.click()
				    }
				}
				
			}catch(e){
				return false
			}
		});
		// if (buttonLogin) {// ищу кнопку запуска
		// 	await page.waitForTimeout({delay:700});
		// 	await page.click('#4o598n7yn4p98', {delay:600});
		// }
		// //
  		// w send "ready"
  		//
  		await ws.send('user-pass');	
  	} else{
  		const msg= JSON.parse(message)
  		console.log('\n else\r\n')


	  	if (msg.userLog&&msg.userPassword) {

	  		await console.log('str 69   received: %s user Pass', msg.userLog);
	  		await console.log('str 70   received: %s user Pass', msg.userPassword);		
	  		await ws.send(`ws from server ${msg.userLog}`);

	  		let iLog =''
	  		let iPass = ''
	  		//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
	  		//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
	  		await fs.readFile('./users/usersData.json','utf-8',(err, data) => {//заменить на запись в базу а не чтение из нее!!!!!!!!!!!!!!
			  	//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
	  		//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
			  	if (err) {throw err}
			  	// console.log(data,'\n\n')
			  	let users = JSON.parse(data).users
			  	let user = users['user']
			  	// console.log(users,'\n\n')
			  	console.log(user)
			  	iLog = user.instagram.login
			  	iPass = user.instagram.password
			  	console.log(iLog,iPass)
			})

	  		await page.click(`input[type=text]`/*${inputs}`*/, {delay:800}).then(()=>{
	  			console.log('\n aaaaaaa!!!\r\n')
	  		})
			await page.keyboard.type(iLog,{delay:700});//добавить login
			await page.click(`input[type=password]`/*${inputs}`*/, {delay:800}).then(()=>{
	  			console.log('\n Pass!!!\r\n')
	  		})
			await page.keyboard.type(iPass,{delay:500});//добавить login
			await page.waitForTimeout({delay:700});
			await page.click(`button[type=submit]`, {delay:500});
			await page.waitForTimeout({delay:700});
			try{
				await page.waitForSelector(`input[type=tel]`,{visible:true})
				ws.send('phone-pass')
				// const verificationCode = await funcc; тут короче ждем события которое будем эмитить при получении данных от пользователя
				//все следующие действия будут происходить только после того как сервер вызовет функцию и она будет давать инфу хз событие ил прочая хрень, типо такого
				//aaaaaaaaaaa
				//function to get user pass from e-mail or phone
				//aaaaaaaaaa
			}catch(e){
				//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
				//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
				//write log!!!!
				//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
				//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
			}
		}
		if (msg.nonePass) {
			console.log('wana click')
			await page.click('button > div',{delay:700})
			ws.send('requested')
		}
		if (msg.phonePass) {
			await page.click(`input[type=tel]`, {delay:700});//if dont work try /*name=verificationCode*/
			await page.keyboard.down('Shift');
			await page.waitForTimeout(800);
			await page.keyboard.press('KeyA');
			await page.waitForTimeout(1300);
			await page.keyboard.up('Shift');
			await page.waitForTimeout(700);
			await page.evaluate(()=>{
				const config={
					childList:true,
					subtree:true,
					attributes:true
				},
				observer_callback= (muationList)=>{
					muationList.forEach((mutation)=>{
						if (mutation.target.innerText.includes('Сохранить данные')) {
							
							oserver.disconnect()
						}
						if (mutation.target.innerText.includes('')) {
							//searching for 'incorrect input' highlighted text 

							oserver.disconnect()
						}
					})
				},
				observer= new MutationObserver(observer_callback);

				oserver.observe(document.body,config)

			});
			await page.keyboard.type(msg.phonePass,{delay:700});
			await page.waitForTimeout(1000);
			await page.click(`button[type=button]`, {delay:700});
//сука !!! тупой блять !!! как проверку н не правильный код делаешь ваааааааааа!!!!!
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// берешь input[type=tel] и еще раз ищещь перепиши нахуй нормально
			const bot_finally_login = ()=>{

				try{
					await page.waitForTimeout(3000);
					// if(button_still_here){
					// 	await page.waitForTimeout(3000);
					// 	ws.send('wrong_phone_code')
					// } else{
						await page.reload({waitUntil:networkidle2}).then(async()=>{//тайм аут до этого момента слишком рано срабатывает, надо либо увеличить его, либо что лучше 
							//импользовать MutationObserver
							const button_still_here= await page.evaluate(()=>{
							console.log(document.querySelector(`button[type=button]`).innerText.includes('Подтвердить'))
							return document.querySelector(`button[type=button]`).innerText.includes('Подтвердить')
								});
							if(button_still_here){
								ws.send('wrong_phone_code')
							} else{
								callback.start(browserWSEndpoint)
							}

						})

						// await page.waitForSelector(`input[type=tel]`,{visible:true})
						// await page.click('button[type=button]',{delay:700})
						// try{
						// 	const save_data_req= await page.evaluate(()=>{
						// 		const butt = document.getElementsByTagName('button')[0]
						// 		if(butt.innerText.includes('Сохранить данные')){
						// 			return true
						// 		}
						// 		if(butt.innerText.includes("Не сейчас")){
						// 			return true
						// 		}
						// 	})
						// 	if(save_data_req){
						// 		console.log('norm')
						// 		await page.click('button')
						// 		ws.send('done')
						// 		callback.start(browserWSEndpoint)
								
						// 	}
						// } catch(err){
						// 	console.warn('>> second try: \n'+ err)
						// }
					// }
					
					
				} catch(err){
					console.warn('>> first try: \n'+ err)
					//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
					//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
					//write log!!!!
					//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
					//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
				}
			}
			



	  		/*await page.keyboard.type(msg.userLog,{delay:1000}).then(()=>{
	  			callback.start(browserWSEndpoint);
	  		});*/

	  	}

  	}
    // ws.send(`ws from server ${message}`);
  });

  ws.send('connection stable');
});

server.listen(8080,'127.0.0.1',()=>{
	// console.log('host')
});



//document.cookie.replace(document.cookie,'')
//document.cookie= userCookie