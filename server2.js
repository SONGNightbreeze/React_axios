const express = require('express')
const app = express()

app.use((request,response,next)=>{
	console.log('server2 is requested');
	next()
})

app.get('/cars',(request,response)=>{
	const cars = [
		{id:'001',name:'benz',price:199},
		{id:'002',name:'bmw',price:109},
		{id:'003',name:'audi',price:120},
	]
	response.send(cars)
})

app.listen(5001,(err)=>{
	if(!err) console.log('Server 2 started successfully,address：http://localhost:5001/cars');
})
