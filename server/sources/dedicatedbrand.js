const axios = require('axios');
const cheerio = require('cheerio');

/**
 * Parse webpage e-shop
 * @param  {String} data - html response
 * @return {Array} products
 */
const parse = data => {
  products = data.products.filter(product => product.length != 0);
  return products.map(element => {
      const id = element.id;
      const uri = element.canonicalUri;
      const name = element.name;
      const price = element.price.priceAsNumber;
      const reduction = element.price.priceReductionAsNumber;
      const images = element.image;
      return {id, name, uri, price, reduction, images};
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
