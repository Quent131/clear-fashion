const axios = require('axios');
const cheerio = require('cheerio');
const {'v5': uuidv5} = require('uuid');

const parse = data => {
  const $ = cheerio.load(data);

    return $('.ProductTileWrapper')
        .map((i, element) => {
            const link = `https://ba-sh.com${$(element)
            .find('.ProductTile-link')
            .attr('href')}`


            const _id = uuidv5(link, uuidv5.URL);


            const name = $(element)
            .find('.ProductTile-link')
            .attr('title');


            let price = parseFloat($(element)
                  .find('.Product-price')
                  .text());


            const image = $(element)
                .find('img')
                .attr('src');

            return {_id, 'brand': 'bash', name, price, link, image};
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
