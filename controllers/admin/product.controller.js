const Product = require("../../models/product.model");
const ProductCategory = require("../../models/product-category.model");
const Account = require("../../models/account.model");

const filterStatusHelper = require("../../helpers/filterStatus");
const searchHelper = require("../../helpers/search");
const paginationHelper = require("../../helpers/pagination");
const systemConfig = require("../../config/system");
const createTreeHelper = require("../../helpers/createTree");

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

  // Sort

  let sort = {};

  if (req.query.sortKey && req.query.sortValue) {
    sort[req.query.sortKey] = req.query.sortValue;
  } else {
    // mặc định sử dụng vị trí giảm dần
    sort.position = "desc";
  }
  // End sort

  const products = await Product.find(find)
    .sort(sort)
    .skip(objectPagination.skip)
    .limit(objectPagination.limitItems);

  for (const product of products) {
    // lấy ra thông tin người tạo
    const user = await Account.findOne({
      _id: product.createdBy.account_id,
    });

    // không phải cái nào cx có người tạo
    if (user) {
      product.accountFullName = user.fullName;
    }

    //lấy ra thông tin người chỉnh sửa gần nhất
    // updatedBy thay đổi => product cx thay đổi.
    const updatedBy = product.updatedBy.slice(-1)[0];

    if (updatedBy) {
      const updatedUser = await Account.findOne({
        _id: updatedBy.account_id,
      });

      updatedBy.accountFullName = updatedUser.fullName;
    }
  }

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

  const updatedBy = {
    account_id: res.locals.user.id,
    updatedAt: new Date(),
  };

  // update status of product
  await Product.updateOne(
    { _id: id },
    { status: status, $push: { updatedBy: updatedBy } }
  );
  req.flash("success", "Cập nhật trạng thái thành công");
  res.redirect("back");
};

// [PATCH] /admin/products/change-multi
module.exports.changeMulti = async (req, res) => {
  const type = req.body.type;
  const ids = req.body.ids.split(", ");

  const updatedBy = {
    account_id: res.locals.user.id,
    updatedAt: new Date(),
  };

  switch (type) {
    case "active":
      await Product.updateMany(
        { _id: { $in: ids } },
        { status: "active", $push: { updatedBy: updatedBy } }
      );
      req.flash(
        "success",
        `Cập nhật trạng thái của ${ids.length} sản phẩm thành công`
      );
      break;

    case "inactive":
      await Product.updateMany(
        { _id: { $in: ids } },
        { status: "inactive", $push: { updatedBy: updatedBy } }
      );
      req.flash(
        "success",
        `Cập nhật trạng thái của ${ids.length} sản phẩm thành công`
      );
      break;

    case "delete-all":
      await Product.updateMany(
        { _id: { $in: ids } },
        {
          deleted: true,
          deletedBy: {
            account_id: res.locals.user.id,
            deletedAt: new Date(),
          },
          $push: { updatedBy: updatedBy },
        }
      );
      req.flash("success", `Xóa ${ids.length} sản phẩm thành công`);
      break;

    case "change-position":
      for (const item of ids) {
        let [id, position] = item.split("-");

        position = parseInt(position);

        await Product.updateOne(
          { _id: id },
          {
            position: position,
            $push: { updatedBy: updatedBy },
          }
        );
        req.flash("success", `Đổi vị trí ${ids.length} sản phẩm thành công`);
      }
      break;

    default:
      break;
  }

  res.redirect("back");
};

// [DELETE] /admin/products/delete/:id
module.exports.deleteItem = async (req, res) => {
  const id = req.params.id;
  await Product.updateOne(
    { _id: id },
    {
      deleted: true,
      deletedBy: {
        account_id: res.locals.user.id,
        deletedt: new Date(),
      },
    }
  );
  res.redirect("back");
};

// [GET] /admin/products/create
module.exports.create = async (req, res) => {
  const records = await ProductCategory.find({ deleted: false });

  const newRecords = createTreeHelper.tree(records);
  res.render("admin/pages/products/create", {
    pageTitle: "Thêm mới sản phẩm",
    category: newRecords,
  });
};

// [POST] /admin/products/create
module.exports.createPost = async (req, res) => {
  req.body.price = parseInt(req.body.price);
  req.body.discountPercentage = parseInt(req.body.discountPercentage);
  req.body.stock = parseInt(req.body.stock);

  if (req.body.position === "") {
    const posCount = await Product.count();
    req.body.position = posCount + 1;
  } else {
    req.body.position = parseInt(req.body.position);
  }

  req.body.createdBy = {
    account_id: res.locals.user.id,
    createdAt: new Date(),
  };

  const newProduct = new Product(req.body);
  // save to DB
  await newProduct.save();

  res.redirect(`${systemConfig.prefixAdmin}/products`);
};

// [GET] /admin/products/edit/:id
module.exports.edit = async (req, res) => {
  try {
    const find = {
      deleted: false,
      _id: req.params.id,
    };
    const product = await Product.findOne(find);
    const category = await ProductCategory.find({ deleted: false });

    const newCategory = createTreeHelper.tree(category);

    res.render("admin/pages/products/edit", {
      pageTitle: "Chỉnh sửa sản phẩm",
      product: product,
      category: newCategory,
    });
  } catch (error) {
    res.redirect(`${systemConfig.prefixAdmin}/products`);
  }
};

// [PATCH] /admin/products/edit/:id
module.exports.editPatch = async (req, res) => {
  const id = req.params.id;

  req.body.price = parseInt(req.body.price);
  req.body.discountPercentage = parseInt(req.body.discountPercentage);
  req.body.stock = parseInt(req.body.stock);
  req.body.position = parseInt(req.body.position);

  try {
    const updatedBy = {
      account_id: res.locals.user.id,
      updatedAt: new Date(),
    };

    await Product.updateOne(
      { _id: id },
      {
        ...req.body,
        $push: { updatedBy: updatedBy },
      }
    );
    req.flash("success", "Cập nhật thành công!");
  } catch (error) {
    console.log(error);
    req.flash("error", "Cập nhật thất bại!");
  }
  res.redirect("back");
};

// [GET] /admin/products/detail/:id
module.exports.detail = async (req, res) => {
  try {
    const find = {
      deleted: false,
      _id: req.params.id,
    };

    const product = await Product.findOne(find);

    res.render("admin/pages/products/detail", {
      pageTitle: "Chi tiết sản phẩm",
      product: product,
    });
  } catch (error) {
    res.redirect(`${systemConfig.prefixAdmin}/products`);
  }
};
