const {MongoClient} = require('mongodb');
const fs = require('fs');
const MONGODB_URI = 'mongodb+srv://web_app:quentin@cluster0.p329i.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';
const MONGO_DB_NAME = 'clearfashion';


let adresseproducts = require('./adressebrand.json');
let bashproducts = require('./bashbrand.json');
let mudjeansproducts = require('./mudjeansbrand.json');
let dedicatedproducts = require('./dedicatedbrand.json');
let loomproducts = require('./loombrand.json');
let mudjeans_Wproducts = require('./mudjeansbrand_W.json');

const client = new MongoClient(MONGODB_URI, {'useUnifiedTopology': true});

async function connecting(){

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

async function insertData(data){
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
products.push( ...mudjeansproducts, ...dedicatedproducts, ...bashproducts, ...loomproducts, ...mudjeans_Wproducts);
const jsonContent = JSON.stringify(products, null, 2);
fs.writeFile(`products.json`, jsonContent, 'utf8', (err) => 
	{if (err) throw err;
		console.log('Products file saved !');
    });
uploadData(products);