const Product = require("../../models/product.model");
const ProductCategory = require("../../models/product-category.model");
const productsHelper = require("../../helpers/products");
const productsCategoryHelper = require("../../helpers/products-category");
// [GET] /products
module.exports.index = async (req, res) => {
  const products = await Product.find({
    status: "active",
    deleted: false,
  }).sort({ position: "desc" });

  const newProducts = productsHelper.productsPrice(products);

  res.render("client/pages/products/index", {
    pageTitle: "Danh sách sản phẩm",
    products: newProducts,
  });
};

// [GET] /products/:slug
module.exports.detail = async (req, res) => {
  // console.log(req.params.slug);
  try {
    const find = {
      deleted: false,
      slug: req.params.slug,
    };
    const product = await Product.findOne(find);

    // console.log(product);

    res.render("client/pages/products/detail", {
      pageTitle: product.title,
      product: product,
    });
  } catch (err) {
    res.redirect("/products");
  }
};

// [GET] /products/:slugCategory

module.exports.category = async (req, res) => {
  try {
    console.log(req.params.slugCategory);

    // Tìm ra danh mục đó là gì
    const category = await ProductCategory.findOne({
      deleted: false,
      status: "active",
      slug: req.params.slugCategory,
    });

    // Chúng ta cần lấy được tất cả các sản phẩm con của danh mục
    // Dùng đệ quy để lấy hết.
    const listSubCategories = await productsCategoryHelper.getSubCategories(
      category.id
    );
    const listSubCategoriesID = listSubCategories.map((item) => item.id);

    // Tìm ra được all sản phẩm trong danh mục đó
    const products = await Product.find({
      deleted: false,
      product_category_id: { $in: [category.id, ...listSubCategoriesID] },
      status: "active",
    }).sort({ position: "desc" });

    // tạo giá mới theo % giảm giá
    const newProducts = productsHelper.productsPrice(products);

    res.render("client/pages/products/index", {
      pageTitle: category.title,
      products: newProducts,
    });
  } catch (err) {
    res.redirect("back");
  }
};
