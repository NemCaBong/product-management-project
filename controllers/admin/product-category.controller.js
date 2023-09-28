const ProductCategory = require("../../models/product-category.model");
const systemConfig = require("../../config/system");

// [GET] /admin/product-category
module.exports.index = async (req, res) => {
  let find = {
    deleted: false,
  };

  const productCategories = await ProductCategory.find(find);

  res.render("admin/pages/product-category/index", {
    pageTitle: "Danh mục sản phẩm",
    records: productCategories,
  });
};

// [GET] /admin/product-category/create
module.exports.create = async (req, res) => {
  res.render("admin/pages/product-category/create", {
    pageTitle: "Tạo danh mục",
  });
};

// [POST] /admin/product-category/create
module.exports.createPost = async (req, res) => {
  console.log(req.body);
  if (req.body.position === "") {
    const posCount = await ProductCategory.count();
    req.body.position = posCount + 1;
  } else {
    req.body.position = parseInt(req.body.position);
  }

  const newProductCategory = new ProductCategory(req.body);
  await newProductCategory.save();
  res.redirect(`${systemConfig.prefixAdmin}/product-category`);
};
