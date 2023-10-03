const ProductCategory = require("../../models/product-category.model");
const systemConfig = require("../../config/system");

const filterStatusHelper = require("../../helpers/filterStatus");
const searchHelper = require("../../helpers/search");
const paginationHelper = require("../../helpers/pagination");
const createTreeHelper = require("../../helpers/createTree");

// [GET] /admin/product-category
module.exports.index = async (req, res) => {
  let find = {
    deleted: false,
  };

  // bộ lọc
  const filterStatus = filterStatusHelper(req.query);
  // hết bộ lọc

  // get status filter in URL
  if (req.query.status) {
    find.status = req.query.status;
  }
  // end
  let sort = {};
  if (req.query.sortKey && req.query.sortValue) {
    sort[req.query.sortKey] = req.query.sortValue;
  } else {
    sort.position = "asc";
  }
  // phan tim kiem
  const objectSearch = searchHelper(req.query);
  if (objectSearch.keyword) {
    find.title = objectSearch.keywordRegex;
  }
  // het tim kiem

  const productCategories = await ProductCategory.find(find).sort(sort);
  // hiển thị ra tree danh mục khi nào
  let newRecords = {};
  if (objectSearch.keyword || (req.query.sortKey && req.query.sortValue)) {
    newRecords = productCategories;
  } else {
    newRecords = createTreeHelper.tree(productCategories);
  }
  res.render("admin/pages/product-category/index", {
    pageTitle: "Danh mục sản phẩm",
    records: newRecords,
    filterStatus: filterStatus,
    keyword: objectSearch.keyword,
  });
};

// [GET] /admin/product-category/create
module.exports.create = async (req, res) => {
  let find = {
    deleted: false,
  };

  const records = await ProductCategory.find(find);

  const newRecords = createTreeHelper.tree(records);
  res.render("admin/pages/product-category/create", {
    pageTitle: "Tạo danh mục",
    records: newRecords,
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

// [GET] /admin/product-category/edit/:id
module.exports.editCategory = async (req, res) => {
  try {
    const find = {
      deleted: false,
      _id: req.params.id,
    };
    const productCategory = await ProductCategory.findOne(find);

    const records = await ProductCategory.find({ deleted: false });

    const newRecords = createTreeHelper.tree(records);

    res.render("admin/pages/product-category/edit", {
      pageTitle: "Chỉnh sửa danh mục sản phẩm",
      data: productCategory,
      records: newRecords,
    });
  } catch (error) {
    res.redirect(`${systemConfig.prefixAdmin}/product-category`);
  }
};

// [PATCH] /admin/product-category/edit/:id
module.exports.editPatch = async (req, res) => {
  const id = req.params.id;

  req.body.position = parseInt(req.body.position);

  try {
    await ProductCategory.updateOne({ _id: id }, req.body);
    // req.flash("success", "Cập nhật thành công!");
  } catch (error) {
    console.log(error);
    // req.flash("error", "Cập nhật thất bại!")
    res.redirect("back");
  }
  res.redirect("back");
};
