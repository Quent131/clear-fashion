const axios = require('axios');
const cheerio = require('cheerio');
const {'v5': uuidv5} = require('uuid');

/**
 * Parse webpage e-shop
 * @param  {String} data - html response
 * @return {Array} products
 */
const parse = data => {
  const $ = cheerio.load(data);

  return $('.product-grid__item')
    .map((i, element) => {

      const link = `https://www.loom.fr${$(element)
        .find('.product-title a')
        .attr('href')}`;

      const brand = 'loom';

      const name = $(element)
        .find('.product-title')
        .text()
        .trim()
        .replace(/\s/g, ' ');


      let price = parseInt($(element)
        .find('.money')
        .text());


      const image = $(element)
        .find('.product_card__image')
        .attr('src');

      const _id = uuidv5(link, uuidv5.URL);

      return {_id, brand, name, price, link, image};
    })
    .get();
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