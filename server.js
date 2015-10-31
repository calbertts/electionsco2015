var static = require('node-static')
var url = require('url');
var file = new static.Server('./app/build', { gzip: true })
var dataGenerator = require('./dataGenerator')
var finalJsonData = require('./finalJsonData.json')

var port = process.env.PORT || 5000

require('http').createServer(function (req, res) {
	if(req.url == "/generateData") {
		res.writeHead(200, {'Content-Type': 'application/json'})

		dataGenerator.run()
			.then(function(jsonResult) {
				finalJsonData = jsonResult

				res.write(JSON.stringify({
					jsonResult
				}))

				res.end()
			})
			.catch(function(error) {
				res.write(JSON.stringify({
					errorMsg: error
				}))

				res.end()
			})
	}

	else if(req.url.indexOf("/getCandidate") != -1) {
		var query = url.parse(req.url,true).query;
		res.writeHead(200, {'Content-Type': 'application/json'})

		if('idDep' in query)
		{
			res.write(JSON.stringify(finalJsonData.data[query['idDep']]))
			res.end()
		}
	}

	else if(req.url == "/getIncomesData") {
		res.writeHead(200, {'Content-Type': 'application/json'})

	  res.write(JSON.stringify({
	  	lightData: finalJsonData.lightData,
	  	maxIncome: finalJsonData.maxIncome,
	  	depMaxData: finalJsonData.data[finalJsonData.idDepMax]
	  }))
	  res.end()
	}
	else
	{
		req.addListener('end', function () {
			file.serve(req, res)
		}).resume()
	}
}).listen(port)