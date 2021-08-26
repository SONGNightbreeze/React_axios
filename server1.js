const express = require('express')
const app = express()

app.use((request,response,next)=>{
	console.log('server1 is requested');
	console.log('request from',request.get('Host'));
	console.log('request address',request.url);
	next()
})

app.get('/students',(request,response)=>{
	const students = [
		{id:'001',name:'tom',age:18},
		{id:'002',name:'jerry',age:19},
		{id:'003',name:'tony',age:120},
	]
	response.send(students)
})

app.listen(5000,(err)=>{
	if(!err) console.log('Server1 started successfully,address：http://localhost:5000/students');
})
