const Product = require("../../models/product.model");

const filterStatusHelper = require("../../helpers/filterStatus");

const searchHelper = require("../../helpers/search");
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

  // phan phan trang
  const objectPagination = {
    currentPage: 1,
    limitItems: 5,
  };
  if (req.query.page) {
    objectPagination.currentPage = parseInt(req.query.page);
  }

  // tồng sản phẩm trong DB.
  const totalItems = await Product.count(find);
  // tổng số trang cần
  objectPagination.totalPages = Math.ceil(
    totalItems / objectPagination.limitItems
  );

  // sản phẩm bắt đầu lấy
  objectPagination.skip =
    (objectPagination.currentPage - 1) * objectPagination.limitItems;

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
