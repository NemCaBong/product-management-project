const ProductCategory = require("../../models/product-category.model");
const Product = require("../../models/product.model");
const User = require("../../models/user.model");
const Account = require("../../models/account.model");

// [GET] /admin/dashboard
module.exports.dashboard = async (req, res) => {
  // thống kê các thông tin cơ bản.
  const statistic = {
    categoryProduct: {
      total: 0,
      active: 0,
      inactive: 0,
    },
    product: {
      total: 0,
      active: 0,
      inactive: 0,
    },
    account: {
      total: 0,
      active: 0,
      inactive: 0,
    },
    user: {
      total: 0,
      active: 0,
      inactive: 0,
    },
  };

  statistic.categoryProduct.total = await ProductCategory.count({
    deleted: false,
  });

  statistic.categoryProduct.active = await ProductCategory.count({
    deleted: false,
    status: "active",
  });

  statistic.categoryProduct.inactive = await ProductCategory.count({
    deleted: false,
    status: "inactive",
  });

  statistic.product.total = await Product.count({
    deleted: false,
  });

  statistic.product.inactive = await Product.count({
    deleted: false,
    status: "inactive",
  });
  statistic.product.active = await Product.count({
    deleted: false,
    status: "active",
  });

  statistic.user.total = await User.count({
    deleted: false,
  });

  statistic.user.inactive = await User.count({
    deleted: false,
    status: "inactive",
  });

  statistic.user.active = await User.count({
    deleted: false,
    status: "active",
  });

  statistic.account.total = await Account.count({
    deleted: false,
  });

  statistic.account.inactive = await Account.count({
    deleted: false,
    status: "inactive",
  });
  statistic.account.active = await Account.count({
    deleted: false,
    status: "active",
  });
  res.render("admin/pages/dashboard/index", {
    pageTitle: "Trang tổng quan",
    statistic: statistic,
  });
};
