// app.js
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var path = require("path");
var session = require('express-session');
var port = 3000;


//set up sessions
var sessionOptions = {
	secret: 'secret cookie thang',
	resave: true,
	saveUninitialized: true
};
app.use(session(sessionOptions));

//array of complaint objects
var complaints = [
	{line: "G", complaint: "The person sitting next to me was eating hard-boiled eggs in the subway car (???!!!)"},
	{line: "F", complaint: "There was a possum loose on the platform"},
	{line: "A", complaint: "The train was an hour late!"}
];

//layout
app.set('view engine', 'hbs');

//static files
var publicPath = path.resolve(__dirname, "public");
app.use(express.static(publicPath));

//access request body
app.use(bodyParser.urlencoded({ extended: false }));


app.use(function(req, res, next){
	console.log("Request method: " + req.method);
	console.log("Request path: " + req.path);
	console.log("Request query: ");console.log(req.query);
	console.log("Request body: "); console.log(req.body);
	next();
});


app.get("/", function(req, res){
	//copy array by value and reverse
	var filter;
	var tempComplaints;
	if(req.query.chosenLine !== undefined){ //form submitted?
		filter = req.query.chosenLine;
		tempComplaints = complaints.filter(function(c){
			return c.line === filter;
		});
	}else{
		tempComplaints = complaints.slice();
	}
	res.render('homepage.hbs', {'complaints': tempComplaints.reverse()});
});

app.get("/complain", function(req, res){
	res.render('complain.hbs');
});

app.post("/complain", function(req, res){
	if(req.session.numComplaints === undefined){
		req.session.numComplaints = 1;
	}else{
		req.session.numComplaints += 1;
	}
	var complaintText = req.body.complaint;
	var newLine = req.body.line;
	var newComplaint = {line: newLine, complaint: complaintText};
	complaints.push(newComplaint);
	res.redirect(301, "/");
});

app.get("/stats", function(req, res){
	if(req.session.numComplaints === undefined){
		req.session.numComplaints = 0;
	}
	res.render('stats.hbs', {numComplaints: req.session.numComplaints});
});


app.listen(port);
console.log("Hosting at port " + port);
