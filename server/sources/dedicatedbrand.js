const axios = require('axios');
const cheerio = require('cheerio');
const {'v5': uuidv5} = require('uuid');

/**
 * Parse webpage e-shop
 * @param  {String} data - html response
 * @return {Array} products
 */
const parse = data => {
  products = data.products.filter(product => product.length != 0);
  return products.map(element => {
      const link = `https://www.dedicatedbrand.com/en/${element.canonicalUri}`;
      const _id = uuidv5(link, uuidv5.URL);
      const name = element.name;
      const price = element.price.priceAsNumber;
      const image = element.image[0];
      return {_id, 'brand':'dedicated',name, price, link, image};
    });
};

/**
 * Scrape all the products for a given url page
 * @param  {[type]}  url
 * @return {Array|null}
 */
module.exports.scrape = async url => {
  const response = await axios(url);
  const {data, status} = response;

  if (status >= 200 && status < 300) {
    return parse(data);
  }

  console.error(status);

  return null;
};
