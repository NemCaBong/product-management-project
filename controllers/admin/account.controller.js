const systemConfig = require("../../config/system");
const filterStatusHelper = require("../../helpers/filterStatus");
const searchHelper = require("../../helpers/search");
const paginationHelper = require("../../helpers/pagination");
const createTreeHelper = require("../../helpers/createTree");
const md5 = require("md5");

const Account = require("../../models/account.model");
const Role = require("../../models/role.model");

// [GET] /admin/accounts
module.exports.index = async (req, res) => {
  let find = {
    deleted: false,
  };

  const accounts = await Account.find(find).select("-token -password");

  for (acc of accounts) {
    const role = await Role.findOne({
      deleted: false,
      _id: acc.role_id,
    });
    acc.role = role;
  }

  res.render("admin/pages/accounts/index", {
    pageTitle: "Danh sách tài khoản",
    accounts: accounts,
  });
};

// [GET] /admin/accounts/create
module.exports.create = async (req, res) => {
  const roles = await Role.find({
    deleted: false,
  });
  res.render("admin/pages/accounts/create", {
    pageTitle: "Tạo mới tài khoản",
    roles: roles,
  });
};

// [POST] /admin/accounts/create
module.exports.createPost = async (req, res) => {
  const emailExist = await Account.findOne({
    deleted: false,
    email: req.body.email,
  });
  // Không đc trùng email
  if (emailExist) {
    req.flash("error", `Email ${emailExist.email} đã tồn tại`);
    res.redirect("back");
  } else {
    req.body.password = md5(req.body.password);
    const record = new Account(req.body);
    await record.save();
    res.redirect(`${systemConfig.prefixAdmin}/accounts`);
  }
};
