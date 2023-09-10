const Product = require("../../models/product.model");

const filterStatusHelper = require("../../helpers/filterStatus");
const searchHelper = require("../../helpers/search");
const paginationHelper = require("../../helpers/pagination");
// [GET] /admin/products
module.exports.index = async (req, res) => {
  // bộ lọc
  const filterStatus = filterStatusHelper(req.query);
  // hết bộ lọc

  // dieu kien search DB
  let find = {
    deleted: false,
  };

  if (req.query.status) {
    find.status = req.query.status;
  }

  // phan tim kiem
  const objectSearch = searchHelper(req.query);
  if (objectSearch.keyword) {
    find.title = objectSearch.keywordRegex;
  }
  // het tim kiem

  // Phan phan trang
  // tồng sản phẩm trong DB.
  const totalItems = await Product.count(find);
  const objectPagination = paginationHelper(req.query, totalItems);
  // ket thuc phan trang

  const products = await Product.find(find)
    .skip(objectPagination.skip)
    .limit(objectPagination.limitItems);

  res.render("admin/pages/products/index", {
    pageTitle: "Danh sách sản phẩm",
    products: products,
    filterStatus: filterStatus,
    keyword: objectSearch.keyword,
    pagination: objectPagination,
  });
};

// [PATCH] /admin/products/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
  const status = req.params.status;
  const id = req.params.id;

  // update status of product
  await Product.updateOne({ _id: id }, { status: status });
  res.redirect("back");
};
