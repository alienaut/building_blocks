module.exports = function(request, response, next){
	if(request.method === 'GET') {
		next();
	} else {
		response.end("Only GET method allowed!");
	}
};
