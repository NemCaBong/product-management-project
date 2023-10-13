const systemConfig = require("../../config/system");
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

// [GET] /admin/accounts/edit/:id
module.exports.edit = async (req, res) => {
  let find = {
    deleted: false,
    _id: req.params.id,
  };

  try {
    const account = await Account.findOne(find);

    const roles = await Role.find({
      deleted: false,
    });

    res.render("admin/pages/accounts/edit", {
      pageTitle: "Chỉnh sửa tài khoản",
      data: account,
      roles: roles,
    });
  } catch (err) {
    res.redirect(`${systemConfig.prefixAdmin}/accounts`);
  }
};

// [PATCH] /admin/accounts/edit/:id
module.exports.editPatch = async (req, res) => {
  const id = req.params.id;
  const emailExist = await Account.findOne({
    // $ne: not equally, dùng để tìm kiếm
    _id: { $ne: id },
    deleted: false,
    email: req.body.email,
  });

  // Không đc trùng email
  if (emailExist) {
    req.flash("error", `Email ${emailExist.email} đã tồn tại`);
  } else {
    if (req.body.password) {
      req.body.password = md5(req.body.password);
    } else {
      // delete đi key password
      delete req.body.password;
    }
    await Account.updateOne({ _id: id }, req.body);
    req.flash("success", "Cập nhật tài khoản thành công");
  }

  res.redirect("back");
};

// [GET] /admin/accounts/detail/:id
module.exports.detail = async (req, res) => {
  try {
    const find = {
      deleted: false,
      _id: req.params.id,
    };

    const account = await Account.findOne(find);
    const role = await Role.findOne({
      deleted: false,
      _id: account.role_id,
    });
    account.role = role;
    res.render("admin/pages/accounts/detail", {
      pageTitle: "Chi tiết sản phẩm",
      account: account,
    });
  } catch (error) {
    res.redirect(`${systemConfig.prefixAdmin}/accounts`);
  }
};

// [DELETE] /admin/accounts/delete/:id
module.exports.delete = async (req, res) => {
  const id = req.params.id;
  await Account.updateOne(
    { _id: id },
    { deleted: true, deletedAt: new Date() }
  );
  res.redirect("back");
};

// [PATCH] /admin/accounts/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
  const status = req.params.status;
  const id = req.params.id;

  // update status of product
  await Account.updateOne({ _id: id }, { status: status });
  req.flash("success", "Cập nhật trạng thái thành công");
  res.redirect("back");
};
