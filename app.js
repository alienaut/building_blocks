var express = require("express");
var app = express();

var bodyParser = require('body-parser');
var parseUrlencoded = bodyParser.urlencoded({ extended: false });

var logger = require('./logger');
//var onlyGet = require('./only_get');

//app.use(onlyGet);
app.use(logger);
app.use(express.static('public'));

blocks = {
	'Fixed': 'Fastened securely in position',
	'Movable': 'Capable of being moved',
	'Rotating': 'Moving in a circle around its center'
};

locations = {
	'Fixed': 'First Floor',
	'Movable': 'Second Floor',
	'Rotating': 'Penthouse'
}

app.param('name', function(request, response, next){
	var name = request.params.name;
	var block = name[0].toUpperCase() + name.slice(1).toLowerCase();

	request.blockName = block;
	next();
});

app.route('/blocks')
	.get(function(request, response) {
		blocks = Object.keys(blocks)
		if(request.query.limit >= 0){
			response.json(blocks.slice(0, request.query.limit));
		} else {
			response.json(blocks);
		}
	})
	.post(parseUrlencoded, function(request, response){
		var newBlock = request.body;
		blocks[newBlock.name] = newBlock.description;
		response.status(201).json(newBlock.name);
	});

app.route('/blocks/:name')
	.get(function(request, response){
		var description = locations[request.blockName];
		if(!description){
			response.status(404).json("No description found for " + request.params.name);
		} else {
			response.json(description);
		}
	})
	.delete(function(request, response){
		delete blocks[request.blockName];
		response.sendStatus(200);
	});

app.listen(3000);
