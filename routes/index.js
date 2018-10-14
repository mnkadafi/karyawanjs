var express = require('express')
var app = express()

app.get('/', function(req,res){
	res.render('index',
	{
		title: 'KaryawanJS Application'
	})
})

module.exports=app