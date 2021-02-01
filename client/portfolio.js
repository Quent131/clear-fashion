// Invoking strict mode https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode#invoking_strict_mode
'use strict';

// current products on the page
let currentProducts = [];
let currentPagination = {};

// inititiqte selectors
const selectShow = document.querySelector('#show-select');
const selectPage = document.querySelector('#page-select');
const sectionProducts = document.querySelector('#products');
const spanNbProducts = document.querySelector('#nbProducts');
const spanNbRecentProducts = document.querySelector('#nbRecentProducts');
const selectBrand = document.querySelector('#brand-select');
const newrelease = document.querySelector('#recentrelease');
const goodprice = document.querySelector('#goodprice');
const selectSort= document.querySelector('#sort-select');
/**
 * Set global value
 * @param {Array} result - products to display
 * @param {Object} meta - pagination meta info
 */
const setCurrentProducts = ({result, meta}) => {
  currentProducts = result;
  currentPagination = meta;
};

/**
 * Fetch products from api
 * @param  {Number}  [page=1] - current page to fetch
 * @param  {Number}  [size=12] - size of the page
 * @return {Object}
 */
let myproducts = [];
let mypagination = {};

const setmyProducts = ({result, meta}) => {
  myproducts = result;
  mypagination = meta;
};

const fetchProducts = async (page = 1, size = 12) => {
  try {
    const response = await fetch(
      `https://clear-fashion-api.vercel.app?page=${page}&size=${size}`
    );
    const body = await response.json();

    if (body.success !== true) {
      console.error(body);
      return {currentProducts, currentPagination};
    }
    return body.data;
  } catch (error) {
    console.error(error);
    return {currentProducts, currentPagination};
  }
};

/**
 * Render list of products
 * @param  {Array} products
 */
const renderProducts = products => {
  const fragment = document.createDocumentFragment();
  const div = document.createElement('div');
  const template = products
    .map(product => {
      return `
      <div class="product" id=${product.uuid}>
        <span>${product.brand}</span>
        <a href="${product.link}">${product.name}</a>
        <span>${product.price}</span>
      </div>
    `;
    })
    .join('');

  div.innerHTML = template;
  fragment.appendChild(div);
  sectionProducts.innerHTML = '<h2>Products</h2>';
  sectionProducts.appendChild(fragment);
};

/**
 * Render page selector
 * @param  {Object} pagination
 */
const renderPagination = pagination => {
  const {currentPage, pageCount} = pagination;
  const options = Array.from(
    {'length': pageCount},
    (value, index) => `<option value="${index + 1}">${index + 1}</option>`
  ).join('');

  selectPage.innerHTML = options;
  selectPage.selectedIndex = currentPage - 1;
};


/**
 * Render page selector
 * @param  {Object} pagination
 */
const renderIndicators = pagination => {
  const {count} = pagination;
  spanNbProducts.innerHTML = count;
  fetchProducts(1, 139).then(setmyProducts).then(() =>{
  let recentcount = 0;
  for (let i = 0; i<139; i++){
  	if (Date.parse(myproducts[i].released) > Date.now() - 1000*3600*24*30){
  		recentcount+=1;
  	};
  }
	spanNbRecentProducts.innerHTML = recentcount;});
};

/**
* Render brand selector
*/
const renderbrands=products =>{
  let brands=[""]
  for (var i=0;i<products.length;i++){
    if(brands.includes(products[i].brand)==false){
      brands.push(products[i].brand);
    };
  }
  const options2 = Array.from(
    {'length': brands.length},
    (value, index) => `<option value="${brands[index]}">${brands[index]}</option>`
  ).join('');
/*indique le contenu et à qu'elle valeur on veut commencer*/
  selectBrand.innerHTML=options2;
  selectBrand.selectedIndex = 0;
};


const render = (products, pagination) => {
  renderbrands(products);
  renderProducts(products);
  renderPagination(pagination);
  renderIndicators(pagination);
};


const filterbrand=(products,brand) =>{
  if(brand==""){
    return products;
  }
  return products.filter(product => product.brand==brand)
}

const filterrelease=(products) => {
  return products.filter(product =>Date.parse(product.released) > Date.now() - 1000*3600*24*30)
}

const filterprice=(products) => {
  return products.filter(product => product.price < 50)
}


const sortprod=(products, sorttype) => {
  switch (sorttype) {
    case "price-asc":
    return products.sort((a,b) => {return a.price-b.price});
    break;
    case "price-desc":
    return products.sort((a,b) => {return b.price-a.price});
    break;
    case "date-asc":
    return products.sort((a,b) => {return Date.parse(a.released) - Date.parse(b.released)});
    break;
    case "date-desc":
    return products.sort((a,b) => {return Date.parse(b.released) - Date.parse(a.released)});
    break;
    default:
    return products;
  }
}

/**
 * Declaration of all Listeners
 */

/**
 * Select the number of products to display
 * @type {[type]}
 */
selectShow.addEventListener('change', event => {
  fetchProducts(currentPagination.currentPage, parseInt(event.target.value))
    .then(setCurrentProducts)
    .then(() => render(currentProducts, currentPagination));
});
selectPage.addEventListener('change', event => {
  fetchProducts(parseInt(event.target.value), currentPagination.pageSize)
    .then(setCurrentProducts)
    .then(() => render(currentProducts, currentPagination));
});


newrelease.addEventListener('change', (event) => {
  if (newrelease.checked) {
    renderProducts(filterrelease(currentProducts));
  }
  else {
    renderProducts(currentProducts);
  }
})

selectBrand.addEventListener('change', event => {
  renderProducts(filterbrand(currentProducts,event.target.value));
});

goodprice.addEventListener('change', (event) => {
  if (goodprice.checked) {
    renderProducts(filterprice(currentProducts));
  }
  else {
    renderProducts(currentProducts);
  }
})

selectSort.addEventListener('change', event => {
  renderProducts(sortprod(currentProducts, event.target.value));
})

document.addEventListener('DOMContentLoaded', () =>
  fetchProducts()
    .then(setCurrentProducts)
    .then(() => render(currentProducts, currentPagination))
);
