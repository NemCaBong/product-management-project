const Product = require("../../models/product.model");
const productsHelper = require("../../helpers/products");
// [GET] "/"
module.exports.index = async (req, res) => {
  // lấy ra sản phẩm nổi bật
  const featuredProducts = await Product.find({
    deleted: false,
    featured: "1",
    status: "active",
  });
  // ngừng lấy

  const newFeaturedProducts = productsHelper.productsPrice(featuredProducts);

  res.render("client/pages/home/index.pug", {
    pageTitle: "Trang chủ",
    featuredProducts: newFeaturedProducts,
  });
};
