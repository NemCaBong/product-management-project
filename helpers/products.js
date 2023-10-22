module.exports.productsPrice = (products) => {
  const productPrices = products.map((item) => {
    item.priceNew = (
      (item.price * (100 - item.discountPercentage)) /
      100
    ).toFixed(0);
    return item;
  });
  return productPrices;
};

// dùng để hiển thị ra giá mới của 1 sản phẩm

module.exports.priceNewProduct = (product) => {
  if (product) {
    const newPrice = (
      (product.price * (100 - product.discountPercentage)) /
      100
    ).toFixed(0);
    return newPrice;
  }
  return 0;
};
