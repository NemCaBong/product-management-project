const Account = require("../../models/account.model");
const md5 = require("md5");
// [GET] /admin/my-account
module.exports.index = async (req, res) => {
  res.render("admin/pages/my-account/index", {
    pageTitle: "Trang thông tin cá nhân",
  });
};
// [GET] /admin/my-account/edit
module.exports.edit = async (req, res) => {
  res.render("admin/pages/my-account/edit", {
    pageTitle: "Chỉnh sửa thông tin cá nhân",
  });
};

// [GET] /admin/my-account/edit
module.exports.editPatch = async (req, res) => {
  // Copy từ account editPatch sang vì chúng nó giống y như nhau

  // Nếu như trong pug chúng ta chỉ cần user.id là sử dụng đc biến user này
  // thì trong nodejs chúng ta cần res.locals.user.id
  const id = res.locals.user.id;
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
