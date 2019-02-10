/*
https://mongoosejs.com/docs/api.html

npm install mongoose
npm install express

mongodb database: test

json exemplo:
{
	"id": "xyz",
	"description": "xyz",
	"address": "xyz",
	"lat": "xyz",
	"lng": "xyz",
	"status": "xyz",
	"type": {
		"id": "xyz",
		"icon": "xyz"
	}
}
*/
var cors = require("cors");
var express = require("express");
var app = express();
var port = 3000;
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({extended: false});
var database = "mongodb://localhost:27017/test";
var mongoose = require("mongoose");
var objectId = require("mongoose").ObjectID;

mongoose.Promise = global.Promise;
mongoose.connect(database);

var Schema = new mongoose.Schema
({
	// _id: {
	// 	type: mongoose.Schema.Types.ObjectId,
	// 	index: true,
	// 	required: true,
	// 	auto: true,
	//   },

	description: String,
	address: String,
	phone: String,
	lat: String,
	lng: String,
	status: String,
	website: String,
	//type: mongoose.Schema.Types.Mixed
	//type:[String]
	type: {
		id: String,
		icon: String
	}
	
},{versionKey: false});

var Coordinate = mongoose.model("Coordinate", Schema);

const util = require('util');

app.use(cors());
app.use(bodyParser.json());
app.listen(port, () => {
	console.log("Coordinates CRUD is listening on port " + port);
});

app.post("/coordinate/add", urlencodedParser, (req, res) => {
	var newCoordinate = new Coordinate(req.body);
	//console.log("body: " + util.inspect(req.body, {showHidden: false, depth: null}));
	//console.log("newCoordinate.id "+newCoordinate.id);
    console.log(newCoordinate);
	//Coordinate.create(newCoordinate);		
	newCoordinate.save()
		.then(item => {
			//res.send(req.body.id + " saved to database.");
			res.setHeader('Access-Control-Allow-Origin','*');
			res.send(newCoordinate);
		})
		.catch(err => {
			res.setHeader('Access-Control-Allow-Origin','*');			
			res.status(400).send(err);
		}); 
});

app.post("/coordinate/update", urlencodedParser, (req, res) => {
	var updatedCoordinate = new Coordinate(req.body);
	var id = req.body._id;

	Coordinate.updateOne({"_id":id},{$set:updatedCoordinate}, (err,result) =>
	{
		console.log(updatedCoordinate);
	}).then(item => {
			res.setHeader('Access-Control-Allow-Origin','*');			
			res.send(updatedCoordinate);
		})
		.catch(err => {
			res.setHeader('Access-Control-Allow-Origin','*');			
			res.status(400).send(err);
		}); 
});

app.get("/", (req, res) => {
	res.setHeader('Access-Control-Allow-Origin','*');
	res.send("Coordinates CRUD by CajuIdeas");
});

app.get("/coordinate", (req, res) => {
	//console.log("listing all.");	
	Coordinate.find({}, (err,pontos) => {
		var lista = {};
			pontos.forEach(ponto => {
				lista[ponto._id] = ponto;
			});
		if (err) {
			res.setHeader('Access-Control-Allow-Origin','*');
			res.send(err);
		} else {
			//res.json(pontos);
			res.setHeader('Access-Control-Allow-Origin','*');
			res.send(pontos);
		}		
	})
});

app.post("/coordinate", urlencodedParser, (req, res) => {
	Coordinate.findById({"_id":req.body.id},(err,ponto) => {
		if (err) {
			res.setHeader('Access-Control-Allow-Origin','*');
			res.send(err);
		} else {
			//console.log(ponto);
			res.setHeader('Access-Control-Allow-Origin','*');
			res.send(ponto);
		}		
	});
});

/* ATENÇÃO */
/* REMOVER ABAIXO */
app.get('/coordinate/delete', (req, res, next) => {  
	// Coordinate.deleteMany({},(err) => {		
	// 	if (err) {
	// 		res.send(err);
	// 	} else {
	// 		res.send("done");
	// 	}
	// });
	Coordinate.deleteMany({},(err,result) => {
		if (err) {
			res.setHeader('Access-Control-Allow-Origin','*');
			res.send(err);
		} else {
			res.setHeader('Access-Control-Allow-Origin','*');
			res.send(result);
		}
	});
});  
	 
app.post('/coordinate/delete', function(req, res, next) {  
	var id = req.body.id;  
	Coordinate.findByIdAndRemove(id).exec();  
	//res.redirect('/');  
});