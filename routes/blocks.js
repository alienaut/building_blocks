var express = require("express");
var router = express.Router();

var bodyParser = require('body-parser');
var parseUrlencoded = bodyParser.urlencoded({ extended: false });

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/building_blocks');

var Block = mongoose.model('Block', { name: String, description: String });
var Location = mongoose.model('Location', { name: String, place: String });

router.route('/')
	.get(function(request, response) {
		Block
			.find()
			.select('name')
			.limit(0 || request.query.limit)
			.exec(function(err, blocks){
				response.json(blocks);
			});
	})
	.post(parseUrlencoded, function(request, response){
		var newBlock = request.body;
		var block = new Block({name: newBlock.name, description: newBlock.description});
		block.save(function(err){
			if(!err){
				response.status(201).json(newBlock);
			}
		});
	});

router.route('/:name')
	.all(function(request, response, next){
		var block = request.params.name
		request.blockName = block;
		next();
	})
	.get(function(request, response){
		Block.findOne({name: request.blockName}, function(err, block){
			if(err) return handleError(err);
			if(block) {
				response.status(200).json(block);
			} else {
				response.status(404).json("No description found for " + request.blockName);
			}
		});
	})
	.delete(function(request, response){
		Block.findOneAndRemove({ name: request.blockName }, function(err, doc, result){
			if(err) return handleError(err);
			console.log(result);
			response.sendStatus(200);
		});
	});

module.exports = router;