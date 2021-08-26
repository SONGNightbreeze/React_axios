# React AJAX - notes
----------------------------------        
* React is only focused on the interface and does not send ajax requests
* the front-end application needs to interact with the backend by ajax requests (json data)
*  the react application needs to integrate ajax library
        ajax request libraries
      * jQuery: not recommended
      
                React aims to minimise its own manipulation of the DOM, while jQuery is used exclusively to manipulate the DOM
      * axios:   
      	* Wrap XMLHttpRequest object in ajax
      	* promise style , Can be used on browser and node server

**install axios  ==> yarn add axios**

### how to use axios in staging
```
import axios from 'axios'
// define the function 
getStudentData = () =>{
        // To send a request by axios
        // The request is sent to a prepared server http://localhost:5000/students
        // test proxy server is built with nodejs+espress     file => server1.js
        //axios.get('http://localhost:5000/students').then    error,cause crossdomain 
        //Set proxy to resolve crossdomain after address to change port 3000
        axios.get('http://localhost:3000/api1/students').then(
                response => {console.log('succeed',response.data);},
                error => {console.log('failed',error);}
        )
}
getCarData = ()=>{
	axios.get('http://localhost:3000/api2/cars').then(
		response => {console.log('succeed',response.data);},
		error => {console.log('failed',error);}
	)
}
render() {
	return (
		<div>   
			<button onClick={this.getStudentData}>hit get data of student</button>
			<button onClick={this.getCarData}>hit get data of car</button>
		</div>
	)
}
```

#### how to solve cross-domain at axios
  
* With the server address ttp://localhost:5000/students
  request in axios
  axios.get('http://localhost:5000/students').then
  error, Access-Control-Allow-Origin means cross domain error

* The current location http://localhost:3000 wants to 
  give server1 http://localhost:5000/ students send request  
  first of all we need to know   
  Because of cross domain, is ajax not able to send, or ajax can send but data can't be returned?  
  Can send but the data doesn't come back because I  back to the server1 and check the display under the terminal, it shows that someone requested the server 1

* How to solve the problem - proxy  
  The proxy is also open on port 3000 and located at http://localhost:3000  
  It also sends a request to the proxy on port 3000 and then sends it to http://localhost:5000/students  
  When receiving, the proxy can also receive, because the proxy does not have an ajax engine,   
  the essence of the problem of cross-domain is that the ajax engine blocks the response  
  So using the proxy can receive the data


---------------------------------------------------------------


# How to use proxy to resolve cross-domain issues: two methods

## Method 1.

> package.json

```json
// Write the server address where you want to forward the request to http://localhost:5000
"proxy":"http://localhost:5000" 
```

  1. easy to configure, without any prefixes.
  2. multiple proxies cannot be configured

```
// axios.get() sends the requested data directly to the proxy
axios.get('http://localhost:3000/students').then
```

we can try axios.get('http://localhost:3000/index.html').then

Instead of getting the student data, you get the public/index.html file under staging, 
which is the index.html under 3000 that was requested
so the public file is the root path of the server on port 3000

If you try it to axios.get('http://localhost:3000/index2.html').then  
report an error because there is no index2.html file in public under the root path of port 3000.  
then the server1.js is requested again, and the server terminal shows that it was requested.  
Because the public is not found on port 3000, it automatically goes to server1.js on port 5000 to find it.  

the principle of configuring the proxy is that if there is no data on port 3000, then it will look for data on port 5000.  


## Method 2.

1. create file of proxy   src/setupProxy.js


2. setupProxy.js (syntax rules：commonjs)

   ```js
   const proxy = require('http-proxy-middleware')
   // Expose an object to configure a function 
   module.exports = function(app) {
     app.use(
        //All requests with the /api1 prefix will be forwarded to 5000
       proxy('/api1', {  
        //Configure the address 
         target: 'http://localhost:5000',
         //Controls the value of the host field in the request header 
         changeOrigin: true, 
         /*
             changeOrigin: 
                true, the server receives a request with the host in the header: localhost:5000
                false, the server receives a request with the host in the header: localhost:3000
         	The default value is false, the value is usually set to true.
         */
        
        // Remove request prefixes
         pathRewrite: {'^/api1': ''} 
       }),
       // configure another request file
       proxy('/api2', { 
         target: 'http://localhost:5001',
         changeOrigin: true,
         pathRewrite: {'^/api2': ''}
       })
     )
   }
   ```
   1. Multiple proxies can be configured, 
      allowing flexibility to control 
        whether requests go through the proxy.

        go through proxy
        axios.get('http://localhost:3000/api1/students')

        not go through proxy
        axios.get('http://localhost:3000/students')
   2. must be prefixed

