require('dotenv').config();
const {MongoClient} = require('mongodb');
const fs = require('fs');

const MONGODB_DB_NAME = 'clearfashion';
const MONGODB_COLLECTION = 'products';
const MONGODB_URI = 'mongodb+srv://web_app:quentin@cluster0.p329i.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';

let client = null;
let database = null;

/**
 * Get db connection
 * @type {MongoClient}
 */
const getDB = module.exports.getDB = async () => {
  try {
    if (database) {
      console.log('💽  Already Connected');
      return database;
    }

    client = await MongoClient.connect(MONGODB_URI, {'useNewUrlParser': true});
    database = client.db(MONGODB_DB_NAME);

    console.log('💽  Connected');

    return database;
  } catch (error) {
    console.error('🚨 MongoClient.connect...', error);
    return null;
  }
};

/**
 * Insert list of products
 * @param  {Array}  products
 * @return {Object}
 */
module.exports.insert = async products => {
  try {
    const db = await getDB();
    const collection = db.collection(MONGODB_COLLECTION);
    // More details
    // https://docs.mongodb.com/manual/reference/method/db.collection.insertMany/#insert-several-document-specifying-an-id-field
    const result = await collection.insertMany(products, {'ordered': false});

    return result;
  } catch (error) {
    console.error('🚨 collection.insertMany...', error);
    fs.writeFileSync('products.json', JSON.stringify(products));
    return {
      'insertedCount': error.result.nInserted
    };
  }
};

/**
 * Find products based on query
 * @param  {Array}  query
 * @return {Array}
 */
module.exports.find = async (query, limit, sorting, page) => {
  try {
    const db = await getDB();
    const collection = db.collection(MONGODB_COLLECTION);
    const num_doc = await collection.find(query).sort({price:sorting}).count()
    let result = null;
    result = await collection.find(query).sort({price:sorting, _id:1}).limit(limit).skip((page-1)*limit).toArray();
    return [result,num_doc];
  } catch (error) {
    console.error('🚨 collection.find...', error);
    return [null,null];
  }
};

module.exports.getDB_len = async() => {
  try {
    const db = await getDB();
    const collection = db.collection(MONGODB_COLLECTION);
    let len_db = await collection.countDocuments()
    return len_db;
  } catch(e) {return e}
};

module.exports.getbrands = async() => {
  try {
    const db = await getDB();
    const collection = db.collection(MONGODB_COLLECTION);
    const brands = await collection.distinct("brand");
    return brands;
  } catch(e) {
    return e;
  }
};

module.exports.get_extrema = async() => {
  try {
    const db = await getDB();
    const collection = db.collection(MONGODB_COLLECTION);
    const extrema = await collection.aggregate([ 
    { "$group": { 
        "_id": null,
        "max": { "$max": "$price" }, 
        "min": { "$min": "$price" } 
    }}
    ]).toArray();
    return extrema;
  } catch(e) {
    return e;
  }
};

module.exports.get_prices = async() => {
  try {
    const db = await getDB();
    const collection = db.collection(MONGODB_COLLECTION);
    const prices = await collection.find({}).project({"price":1}).toArray();
    return prices;
  } catch(e) {
    return e;
  }
};

/**
 * Close the connection
 */
module.exports.close = async () => {
  try {
    await client.close();
  } catch (error) {
    console.error('🚨 MongoClient.close...', error);
  }
};
