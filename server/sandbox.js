/* eslint-disable no-console, no-process-exit */
const dedicatedbrand = require('./sources/dedicatedbrand');
const mudjeansbrand = require('./sources/mudjeansbrand');
const mudjeansbrand_W = require('./sources/mudjeansbrand_W');
const adressebrand = require('./sources/adressebrand');
const loombrand = require('./sources/loombrand');
const bashbrand = require('./sources/bashbrand');
const fs = require('fs');


async function sandbox (eshop = 'https://www.dedicatedbrand.com/en/loadfilter', brand, name) {
  try {
    console.log(`🕵️‍♀️  browsing ${eshop} source`);

    const products = await brand.scrape(eshop);

    console.log('Scraping products...');
    console.log('done');
    console.log('Trying the save the results...');
    const jsonContent = JSON.stringify(products, null, 2);
    fs.writeFile(`${name}.json`, jsonContent, 'utf8', (err) => 
      {if (err) throw err;
        console.log('File saved !');
      });
    console.log(`${name} products scrape : ${products.length}`);
    //process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

const [,, eshop] = process.argv;

sandbox(eshop, dedicatedbrand, 'dedicatedbrand');

const URLMJ_M = 'https://mudjeans.eu/collections/men';
sandbox(URLMJ_M, mudjeansbrand, "mudjeansbrand");

const URLMJ_W ='https://mudjeans.eu/collections/women-buy-jeans'
sandbox(URLMJ_W, mudjeansbrand_W, "mudjeansbrand_W");

const URLadresse = 'https://adresse.paris/630-toute-la-collection?id_category=630&n=109';
sandbox(URLadresse, adressebrand, "adressebrand");

const URLloom = 'https://www.loom.fr/collections/tous-les-vetements'
sandbox(URLloom, loombrand, "loombrand")

const URLbash = 'https://ba-sh.com/fr/fr/pap-collection/'
sandbox(URLbash, bashbrand, "bashbrand")