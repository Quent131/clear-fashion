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

const client = await MongoClient.connect(MONGODB_URI, {'useUnifiedTopology': true});

async function connection(){

    await client.connect();
    const db = client.db(MONGO_DB_NAME)

    return {client, db};
}

async function close(client){
    try{
        await client.close();
    } catch(e) {
        console.log(e);
    }

}

async function insertData(data){
    let connection = {}
    try{

        connection = await connect();
        const collection = connection.db.collection('products');
        const result = await collection.insertMany(data);

        return result;

    } catch(e) {

        console.log(e);
        await close(connection.client);
    } finally {
        await close(connection.client);
    }
}

function uploadData(){

  fs.readFile('./products.json', 'utf-8', (err, data) => {
    if(err){
      throw err;
    }

    fileF = JSON.parse(data.toString());
    if(fileF){
      res = db.insertData(fileF).then()
      if(res.insertedCount = fileF.length){
        console.log("Upload succesfull");
      } else {
        console.log(res);
      }
    }
  });
}

const products = [];
products.push(adresseproducts, mudjeansproducts, dedicatedproducts);