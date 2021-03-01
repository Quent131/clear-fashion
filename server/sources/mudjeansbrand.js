const axios = require('axios');
const cheerio = require('cheerio');

const parse = data => {
  const $ = cheerio.load(data);

    return $('.content-row .product-link')
        .map((i, element) => {
            const name = $(element)
            .find('.product-title')
            .text()
            .trim()
            .replace(/\s/g, ' ');
            let price = $(element)
                  .find('.row .product-price:first')
                  .text();
            price = parseFloat(price.substring(
                price.lastIndexOf('€') + 1,
                price.length - 1
            ));
            const uri = $(element)
                  .find('.primary-image')
                  .text();
            return {name, price};
        })
        .get();
};

module.exports.scrape = async url => {
  const response = await axios(url);
  const {data, status} = response;

  if (status >= 200 && status < 300) {
    return parse(data);
  }

  console.error(status);

  return null;
};
