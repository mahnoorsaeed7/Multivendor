const promise = new Promise((resolve, reject ) =>{
    resolve("success");
});

function getProduct() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({
        title: "Character Pack",
        price: 50,
      });
    }, 1000);
  });
}

getProduct()
  .then((product) => {
    console.log(product);
  })
  .catch((error) => {
    console.error(error);
  });