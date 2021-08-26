import React, { Component } from 'react'
import axios from 'axios'

export default class App extends Component {

	getStudentData = ()=>{
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
				<button onClick={this.getStudentData}>hit get the information of student</button>
				<button onClick={this.getCarData}>hit get the information of car</button>
			</div>
		)
	}
}
