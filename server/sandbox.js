/* eslint-disable no-console, no-process-exit */
const dedicatedbrand = require('./sources/dedicatedbrand');
const mudjeansbrand = require('./sources/mudjeansbrand');
const adressebrand = require('./sources/adressebrand');
const fs = require('fs');

async function sandbox (eshop = 'https://www.dedicatedbrand.com/en/men/news', brand, name) {
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
    //process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

const [,, eshop] = process.argv;

sandbox(eshop, dedicatedbrand, 'dedicatedbrand');
const URLMJ = 'https://mudjeans.eu/collections/men';
sandbox(URLMJ, mudjeansbrand, "mudjeansbrand");
const URLadresse = 'https://adresse.paris/602-nouveautes';
sandbox(URLadresse, adressebrand, "adressebrand");
