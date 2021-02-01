/* eslint-disable no-console, no-process-exit */
const dedicatedbrand = require('./sources/dedicatedbrand');
const mudjeansbrand = require('./sources/mudjeansbrand');
const adressebrand = require('./sources/adressebrand');

async function sandbox (eshop = 'https://www.dedicatedbrand.com/en/men/news') {
  try {
    console.log(`🕵️‍♀️  browsing ${eshop} source`);

    const products = await adressebrand.scrape(eshop);

    console.log(products);
    console.log('done');
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

const [,, eshop] = process.argv;

//sandbox(eshop);
const URLMJ = 'https://mudjeans.eu/collections/men';
//sandbox(URLMJ);
const URLadresse = 'https://adresse.paris/602-nouveautes';
sandbox(URLadresse);
