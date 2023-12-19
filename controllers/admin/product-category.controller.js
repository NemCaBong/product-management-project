const ProductCategory = require("../../models/product-category.model");
const Account = require("../../models/account.model");
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

  // Phan phan trang
  const totalItems = await ProductCategory.count(find);
  const objectPagination = paginationHelper(req.query, totalItems);
  // ket thuc phan trang

  const productCategories = await ProductCategory.find(find).sort(sort);

  // hiển thị ra tree danh mục khi
  // không có search và tìm kiếm
  let newRecords = {};
  if (objectSearch.keyword || (req.query.sortKey && req.query.sortValue)) {
    newRecords = productCategories;
  } else {
    newRecords = createTreeHelper.tree(productCategories);
  }
  // kết thúc điều kiện hiển thị

  for (const category of newRecords) {
    const user = await Account.findOne({
      _id: category.createdBy.account_id,
    });

    if (user) {
      category.accountFullName = user.fullName;
    }

    const updatedBy = category.updatedBy.slice(-1)[0];

    if (updatedBy) {
      const updatedUser = await Account.findOne({
        _id: updatedBy.account_id,
      });

      updatedBy.accountFullName = updatedUser.fullName;
    }
  }

  res.render("admin/pages/product-category/index", {
    pageTitle: "Danh mục sản phẩm",
    records: newRecords,
    filterStatus: filterStatus,
    keyword: objectSearch.keyword,
    pagination: objectPagination,
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
  // const permissions = res.locals.role.permissions;

  // if(permissions.includes("products-category_create")) {
  //   console.log("Có quyền");
  // } else {
  //   res.send("403");
  //   return;
  // }

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
module.exports.edit = async (req, res) => {
  try {
    const find = {
      deleted: false,
      _id: req.params.id,
    };

    const data = await ProductCategory.findOne(find);

    const records = await ProductCategory.find({ deleted: false });

    const newRecords = createTreeHelper.tree(records);

    res.render("admin/pages/product-category/edit", {
      pageTitle: "Chỉnh sửa danh mục sản phẩm",
      data: data,
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
    await ProductCategory.updateOne(
      { _id: id },
      {
        ...req.body,
        $push: {
          updatedBy: {
            account_id: res.locals.user.id,
            updatedAt: new Date(),
          },
        },
      }
    );
    req.flash("success", "Cập nhật thành công!");
  } catch (error) {
    req.flash("error", "Cập nhật thất bại!");
    res.redirect("back");
  }
  res.redirect(`${systemConfig.prefixAdmin}/product-category`);
};

module.exports.detail = async (req, res) => {
  try {
    const find = {
      deleted: false,
      _id: req.params.id,
    };

    let fatherCategoryName = "";
    const productCategory = await ProductCategory.findOne(find);
    if (productCategory.parent_id) {
      find._id = productCategory.parent_id;
      const fatherCategory = await ProductCategory.findOne(find);
      fatherCategoryName = fatherCategory.title;
    }

    res.render("admin/pages/product-category/detail", {
      pageTitle: "Chi tiết sản phẩm",
      productCategory: productCategory,
      fatherName: fatherCategoryName,
    });
  } catch (error) {
    res.redirect(`${systemConfig.prefixAdmin}/product-category`);
  }
};

module.exports.delete = async (req, res) => {
  const id = req.params.id;
  await ProductCategory.updateOne(
    { _id: id },
    { deleted: true, deletedAt: new Date() }
  );
  res.redirect("back");
};
