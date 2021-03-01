const {MongoClient} = require('mongodb');
const MONGODB_URI = 'mongodb+srv://web_app:quentin@cluster0.p329i.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'
const MONGO_DB_NAME = 'clearfashion';

const connection = async (MONGODB_URI, MONGO_DB_NAME) => {
	const client = await MongoClient.connect(MONGODB_URI, {'useNewUrlParser': true});
	const db = client.db(MONGO_DB_NAME);
}

const products = [];

let adresseproducts = require('./adressebrand.json');
let mudjeansproducts = require('./mudjeansbrand.json');
let dedicated = require('./dedicatedbrand.json');

function normalize(brand, keys) {
	let prodlist = []
	keys.forEach(function (key) {
		prodlist[key] = brand[key]
	})
	return prodlist;
}
let dedicatedproducts1 = normalize(dedicated, ['name', 'price']);

console.log(dedicatedproducts1);

//const collection = db.collection('products');
//const result = collection.insertMany(products);

//connection(MONGODB_URI, MONGO_DB_NAME);
