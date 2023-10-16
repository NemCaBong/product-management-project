const ProductCategory = require("../../models/product-category.model");
const createTreeHelper = require("../../helpers/createTree");

module.exports.category = async (req, res, next) => {
  const productCategory = await ProductCategory.find({
    deleted: false,
  });

  // dùng để lấy ra các category cha và category con
  // để dùng trong partials header.pug
  const productCategoryTree = createTreeHelper.tree(productCategory);

  res.locals.layoutProductsCategory = productCategoryTree;
  next();
};
