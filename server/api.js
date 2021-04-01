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
	const db_len = await db.getDB_len();
	const brands = await db.getbrands();
	const ext = await db.get_extrema();
	const prices = await db.get_prices();
	let current_brand = null;
	let current_price = null;
	let num_doc=null;
	let result=[]
	try {
		if(query.brand && query.price) {
			current_brand = query.brand;
			current_price = parseInt(query.price);
			const req = {"brand": current_brand, "price" : {$lte: current_price}};
			res = await db.find(req, parseInt(query.limit), parseInt(query.sort), parseInt(query.page));
			result = res[0];
			num_doc = res[1];



		} else if(query.brand) {
			current_brand = query.brand;
			const req = {"brand": current_brand};
			res = await db.find(req, parseInt(query.limit), parseInt(query.sort), parseInt(query.page));
			result = res[0];
			num_doc = res[1];


		} else if(query.price) {
			current_price = parseInt(query.price);
			const req = {"price" : {$lte: current_price}};
			res = await db.find(req, parseInt(query.limit), parseInt(query.sort), parseInt(query.page));
			result = res[0];
			num_doc = res[1];

		} else {
			res = await db.find({}, parseInt(query.limit), parseInt(query.sort), parseInt(query.page));
			result = res[0];
			num_doc = res[1];
		}
		response.send({page:true, data: {products: result, meta:{total_count: db_len, brand_list : brands, num_page:num_doc/query.limit, extremas:ext, currentPage : query.page, pageSize: query.limit, currentbrand:current_brand, currentSort : query.sort,currentprice: current_price, price_list : prices}}})
	} catch(e) {
		response.send(e);
	}
})

app.get('/products/:id', async (request, response) => {
	const obj_id = request.params.id;
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
