const fs = require('fs')

fs.readFile('usersData.json','utf-8',(err, data) => {
  	if (err) {throw err}
  		// console.log(data,'\n\n')
  		let users = JSON.parse(data).users
  		let user = users['user']
  		console.log(users,'\n\n')
  		console.log(user)
  	})