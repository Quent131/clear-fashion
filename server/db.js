const {MongoClient} = require('mongodb');
const fs = require('fs');
const MONGODB_URI = 'mongodb+srv://web_app:quentin@cluster0.p329i.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';
const MONGO_DB_NAME = 'clearfashion';


let adresseproducts = require('./adressebrand.json');
let mudjeansproducts = require('./mudjeansbrand.json');
let dedicated = require('./dedicatedbrand.json');

function normalize(brand, keys) {
	let prodlist = []
	brand.forEach(product => {
		let prod_info = {}
		keys.forEach(key => {
			prod_info[key] = product[key]
		})
		prodlist.push(prod_info);
	});
	return prodlist;
}
let dedicatedproducts = normalize(dedicated, ['name', 'price']);

adresseproducts.forEach(products => {
	products['brand'] = 'Adresse';
});
mudjeansproducts.forEach(products => {
	products['brand'] = 'Mud Jeans';
});
dedicatedproducts.forEach(products => {
	products['brand'] = 'Dedicated';
});

const client = new MongoClient(MONGODB_URI, {'useUnifiedTopology': true});

module.exports.connecting = async function connecting(){

    await client.connect();
    const db = client.db(MONGO_DB_NAME)
    console.log("Connected to database!")
    return {client, db};
}

async function close(client){
    try{
        await client.close();
    } catch(e) {
        console.log(e);
    }

}

module.exports.insert = async function insertData(data){
    let connection = {}
    try{

        connection = await connecting();
        const collection = connection.db.collection('products');
        const result = await collection.insertMany( data);
        return result;

    } catch(e) {

        console.log(e);
        await close(connection.client);
    } finally {
        await close(connection.client);
    }
}

module.exports.find = async query => {
  try {
    const db = await getDB();
    const collection = db.collection(MONGODB_COLLECTION);
    const result = await collection.find(query).toArray();

    return result;
  } catch (error) {
    console.error('collection.find...', error);
    return null;
  }
};


function uploadData(data){
      res = insertData(data).then(console.log("Upload succesfull"));
    }

const products = adresseproducts;
products.push( ...mudjeansproducts, ...dedicatedproducts);
const jsonContent = JSON.stringify(products, null, 2);
fs.writeFile(`products.json`, jsonContent, 'utf8', (err) => 
	{if (err) throw err;
		console.log('Products file saved !');
    });
uploadData(products);