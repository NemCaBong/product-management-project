const ProductCategory = require("../../models/product-category.model");
const Account = require("../../models/account.model");
const systemConfig = require("../../config/system");

const filterStatusHelper = require("../../helpers/filterStatus");
const searchHelper = require("../../helpers/search");
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

  // hiển thị ra tree danh mục khi
  // không có search và tìm kiếm
  let newRecords = [];
  if (objectSearch.keyword || (req.query.sortKey && req.query.sortValue)) {
    newRecords = productCategories;
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
  } else {
    newRecords = createTreeHelper.tree(productCategories);
    newRecords = await createTreeHelper
      .displayLogs(newRecords)
      .then((res) => res);
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
  if (req.body.position === "") {
    const posCount = await ProductCategory.count();
    req.body.position = posCount + 1;
  } else {
    req.body.position = parseInt(req.body.position);
  }

  req.body.createdBy = {
    account_id: res.locals.user.id,
    createdAt: new Date(),
  };

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
    const updatedBy = {
      account_id: res.locals.user.id,
      updatedAt: new Date(),
    };
    await ProductCategory.updateOne(
      { _id: id },
      {
        ...req.body,
        $push: {
          updatedBy: updatedBy,
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

// [GET] /admin/product-category/detail/:id
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

// [DELETE] /admin/product-category/delete/:id
module.exports.delete = async (req, res) => {
  const id = req.params.id;

  await ProductCategory.updateOne(
    { _id: id },
    { deleted: true, deletedAt: new Date() }
  );

  req.flash("success", "Xóa danh mục và danh mục con thành công!");
  res.redirect("back");
};

// [PATCH] /admin/product-category/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
  const status = req.params.status;
  const id = req.params.id;

  const updatedBy = {
    account_id: res.locals.user.id,
    updatedAt: new Date(),
  };

  await ProductCategory.updateOne(
    {
      _id: id,
    },
    {
      status: status,
      $push: { updatedBy: updatedBy },
    }
  );

  req.flash("success", "Cập nhật trạng thái thành công");
  res.redirect("back");
};

// [PATCH] /admin/product-category/change-multi
module.exports.changeMulti = async (req, res) => {
  const type = req.body.type;
  const ids = req.body.ids.split(", ");

  const updatedBy = {
    account_id: res.locals.user.id,
    updatedAt: new Date(),
  };

  switch (type) {
    case "active":
      await ProductCategory.updateMany(
        { _id: { $in: ids } },
        { status: "active", $push: { updatedBy: updatedBy } }
      );
      req.flash(
        "success",
        `Cập nhật trạng thái của ${ids.length} sản phẩm thành công`
      );
      break;

    case "inactive":
      await ProductCategory.updateMany(
        { _id: { $in: ids } },
        { status: "inactive", $push: { updatedBy: updatedBy } }
      );
      req.flash(
        "success",
        `Cập nhật trạng thái của ${ids.length} sản phẩm thành công`
      );
      break;

    case "delete-all":
      await ProductCategory.updateMany(
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

        await ProductCategory.updateOne(
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
