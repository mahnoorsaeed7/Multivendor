const product = { title: "Character Pack" };

function processProduct(product, callback) {
  console.log(product.title);
  callback();
}

const result = processProduct(product, function call() {
  console.log("Finished processing");
});
