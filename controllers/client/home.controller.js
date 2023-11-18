const Product = require("../../models/product.model");
const productsHelper = require("../../helpers/products");
// [GET] "/"
module.exports.index = async (req, res) => {
  // lấy ra sản phẩm nổi bật
  const featuredProducts = await Product.find({
    deleted: false,
    featured: "1",
    status: "active",
  }).limit(6);
  // ngừng lấy
  const newFeaturedProducts = productsHelper.productsPrice(featuredProducts);

  // lấy ra danh sách sản phẩm mới nhất (theo position)
  let newProducts = await Product.find({
    deleted: false,
    status: "active",
  })
    .sort({ position: "desc" })
    .limit(6);
  newProducts = productsHelper.productsPrice(newProducts);

  res.render("client/pages/home/index.pug", {
    pageTitle: "Trang chủ",
    featuredProducts: newFeaturedProducts,
    newProducts: newProducts,
  });
};
