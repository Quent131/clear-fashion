const axios = require('axios');
const cheerio = require('cheerio');
const {'v5': uuidv5} = require('uuid');

const parse = data => {
  const $ = cheerio.load(data);

    return $('.content-row .product-link')
        .map((i, element) => {
            const link = `https://mudjeans.eu${$(element)
            .find("a.product-image")
            .attr('href')}`


            const _id = uuidv5(link, uuidv5.URL);


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
            let image = $(element)
                .find('.img.img--wrapper')
                .find('img')
                .attr('src');
            image = "http:"+image

            return {_id, 'brand': 'mudjeans', name, price, link, image};
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
