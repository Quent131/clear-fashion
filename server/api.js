const cors = require('cors');
const express = require('express');
const helmet = require('helmet');
const db= require('./db/index.js');
const mongo = require('mongodb')

const PORT = 8092;

const app = express();

module.exports = app;

app.use(require('body-parser').json());
app.use(cors());
app.use(helmet());

app.options('*', cors());

app.get('/', (request, response) => {
  response.send({'ack': true});
});

app.get('/products/search', async (request, response) => {
	const query = request.query;
	try {
		if(query.limit && query.brand && query.price) {
			const req = {"brand": query.brand, "price" : parseInt(query.price)};
			const result = await db.find(req, parseInt(query.limit));
			response.send(result);


		} else if(query.limit && query.brand) {
			const req = {"brand": query.brand};
			const result = await db.find(req, parseInt(query.limit));
			response.send(result);



		} else if(query.limit && query.price) {
			const req = {"price" : parseInt(query.price)};
			const result = await db.find(req, parseInt(query.limit));
			response.send(result);



		} else if(query.brand && query.price) {
			const req = {"brand": query.brand, "price" : parseInt(query.price)};
			const result = await db.find(req, 12);
			response.send(result);


		} else if(query.limit) {
			const result = await db.find({}, parseInt(query.limit));
			response.send(result);


		} else if(query.brand) {
			const req = {"brand": query.brand};
			const result = await db.find(req, 12);
			response.send(result);


		} else if(query.price) {
			const req = {"price" : parseInt(query.price)};
			const result = await db.find(req, 12);
			response.send(result);


		} else {
			const result = await db.find({}, 12);
			response.send(result);
		}
	} catch(e) {
		response.send(e);
	}
})

app.get('/products/:id', async (request, response) => {
	const obj_id = new mongo.ObjectID(request.params.id);
	try {
		const result = await db.find({_id: obj_id});
		response.send(result);
	} catch(e) {
		response.send(e);
		console.log(e);
	}
});


app.listen(PORT);
console.log(`📡 Running on port ${PORT}`);
