const products = [
  {
    title: "Character Pack",
    price: 20,
    inventory: 5,
  },
  {
    title: "Castle Environment",
    price: 30,
    inventory: 0,
  },
  {
    title: "Animation Pack",
    price: 15,
    inventory: 8,
  },
];

function getAvailableProducts(products) {
  return products.filter((product) => product.inventory > 0);
}

const AvailableProducts = getAvailableProducts(products);
console.log(AvailableProducts);

function findProduct(products, title) {
  return products.filter((product) => product.title === title);
}

const productTitle = findProduct(products, "Animation Pack");
console.log(productTitle);

function getProductTitles(products) {
  return products.map( product =>  product.title )
}

const productTitles = getProductTitles(products);
console.log(productTitles)