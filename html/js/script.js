(function startBot(){
			const elem = document.getElementsByTagName('div')[0];
			const socket = new WebSocket("ws://127.0.0.1:8080");

			socket.onopen = function(e) {
				console.log("[open] Соединение установлено");// это переделать в сообщение серверу о боте(пожтвердить логин) может ему надо будет приделать свой собственный вебсокет? почитатьб 
				// socket.send("Меня зовут Джон");
			};

			socket.onmessage = function(event) {
				// console.log({event});
				if (event.data=='user-pass') {
					console.log('prb here??')
					
					document.getElementsByClassName('user-pass')[0].classList.add('visible');
					document.getElementsByTagName('button')[0].onclick=()=>{
						const userLog = document.getElementsByTagName('input')[0].value
						const userPassword = document.getElementsByTagName('input')[1].value
						//НЕ ПРОХОДИТ УСЛОВИЕ ТК JSON НЕВАЛИДНЫЙ

						//Поправил!!
						console.log(JSON.stringify({userLog,userPassword}));
						socket.send(
							JSON.stringify({userLog,userPassword})
							);
					}

				} else if (event.data=='phone-pass') {
					document.getElementsByClassName('phone-pass')[0].classList.add('visible');
					document.getElementsByTagName('button')[1].onclick=()=>{
						const nonePass = 'none-pass'
						socket.send(
								JSON.stringify({nonePass})
								);
					}
					document.getElementsByTagName('button')[2].onclick=()=>{
						const phonePass = document.getElementsByTagName('input')[2].value
						socket.send(
								JSON.stringify({phonePass})
								);
					}
				} else if (event.data=='requested') {
					document.getElementsByClassName('requested')[0].classList.add('visible');
				} else if (event.data=='done'){
					document.getElementsByClassName('requested')[0].classList.remove('visible');
					document.getElementsByClassName('user-pass')[0].classList.remove('visible');
					document.getElementsByClassName('phone-pass')[0].classList.remove('visible');
					document.getElementsByClassName('requested')[0].classList.add('visible');
				} else if (event.data=='wrong_phone_code'){
					document.getElementsByClassName('wrong_phone_code')[0].classList.add('visible');
				} else if (event.data=='done'){
					socket.close()
				}


					
			};

			socket.onclose = function(event) {
				if (event.wasClean) {
					alert(`[close] Соединение закрыто чисто, код=${event.code} причина=${event.reason}`);// что это такое??
				} else {
					alert('[close] Соединение прервано');
				}
			};

			socket.onerror = function(error) {
				alert(`[error] ${error.message}`);
			};
			// 	const xhr = new XMLHttpRequest();// все переписываю по веб сокет?? или в сервере надо его без передачи сервера открывать?
			// 	xhr.open('GET','./new-bot');
			// 	xhr.onload = (e)=>{
			// 		console.log(e);
			// 		console.log(JSON.parse(e));
			// 	};
			// 	xhr.send();
			const botStart = ()=>{
				console.log('Bot starting');
				socket.send("start");
				elem.removeEventListener('click',botStart);
			}
			elem.addEventListener('click',botStart);
		})();